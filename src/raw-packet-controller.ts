import { EventEmitter } from 'events';

import {
  PACKETS_RECEIVED_EVENT
} from './constants';

export function initializeController(emitter: EventEmitter) {
  emitter.addListener(PACKETS_RECEIVED_EVENT, processRawPackets);
}

export function processRawPackets(packets: string[]) {
  return packets.map(packet => convertToPacketObject(packet)).filter(packet => !!packet);
}

export function convertToPacketObject(rawPacket: string): any {
  // TODO
}

export interface RequestPacket {
  sourceIpAddress: string;
  user: string;
  date: Date;
  httpMethod: string;
  endpoint: string;
  httpProtocol: string;
  statusCode: number;
  responseLength: number;
}
