import { EventEmitter } from 'events';
import { commonLogToHttpData } from './common-log';

import {
  COMMON_LOG_MESSAGES_RECEIVED_EVENT,
  HTTP_DATA_PROCESSED_EVENT
} from './constants';

export function initializeController(emitter: EventEmitter) {
  emitter.addListener(COMMON_LOG_MESSAGES_RECEIVED_EVENT, (commonLogMessage: string[]) => {
    processCommonLogMessages(commonLogMessage, emitter)
  });
}

export function processCommonLogMessages(commonLogMessages: string[], emitter: EventEmitter) {
  const httpDataObjects = commonLogMessages.map(commonLogMessage => commonLogToHttpData(commonLogMessage));
  emitter.emit(HTTP_DATA_PROCESSED_EVENT, httpDataObjects);
}
