import { EventEmitter } from 'events';

import { initializeController as initializeRawPacketController } from './raw-packet-controller';
import { startServer } from './server';
import { initializeController as initializeTcpDumpController } from './tcp-dump-controller';

async function startApplication() {
  const eventEmitter = new EventEmitter();
  // await startServer(80, '0.0.0.0');
  // initializeRawPacketController(eventEmitter);
  initializeTcpDumpController(eventEmitter);
}


startApplication().then(() => {
  console.log('Application successfully started');
}).catch((err: Error) => {
  console.error('Unexpected error occurred: ', err.message);
  process.exit(1);
})