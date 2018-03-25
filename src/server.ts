import * as express from 'express';
import { Server } from 'http';

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