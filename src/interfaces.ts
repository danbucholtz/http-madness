
export interface HTTPRequestResponseData {
  sourceIpAddress: string;
  userIdentifier: string;
  user: string;
  date: Date;
  dateInMillis: number;
  httpMethod: string;
  endpoint: string;
  httpProtocol: string;
  statusCode: number;
  contentLength: number;
  rawLog?: string;
}

export interface NumberOfHits {
  numberOfHits: number;
  endpoints: string[];
}

export interface SnapshotReport {
  date: Date;
  shortTermMostHits: NumberOfHits;
  longTermMostHits: NumberOfHits;
  shortTermMeanApiHits: number;
  longTermMeanApiHits: number;
  shortTermApisWithMoreHits: string[];
  longTermApisWithMoreHits: string[];
}
