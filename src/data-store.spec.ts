
import { commonLogToHttpData } from './common-log';
import { convertDateToCommonLogFormat } from './date-utils';
import {
  getCurrentAlertStatusInternal,
  getEndpointsWithMoreHitsThan,
  getMeanApiHits,
  getMostHitEndpoints,
  isSystemAlerting,
  removeOldData,
  updateAlertStatusInternal
} from './data-store';
import * as defaults from './defaults';
import { HTTPRequestResponseData, SystemAlert } from './interfaces';

describe('Data Store', () => {
  describe('getMostHitEndpoints', () => {
    it('should return the endpoints with the most matches', () => {
      const map = new Map<string, number>();
      map.set('/1', 1);
      map.set('/2', 2);
      map.set('/3', 4);
      map.set('/4', 4);
      map.set('/5', 2);
      map.set('/6', 1);

      const results = getMostHitEndpoints(map);
      expect(results.endpoints.length).toEqual(2);
      expect(results.endpoints[0]).toEqual('/3');
      expect(results.endpoints[1]).toEqual('/4');
      expect(results.numberOfHits).toEqual(4);
    });
  });

  describe('getMeanApiHits', () => {
    it('should return the mean value', () => {
      const map = new Map<string, number>();
      map.set('/1', 1);
      map.set('/2', 2);
      map.set('/3', 4);
      map.set('/4', 4);
      map.set('/5', 2);
      map.set('/6', 1);

      const result = getMeanApiHits(map);
      expect(result).toEqual(2.33);
    });
  });

  describe('getEndpointsWithMoreHitsThan', () => {
    it('should return entries with more hits than the number provided', () => {
      const map = new Map<string, number>();
      map.set('/1', 15);
      map.set('/2', 2);
      map.set('/3', 42);
      map.set('/4', 7);
      map.set('/5', 1);
      map.set('/6', 3);

      const results = getEndpointsWithMoreHitsThan(3, map);
      expect(results.length).toEqual(3);
      expect(results[0]).toEqual('/1');
      expect(results[1]).toEqual('/3');
      expect(results[2]).toEqual('/4');

      const resultsTwo = getEndpointsWithMoreHitsThan(100, map);
      expect(resultsTwo.length).toEqual(0);
    });
  });

  describe('removeOldData', () => {
    it('should not alter entries that are more recent then two minutes', () => {
      
      const entryOne = generateHttpRequestResponseData(convertDateToCommonLogFormat(new Date()), '/1');
      const entryTwo = generateHttpRequestResponseData(convertDateToCommonLogFormat(new Date()), '/2');
      const entryThree = generateHttpRequestResponseData(convertDateToCommonLogFormat(new Date()), '/2');
      const entryFour = generateHttpRequestResponseData(convertDateToCommonLogFormat(new Date()), '/4');

      const date = new Date();
      date.setTime(Date.now() - 10 * 1000);
      const entryFive = generateHttpRequestResponseData(convertDateToCommonLogFormat(date), '/5');

      const messages = [
        entryOne,
        entryTwo,
        entryThree,
        entryFour,
        entryFive
      ];

      const map = new Map<string, number>();
      map.set(entryOne.endpoint, 1);
      map.set(entryTwo.endpoint, 2);
      map.set(entryFour.endpoint, 1);
      map.set(entryFive.endpoint, 1);

      const millis = Date.now() - 2 * 60 * 1000;
      const results = removeOldData(millis, messages, map);
      expect(results.updatedMap.size).toBe(4);
      expect(results.updatedMap.get(entryOne.endpoint)).toEqual(1);
      expect(results.updatedMap.get(entryTwo.endpoint)).toEqual(2);
      expect(results.updatedMap.get(entryFour.endpoint)).toEqual(1);
      expect(results.updatedMap.get(entryFive.endpoint)).toEqual(1);

      expect(results.updatedQueue.length).toEqual(5);
      expect(results.updatedQueue[0]).toEqual(entryOne);
      expect(results.updatedQueue[1]).toEqual(entryTwo);
      expect(results.updatedQueue[2]).toEqual(entryThree);
      expect(results.updatedQueue[3]).toEqual(entryFour);
      expect(results.updatedQueue[4]).toEqual(entryFive);
    });

    it('should purge dates older than n minutes', () => {
      const oldDate = new Date();
      oldDate.setTime(Date.now() - (2 * 60 * 1000) - 5000); // 2 minutes, 5s ago
      const newDate = new Date();
      const entryOne = generateHttpRequestResponseData(convertDateToCommonLogFormat(oldDate), '/1');
      const entryTwo = generateHttpRequestResponseData(convertDateToCommonLogFormat(oldDate), '/2');
      const entryThree = generateHttpRequestResponseData(convertDateToCommonLogFormat(oldDate), '/2');
      const entryFour = generateHttpRequestResponseData(convertDateToCommonLogFormat(newDate), '/2');
      const entryFive = generateHttpRequestResponseData(convertDateToCommonLogFormat(newDate), '/5');

      const messages = [
        entryOne,
        entryTwo,
        entryThree,
        entryFour,
        entryFive
      ];

      const map = new Map<string, number>();
      map.set(entryOne.endpoint, 1);
      map.set(entryTwo.endpoint, 3);
      map.set(entryFive.endpoint, 1);

      const millis = Date.now() - 2 * 60 * 1000;
      const results = removeOldData(millis, messages, map);
      expect(results.updatedMap.size).toBe(2);
      expect(results.updatedMap.get(entryOne.endpoint)).toBeFalsy();
      expect(results.updatedMap.get(entryTwo.endpoint)).toEqual(1);
      expect(results.updatedMap.get(entryFive.endpoint)).toEqual(1);

      expect(results.updatedQueue.length).toEqual(2);
      expect(results.updatedQueue[0]).toEqual(entryFour);
      expect(results.updatedQueue[1]).toEqual(entryFive);
    });
  });

  describe('isSystemAlerting', () => {
    it('should be false when queue length is < n', () => {
      const empty: HTTPRequestResponseData[] = [];
      const result = isSystemAlerting(empty);
      expect(result).toEqual(false);
    });

    it('should be true when queue length is > n', () => {
      const full: HTTPRequestResponseData[] = [];
      for (let i = 0; i < 250; i++) {
        full.push({} as any);
      }
      const result = isSystemAlerting(full);
      expect(result).toEqual(true);
    });
  });

  describe('getCurrentAlertStatusInternal', () => {
    it('should return false when the queue is empty', () => {
      const empty: SystemAlert[] = [];
      const result = getCurrentAlertStatusInternal(empty);
      expect(result.date).toEqual(null);
      expect(result.isAlerting).toEqual(false);
    });
  });

  describe('updateAlertStatusInternal', () => {
    it('should return false when the system status does not change', () => {
      const queue: HTTPRequestResponseData[] = [];
      const alertQueue: SystemAlert[] = [];
      const result = updateAlertStatusInternal(queue, alertQueue);
      expect(result).toEqual(false);
      expect(queue.length).toEqual(0);
      expect(alertQueue.length).toEqual(0);
    });

    it('should return false when the system is not alerting and wasnt previously alerting', () => {
      const queue: HTTPRequestResponseData[] = [];
      const alertQueue: SystemAlert[] = [{
        date: new Date(),
        isAlerting: false,
        numberOfHits: 0
      }];
      const result = updateAlertStatusInternal(queue, alertQueue);
      expect(result).toEqual(false);
      expect(queue.length).toEqual(0);
      expect(alertQueue.length).toEqual(1);
    });

    it('should return true when the system is not alerting but previously was alerting', () => {
      const queue: HTTPRequestResponseData[] = [];
      const alertQueueEntry: SystemAlert = {
        date: new Date(),
        isAlerting: true,
        numberOfHits: 10
      };
      const alertQueue: SystemAlert[] = [alertQueueEntry];
      const result = updateAlertStatusInternal(queue, alertQueue);
      expect(result).toEqual(true);
      expect(queue.length).toEqual(0);
      expect(alertQueue.length).toEqual(2);
      expect(alertQueue[0]).toEqual(alertQueueEntry)
      expect(alertQueue[1].isAlerting).toEqual(false)
    });

    it('should return false when the system is alerting and previously was alerting', () => {
      const queueEntry: any = {};
      const queue: HTTPRequestResponseData[] = [queueEntry];
      const alertQueueEntry: SystemAlert = {
        date: new Date(),
        isAlerting: true,
        numberOfHits: 10
      };
      const alertQueue: SystemAlert[] = [alertQueueEntry];

      spyOn(defaults, defaults.getAlertThreshold.name).and.returnValue(0);
      const result = updateAlertStatusInternal(queue, alertQueue);
      expect(result).toEqual(false);
      expect(queue.length).toEqual(1);
      expect(alertQueue.length).toEqual(1);
      expect(alertQueue[0]).toEqual(alertQueueEntry);
      expect(defaults.getAlertThreshold).toHaveBeenCalled();
    });

    it('should return true when the system is alerting and previously was not alerting', () => {
      const queueEntry: any = {};
      const queue: HTTPRequestResponseData[] = [queueEntry];
      const alertQueueEntry: SystemAlert = {
        date: new Date(),
        isAlerting: false,
        numberOfHits: 10
      };
      const alertQueue: SystemAlert[] = [alertQueueEntry];

      spyOn(defaults, defaults.getAlertThreshold.name).and.returnValue(0);
      const result = updateAlertStatusInternal(queue, alertQueue);
      expect(result).toEqual(true);
      expect(queue.length).toEqual(1);
      expect(alertQueue.length).toEqual(2);
      expect(alertQueue[0]).toEqual(alertQueueEntry);
      expect(alertQueue[1].isAlerting).toEqual(true);
      expect(defaults.getAlertThreshold).toHaveBeenCalled();
    });
  });
});

function generateHttpRequestResponseData(dateString: string, endpoint: string) {
  const sampleLog = `127.0.0.1 user-identifier frank [${dateString} -0700] "GET ${endpoint} HTTP/1.0" 200 2326`;
  return commonLogToHttpData(sampleLog);
}
