import { Server } from 'http';
import { createWriteStream } from 'fs';
import { join } from 'path';

import * as express from 'express';
import * as morgan from 'morgan';


export function startServer(port: number, host: string): Promise<StartServerResponse> {
  return new Promise((resolve, reject) => {
    const app = express();
    const server = app.listen(port, host, (err: Error) => {
      if (err) {
        return reject(err);
      }
      return resolve({
        server: server,
        expressApp: app
      });
    });

    // log all requests to access.log
    app.use(morgan('common', {
      stream: createWriteStream(join(__dirname, 'access.log'), {flags: 'a', autoClose: false})
    }));

    app.get('*', (request: any, response: any) => {
      response.statusCode = 200;
      response.send({success: true});
    });
  });
}

export interface StartServerResponse {
  server: Server;
  expressApp: express.Express;
}