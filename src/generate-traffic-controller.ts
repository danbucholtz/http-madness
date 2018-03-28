import * as request from 'request';
import { getRandomInt } from './utils';
import { getPollingInterval, shouldGenerateTraffic } from './defaults';

export function initializeController() {
  if (shouldGenerateTraffic()) {
    beginPolling();
  }
  
}

function beginPolling() {
  setTimeout(async () => {
    await generateTraffic();
    beginPolling();
  }, getPollingInterval())
}

export async function generateTraffic() {
  const randomSuffixIndex = getRandomInt(0, suffixs.length - 1);
  const randomSuffix = suffixs[randomSuffixIndex];
  const url = `http://localhost:8080${randomSuffix}`;
  await makeRequest(url);
}

export function makeRequest(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
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

const suffixs = [
  '/rodgers',
  '/rodgers/12',
  '/jones',
  '/jones/33',
  '/nelson',
  '/nelson/87',
  '/adams',
  '/adams/17',
  '/cobb',
  '/cobb/18'
];
