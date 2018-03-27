import {
  HTTPRequestResponseData,
  NumberOfHits
} from './interfaces';

let shortDurationQueue: HTTPRequestResponseData[] = [];
let longDurationQueue: HTTPRequestResponseData[] = [];

let shortDurationEndpointMap = new Map<string, number>();
let longDurationEndpointMap = new Map<string, number>();

export function receiveNewHttpData(httpRequestResponseDataObjects: HTTPRequestResponseData[]) {
  shortDurationQueue = shortDurationQueue.concat(httpRequestResponseDataObjects);
  longDurationQueue = longDurationQueue.concat(httpRequestResponseDataObjects);
  // update the maps with the latest data
  for (const dataObject of httpRequestResponseDataObjects) {
    let shortDurationNumberOfHits = shortDurationEndpointMap.get(dataObject.endpoint) || 0;
    shortDurationNumberOfHits++;
    shortDurationEndpointMap.set(dataObject.endpoint, shortDurationNumberOfHits);

    let longDurationNumberOfHits = longDurationEndpointMap.get(dataObject.endpoint) || 0;
    longDurationNumberOfHits++;
    longDurationEndpointMap.set(dataObject.endpoint, longDurationNumberOfHits);
  }
}

export function cleanUpShortDurationData() {
  // TODO - could make more generic, for now it's fine
  const tenSecondsInMillis = 10 * 1000; // 10 seconds * 1000 millis/second = 10000 millis
  const minimumMillis = Date.now() - tenSecondsInMillis;
  const results = removeOldData(minimumMillis, shortDurationQueue, shortDurationEndpointMap);
  shortDurationEndpointMap = results.updatedMap;
  shortDurationQueue = results.updatedQueue;
}

export function cleanUpLongDurationData() {
  // TODO - could make more generic, for now it's fine
  const twoMinutesInMillis = 2 * 60 * 1000; // 2 minutes * 60 seconds/minute * 1000 millis/second = 120000 millis
  const minimumMillis = Date.now() - twoMinutesInMillis;
  const results = removeOldData(minimumMillis, longDurationQueue, longDurationEndpointMap);
  longDurationEndpointMap = results.updatedMap;
  longDurationQueue = results.updatedQueue;
}

export function getMostHitEndpointsShortDuration() {
  return getMostHitEndpoints(shortDurationEndpointMap);
}

export function getMostHitEndpointsLongDuration() {
  return getMostHitEndpoints(longDurationEndpointMap);
}

export function getEndpointsWithMoreHitsThanShortTerm(moreHitsThan: number) {
  return getEndpointsWithMoreHitsThan(moreHitsThan, shortDurationEndpointMap);
}

export function getEndpointsWithMoreHitsThanLongTerm(moreHitsThan: number) {
  return getEndpointsWithMoreHitsThan(moreHitsThan, longDurationEndpointMap);
}

export function getEndpointsWithMoreHitsThan(moreHitsThan: number, map: Map<string, number>) {
  const endpoints: string[] = [];
  map.forEach((value: number, endpoint: string) => {
    if (value > moreHitsThan) {
      endpoints.push(endpoint);
    }
  });
  return endpoints;
}

export function getMostHitEndpoints(occurenceMap: Map<string, number>): NumberOfHits {
  let numberOfHits = -1;
  let endpoints: string[] = [];
  occurenceMap.forEach((value: number, endpoint: string) => {
    if (value === numberOfHits) {
      endpoints.push(endpoint);
    } else if (value > numberOfHits) {
      numberOfHits = value;
      endpoints = [endpoint];
    }
  });
  return {
    numberOfHits,
    endpoints
  };
}

export function getMeanApiHitsShortDuration() {
  return getMeanApiHits(shortDurationEndpointMap);
}

export function getMeanApiHitsLongDuration() {
  return getMeanApiHits(longDurationEndpointMap);
}

export function getMeanApiHits(map: Map<string, number>) {
  const array = Array.from(map);
  if (!array.length) {
    return 0;
  }
  const totalApiHits = array.map(entry => entry[1]).reduce((previousValue: number, next: number) => previousValue + next);
  return parseFloat((totalApiHits/array.length).toFixed(2));
}

export function removeOldData(minimumMillis: number, queue: HTTPRequestResponseData[], occurenceMap: Map<string, number>) {
  for (let i = 0; i < queue.length; i++) {
    const dataEntry = queue[i];
    if (dataEntry.dateInMillis < minimumMillis) {
      queue[i] = null;
      // decrement the endpoint occurence map
      let numberOfOccurences = occurenceMap.get(dataEntry.endpoint) || 0;
      // decrement it
      numberOfOccurences--;
      if (numberOfOccurences <= 0) {
        // remove it from the map if it's less than or equal to zero
        occurenceMap.delete(dataEntry.endpoint);
      } else {
        // set the data again
        occurenceMap.set(dataEntry.endpoint, numberOfOccurences);
      }
    } else {
      // we can break here and stop looping since it's an ordered queue
      break;
    }
  }

  const filtered = queue.filter(entry => !! entry);

  return {
    updatedQueue: filtered,
    updatedMap: occurenceMap
  }
  
}