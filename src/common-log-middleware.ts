import { EventEmitter } from 'events';

import * as auth from 'basic-auth';
import * as onFinished from 'on-finished';

import { COMMON_LOG_MESSAGES_RECEIVED_EVENT } from './constants';
import { convertDateToCommonLogFormat } from './date-utils';

export function commonLogMiddleware(req: any, res: any, next: Function, emitter: EventEmitter) {
  next();
  // the request loses the ip address after it finishes, so capture it up front
  const ipAddress = getIpAddressFromRequest(req);
  onFinished(res, () => {
    createLogEntryFromRequestAndResponse(req, res, emitter, ipAddress);
  });
}

export function createLogEntryFromRequestAndResponse(req: any, res: any, emitter: EventEmitter, ipAddress: string) {
  const commonLogMessage = generateCommonLogStringFromReqAndRes(req, res, ipAddress);
  process.nextTick(() => {
    emitter.emit(COMMON_LOG_MESSAGES_RECEIVED_EVENT, [commonLogMessage]);
  });
}

function generateCommonLogStringFromReqAndRes(req: any, res: any, ipAddress: string) {
  
  const userIdentifier = getUserIdentifier(req);
  const username = getUsername(req);
  const dateString = getDate(req);
  const httpMethod = getMethod(req);
  const endpoint = getUrl(req);
  const httpVersion = getHttpVersion(req);
  const statusCode = getStatus(res);
  const contentLength = getContentLength(res);

  return `${ipAddress} ${userIdentifier} ${username} [${dateString} -0000] "${httpMethod} ${endpoint} HTTP/${httpVersion}" ${statusCode} ${contentLength}`
}

function getIpAddressFromRequest(req: any): string {
  return req.ip || req._remoteAddress || (req.connect && req.connection.remoteAddress) || null;
}

function getUsername(req: any): string {
  const credentials = auth(req);
  return credentials && credentials.name && credentials.name.length > 0 ? credentials.name : '-';
}

function getUserIdentifier(req: any): string {
  // The official express logger does not support this field, so I think it's fine that we don't either for this POC
  return '-';
}

function getDate(req: any): string {
  const date = new Date();
  return convertDateToCommonLogFormat(date);
}

function getMethod(req: any): string {
  return req.method;
}

function getUrl(req: any): string {
  return req.originalUrl || req.url;
}

function getHttpVersion(req: any): string {
  return req.httpVersionMajor + '.' + req.httpVersionMinor;
}

function headersSent(res: any): boolean {
  return typeof res.headersSent !== 'boolean' ? Boolean(res._header) : res.headersSent;
}

function getStatus(res: any): string {
  return headersSent(res) ? String(res.statusCode) : null;
}

function getContentLength(res: any): string {
  if (!headersSent(res)) {
    return null;
  }

  return res.getHeader('content-length');
}