import { EventEmitter } from 'events';

import { HTTP_DATA_PROCESSED_EVENT, SNAPSHOT_REPORT_CREATED_EVENT } from './constants';
import { 
  cleanUpLongDurationData,
  cleanUpShortDurationData,
  getEndpointsWithMoreHitsThanLongTerm,
  getEndpointsWithMoreHitsThanShortTerm,
  getMeanApiHitsLongDuration,
  getMeanApiHitsShortDuration,
  getMostHitEndpointsLongDuration,
  getMostHitEndpointsShortDuration,
  receiveNewHttpData
} from './data-store';

import { HTTPRequestResponseData, SnapshotReport} from './interfaces';

export function initializeController(emitter: EventEmitter) {
  emitter.addListener(HTTP_DATA_PROCESSED_EVENT, (httpRequestResponseDataObjects: HTTPRequestResponseData[]) => {
    receiveNewHttpData(httpRequestResponseDataObjects);
  });

  setInterval(() => processTenSecondUpdate(emitter), TEN_SECONDS_IN_MILLIS);
  setInterval(processTwoMinuteUpdate, TWO_MINUTES_IN_MILLIS);
}

export function processTenSecondUpdate(emitter: EventEmitter) {
  // first clean up the short term data, then do some calculationzzz
  const date = new Date();
  cleanUpShortDurationData();
  
  const shortTermMeanApiHits = getMeanApiHitsShortDuration();
  const longTermMeanApiHits = getMeanApiHitsLongDuration();
  const snapshotReport: SnapshotReport = {
    date,
    shortTermMostHits: getMostHitEndpointsShortDuration(),
    longTermMostHits: getMostHitEndpointsLongDuration(),
    shortTermMeanApiHits,
    longTermMeanApiHits,
    shortTermApisWithMoreHits: getEndpointsWithMoreHitsThanShortTerm(shortTermMeanApiHits * SIGNIFICANT_TRAFFIC_MULTIPLIER),
    longTermApisWithMoreHits: getEndpointsWithMoreHitsThanLongTerm(longTermMeanApiHits * SIGNIFICANT_TRAFFIC_MULTIPLIER)
  };

  emitter.emit(SNAPSHOT_REPORT_CREATED_EVENT, snapshotReport);
}

export function processTwoMinuteUpdate() {
  cleanUpLongDurationData();
}

const TWO_MINUTES_IN_MILLIS = 120 * 1000;
const TEN_SECONDS_IN_MILLIS = 10 * 1000;
const SIGNIFICANT_TRAFFIC_MULTIPLIER = 2;