import { startServer } from './server';
import { startListeningToTcpDump } from './tcp-dump-listener';

async function startApplication() {
  await startServer(8080, '0.0.0.0');
  startListeningToTcpDump();
}


startApplication().then(() => {
  console.log('Application successfully started');
}).catch((err: Error) => {
  console.error('Unexpected error occurred: ', err.message);
  process.exit(1);
})