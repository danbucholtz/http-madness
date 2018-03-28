import * as yargs from 'yargs';
const argv = yargs.argv;

import {
  GENERATE_TRAFFIC_POLLING_INTERVAL_MILLIS,
  LONG_DURATION_IN_MILLIS,
  NUMBER_OF_REQUESTS_ALERT_THRESHOLD,
  PORT,
  SHORT_DURATION_IN_MILLIS,
  SIGNIFICANT_TRAFFIC_MULTIPLIER,
  IP_ADDRESS_TO_LISTEN
} from './constants';

export function getAlertThreshold(): number {
  if (argv.alertTheshold) {
    return parseInt(argv.alertTheshold);
  }
  return NUMBER_OF_REQUESTS_ALERT_THRESHOLD;
}

export function getPollingInterval(): number {
  if (argv.pollingInterval) {
    return parseInt(argv.pollingInterval);
  }
  return GENERATE_TRAFFIC_POLLING_INTERVAL_MILLIS;
}

export function getLongDurationInMillis(): number {
  if (argv.longDuration) {
    return parseInt(argv.longDuration);
  }
  return LONG_DURATION_IN_MILLIS;
}

export function getShortDurationInMillis(): number {
  if (argv.shortDuration) {
    return parseInt(argv.shortDuration);
  }
  return SHORT_DURATION_IN_MILLIS;
}

export function getSignificantTrafficMultiplier(): number {
  if (argv.significantTraffic) {
    return parseInt(argv.significantTraffic);
  }
  return SIGNIFICANT_TRAFFIC_MULTIPLIER;
}

export function getPort(): number {
  if (argv.port) {
    return parseInt(argv.port);
  }
  return PORT;
}

export function getIPAddress(): string {
  if (argv.ipAddress) {
    return argv.ipAddress
  }
  return IP_ADDRESS_TO_LISTEN;
}