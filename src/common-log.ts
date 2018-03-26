import { getMonthFromShortString } from './date-utils';
export interface HTTPPacket {
  sourceIpAddress: string;
  user: string;
  date: Date;
  httpMethod: string;
  endpoint: string;
  httpProtocol: string;
  statusCode: number;
  responseLength: number;
}

export function packetToCommonLog(packet: HTTPPacket): string{
  return '';
}

export function commonLogToPacket(commonLog: string): HTTPPacket {
  return null;
}

/*
127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326
*/

export function getStatusCodeFromCLF(commonLog: string): number {
  const statusCode = singleMatchGroup(STATUS_CODE_REGEX, commonLog);
  return parseInt(statusCode);
}

export function getContentLengthFromCLF(commonLog: string): number {
  const lastIndex = commonLog.lastIndexOf(' ');
  if (lastIndex === -1) {
    throw new Error('Unexpected string format');
  }
  const contentLength = parseInt(commonLog.substring(lastIndex));
  if (isNaN(contentLength)) {
    throw new Error('Unexpected string format');
  }
  return contentLength;
}

export function getHttpMethodFromCLF(commonLog: string): string {
  return singleMatchGroup(HTTP_METHOD_REGEX, commonLog);
}

export function getHttpEndpointFromCLF(commonLog: string): string {
  return singleMatchGroup(HTTP_ENDPOINT_REGEX, commonLog);
}

export function getHttpProtocolFromCLF(commonLog: string): string {
  return singleMatchGroup(HTTP_PROTOCOL_REGEX, commonLog);
}

export function getUsernameFromCLF(commonLog: string): string {
  const result = singleMatchGroup(USERNAME_REGEX, commonLog);
  if (result === '-') {
    return null;
  }
  return result;
}

export function getUserIdentifierFromCLF(commonLog: string): string {
  const result = singleMatchGroup(USER_IDENTIFIER_REGEX, commonLog);
  if (result === '-') {
    return null;
  }
  return result;
}

export function getIPAddressFromCLF(commonLog: string): string {
  return singleMatchGroup(IP_ADDRESS_REGEX, commonLog);
}

export function getDateFromCLF(commonLog: string): Date {
  const dateString = singleMatchGroup(DATE_REGEX, commonLog);
  const dayOfMonth = parseInt(singleMatchGroup(DAY_OF_MONTH_REGEX, dateString));
  const shortMonthString = singleMatchGroup(MONTH_SHORTNAME_REGEX, dateString);
  const monthInt = getMonthFromShortString(shortMonthString);
  const year = parseInt(singleMatchGroup(YEAR_REGEX, dateString));
  const hour = parseInt(singleMatchGroup(HOURS_REGEX, dateString));
  const minutes = parseInt(singleMatchGroup(MINUTES_REGEX, dateString));
  const seconds = parseInt(singleMatchGroup(SECONDS_REGEX, dateString));
  // TODO - ignore the timezone for now

  const date = new Date();
  date.setDate(dayOfMonth);
  date.setMonth(monthInt);
  date.setFullYear(year);
  date.setHours(hour);
  date.setMinutes(minutes);
  date.setSeconds(seconds);

  return date;
}

function singleMatchGroup(regex: RegExp, input: string) {
  const toExecute = new RegExp(regex);
  const matches = toExecute.exec(input);
  if (matches.length !== 2) {
    throw new Error('Unexpected string format - the regex does not match');
  }
  return matches[1];
}

const HTTP_METHOD_REGEX = /"([\S]*?)\s[\S\s]*?"/gm;
const HTTP_ENDPOINT_REGEX = /"[\S]*?\s([\S]*?)\s[\S\s]*?"/gm;
const HTTP_PROTOCOL_REGEX = /"[\S]*?\s[\S]*?\s([\S]*?)"/gm;
const STATUS_CODE_REGEX = /"[\S\s]*?"\s([0-9]*?)\s/gm;
const DATE_REGEX = /\[([\s\S]*?)\]/gm;

// Javascript Date Regexes
const DAY_OF_MONTH_REGEX = /([0-9]*?)\/[\s\S]*/gm;
const MONTH_SHORTNAME_REGEX = /[\S]*?\/([\S]*?)\/[\S\s]*/gm;
const YEAR_REGEX = /[\S]*?\/[\S]*\/([\S]*?):[\S\s]*/gm;
const HOURS_REGEX = /[\S]*?\/[\S]*\/[\S]*?:([\S]*?):[\S\s]*/gm;
const MINUTES_REGEX = /[\S]*?\/[\S]*\/[\S]*?:[\S]*:([\S]*?):[\S\s]*/gm;
const SECONDS_REGEX = /[\S]*?\/[\S]*\/[\S]*?:[\S]*:([\S]*?)[\s]-[\S\s]*/gm;
const TIME_ZONE_REGEX = /[\S\s]*?-([0-9][0-9])[\s\S]*/gm;
const USERNAME_REGEX = /[\S]*?\s[\S]*?\s([\S]*?)\s[\S\s]*/gm;
const USER_IDENTIFIER_REGEX = /[\S]*?\s([\S]*?)\s[\S\s]*/gm;
const IP_ADDRESS_REGEX = /([\S]*)\s[\S\s]*/gm;