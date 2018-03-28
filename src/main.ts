import { EventEmitter } from 'events';

import { initializeController as initializeCommonLogController } from './common-log-controller';
import { initializeController as initializeGenerateTrafficController } from './generate-traffic-controller';
import { initializeController as initializeProcessDataController } from './process-data-controller';
import { initializeController as initializeReportController } from './report-controller';
import { startServer } from './server';

import { getIPAddress, getPort } from './defaults';

async function startApplication() {
  const eventEmitter = new EventEmitter();
  await startServer(getPort(), getIPAddress(), eventEmitter);
  initializeCommonLogController(eventEmitter);
  initializeGenerateTrafficController();
  initializeProcessDataController(eventEmitter);
  initializeReportController(eventEmitter);
}

startApplication().then(() => {
  console.log('Application successfully started');
}).catch((err: Error) => {
  console.error('Unexpected error occurred: ', err.message);
  process.exit(1);
})