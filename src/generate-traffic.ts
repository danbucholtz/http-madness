import { makeRequest } from './client-api';

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

setInterval(async () => {
  const randomSuffixIndex = getRandomInt(0, suffixs.length - 1);
  const randomSuffix = suffixs[randomSuffixIndex];
  console.log('Starting request');
  await makeRequest('http://localhost', 8080, randomSuffix);
  console.log('Ending request');
}, 1000);

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}