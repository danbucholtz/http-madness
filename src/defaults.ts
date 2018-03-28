import {
  GENERATE_TRAFFIC_POLLING_INTERVAL_MILLIS,
  HTTP_MADNESS_ALERT_THRESHOLD,
  HTTP_MADNESS_GENERATE_TRAFFIC,
  HTTP_MADNESS_GENERATE_TRAFFIC_INTERVAL,
  HTTP_MADNESS_IP_ADDRESS,
  HTTP_MADNESS_LONG_DURATION_MILLIS,
  HTTP_MADNESS_PORT,
  HTTP_MADNESS_SHORT_DURATION_MILLIS,
  HTTP_MADNESS_SIGNIFICANT_TRAFFIC_MULTIPLIER,
  LONG_DURATION_IN_MILLIS,
  NUMBER_OF_REQUESTS_ALERT_THRESHOLD,
  PORT,
  SHORT_DURATION_IN_MILLIS,
  SIGNIFICANT_TRAFFIC_MULTIPLIER,
  IP_ADDRESS_TO_LISTEN
} from './constants';

export function getAlertThreshold(): number {
  if (process.env[HTTP_MADNESS_ALERT_THRESHOLD]) {
    return parseInt(process.env[HTTP_MADNESS_ALERT_THRESHOLD]);
  }
  return NUMBER_OF_REQUESTS_ALERT_THRESHOLD;
}

export function getPollingInterval(): number {
  if (process.env[HTTP_MADNESS_GENERATE_TRAFFIC_INTERVAL]) {
    return parseInt(process.env[HTTP_MADNESS_GENERATE_TRAFFIC_INTERVAL]);
  }
  return GENERATE_TRAFFIC_POLLING_INTERVAL_MILLIS;
}

export function getLongDurationInMillis(): number {
  if (process.env[HTTP_MADNESS_LONG_DURATION_MILLIS]) {
    return parseInt(process.env[HTTP_MADNESS_LONG_DURATION_MILLIS]);
  }
  return LONG_DURATION_IN_MILLIS;
}

export function getShortDurationInMillis(): number {
  if (process.env[HTTP_MADNESS_SHORT_DURATION_MILLIS]) {
    return parseInt(process.env[HTTP_MADNESS_SHORT_DURATION_MILLIS]);
  }
  return SHORT_DURATION_IN_MILLIS;
}

export function getSignificantTrafficMultiplier(): number {
  if (process.env[HTTP_MADNESS_SIGNIFICANT_TRAFFIC_MULTIPLIER]) {
    return parseInt(process.env[HTTP_MADNESS_SIGNIFICANT_TRAFFIC_MULTIPLIER]);
  }
  return SIGNIFICANT_TRAFFIC_MULTIPLIER;
}

export function getPort(): number {
  if (process.env[HTTP_MADNESS_PORT]) {
    return parseInt(process.env[HTTP_MADNESS_PORT]);
  }
  return PORT;
}

export function getIPAddress(): string {
  if (process.env[HTTP_MADNESS_IP_ADDRESS]) {
    return process.env[HTTP_MADNESS_IP_ADDRESS];
  }
  return IP_ADDRESS_TO_LISTEN;
}

export function shouldGenerateTraffic(): boolean {
  if (process.env[HTTP_MADNESS_GENERATE_TRAFFIC] && process.env[HTTP_MADNESS_GENERATE_TRAFFIC] === 'false') {
    return false;
  }
  return true;
}