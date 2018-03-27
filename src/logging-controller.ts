import { createReadStream } from 'fs';
import { join } from 'path';

export function initializeController() {
  const stream = createReadStream(join(__dirname, 'access.log'));

  stream.on('data', (buffer: Buffer) => {
    console.log('data: ', buffer.toString());
  });

  stream.on('end', () => {
    console.log('\n\n\n\n\n\n\n End Event \n\n\n\n\n\n\n\n\n\n');
  });
}
