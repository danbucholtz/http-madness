import * as request from 'request';

export function makeRequest(hostname: string = 'http://localhost',
                            port: number = 8080,
                            pathname: string = '/'): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = `${hostname}:${port}${pathname}`;
    request(url, {
      method: 'GET'
    }, (err: Error, response: request.Response) => {
      if (err) {
        return reject(err);
      } else if (response.statusCode !== 200) {
        return reject(new Error(`Request failed with status code ${response.statusCode}: ${response.statusMessage}`));
      }
      return resolve();
    });
  });
}