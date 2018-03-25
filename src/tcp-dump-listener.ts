import { spawn } from 'child_process';
import { EventEmitter } from 'events';

import {
  CRASH_EVENT,
  PACKETS_RECEIVED_EVENT
} from './constants';

export function processTCPDumpOutput(data: string | Buffer, remainingString: string = '') {
  let input = remainingString.trim() + data.toString();
  const individualRawPackets = input.match(TCP_DUMP_REGEX);
  individualRawPackets.forEach(rawPacket => {
    input = input.replace(rawPacket, '');
  });
  remainingString = input;
  return {
    remainingString,
    individualRawPackets
  }
}

export function startListeningToTcpDump(interfaceToListenOn: string = 'lo0') {
  const eventEmitter = new EventEmitter();
  
  // Command found here - https://stackoverflow.com/questions/4777042/can-i-use-tcpdump-to-get-http-requests-response-header-and-response-body
  const tcpDump = spawn('tcpdump', [
    '-i',
    interfaceToListenOn,
    '-s', 
    '0',
    '-B',
    '524288',
    '-A',
    'tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420'
  ]);

  let remainingString = '';
  tcpDump.stdout.on('data', (data) => {
    const results = processTCPDumpOutput(data, remainingString);
    remainingString = results.remainingString;
    emitPackageReceivedEvent(eventEmitter, results.individualRawPackets);
  });
  
  
  tcpDump.on('close', (code) => {
    eventEmitter.emit(CRASH_EVENT, {
      reason: `TCP Dump exited with status code ${code}`
    });
  });
}

function emitPackageReceivedEvent(eventEmitter: EventEmitter, rawPackets: string[]) {
  process.nextTick(() => {
    eventEmitter.emit(PACKETS_RECEIVED_EVENT, rawPackets);
  })
}

const TCP_DUMP_REGEX = /\n[0-9]*?:[0-9]*?:[0-9]*?\.[\S\s]*?IP[\S\s]*?close/gm;