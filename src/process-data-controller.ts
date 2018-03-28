import { EventEmitter } from 'events';

import { HTTP_DATA_PROCESSED_EVENT, SNAPSHOT_REPORT_CREATED_EVENT } from './constants';

import {
  updateAlertStatus,
  cleanUpLongDurationData,
  cleanUpShortDurationData,
  getEndpointsWithMoreHitsThanLongTerm,
  getEndpointsWithMoreHitsThanShortTerm,
  getHistoricSystemAlerts,
  getMeanApiHitsLongDuration,
  getMeanApiHitsShortDuration,
  getMostHitEndpointsLongDuration,
  getMostHitEndpointsShortDuration,
  receiveNewHttpData
} from './data-store';

import {
  getLongDurationInMillis,
  getShortDurationInMillis,
  getSignificantTrafficMultiplier
} from './defaults';

import { HTTPRequestResponseData, SnapshotReport} from './interfaces';

export function initializeController(emitter: EventEmitter) {
  emitter.addListener(HTTP_DATA_PROCESSED_EVENT, (httpRequestResponseDataObjects: HTTPRequestResponseData[]) => {
    receiveNewHttpData(httpRequestResponseDataObjects);
  });

  setInterval(() => processShortDurationUpdate(emitter), getShortDurationInMillis());
  setInterval(processLongDurationUpdate, getLongDurationInMillis());
}

export function processShortDurationUpdate(emitter: EventEmitter) {
  // first clean up the short term data, then do some calculationzzz
  const date = new Date();
  cleanUpShortDurationData();
  const hasAlertStatusChanged = updateAlertStatus();
  
  const shortTermMeanApiHits = getMeanApiHitsShortDuration();
  const longTermMeanApiHits = getMeanApiHitsLongDuration();
  const snapshotReport: SnapshotReport = {
    date,
    shortTermMostHits: getMostHitEndpointsShortDuration(),
    longTermMostHits: getMostHitEndpointsLongDuration(),
    shortTermMeanApiHits,
    longTermMeanApiHits,
    shortTermApisWithMoreHits: getEndpointsWithMoreHitsThanShortTerm(shortTermMeanApiHits * getSignificantTrafficMultiplier()),
    longTermApisWithMoreHits: getEndpointsWithMoreHitsThanLongTerm(longTermMeanApiHits * getSignificantTrafficMultiplier()),
    hasAlertStatusChanged,
    historicSystemAlerts: getHistoricSystemAlerts()
  };

  emitter.emit(SNAPSHOT_REPORT_CREATED_EVENT, snapshotReport);
}

export function processLongDurationUpdate() {
  cleanUpLongDurationData();
}
