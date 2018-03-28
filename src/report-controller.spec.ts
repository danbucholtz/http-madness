import { NumberOfHits } from './interfaces';
import { handleSnapshotReport } from './report-controller';
import { convertDateToCommonLogFormat } from './date-utils';

const noOp = () => { }
let originalFunc: Function = console.log;
describe('Report Controller', () => {
  describe('handleSnapshotReport', () => {
    beforeAll(() => {
      console.log = () => { }
    })

    afterAll(() => {
      console.log = originalFunc as any;
    });

    it('should generate the correct formatted string when no change in alert or historical alerts', () => {
      const date = new Date();
      date.setDate(5);
      date.setMonth(5);
      date.setFullYear(2018);
      date.setHours(5);
      date.setMinutes(5);
      date.setSeconds(5);

      const shortTermNumberOfHits: NumberOfHits = {
        numberOfHits: 3,
        endpoints: [
          '/taco',
          '/burrito',
          '/enchilada'
        ]
      };

      const longTermNumberOfHits: NumberOfHits = {
        numberOfHits: 5,
        endpoints: [
          '/taco',
          '/burrito',
          '/enchilada'
        ]
      };

      const shortTermMeanApiHits = 1.5;
      const longTermMeanApiHits = 0.8;

      const shortTermApisWithMoreHits = [
        '/taco',
        '/burrito'
      ]

      const longTermApisWithMoreHits = [
        '/quesadilla',
        '/enchilada'
      ]

      const expectedString =
`
05/Jun/2018:05:05:05 - System Summary

In the past ten seconds:

the endpoints(s) with the most hits (3) are
/burrito
/enchilada
/taco


The average endpoint is hit 1.5 times


The following sites are experiencing 2x the mean traffic
/burrito
/taco



In the past two minutes:

the endpoints(s) with the most hits (5) are
/burrito
/enchilada
/taco


The average endpoint is hit 0.8 times


The following sites are experiencing 2x the mean traffic
/enchilada
/quesadilla





`

      const result = handleSnapshotReport({
        date,
        shortTermMostHits: shortTermNumberOfHits,
        longTermMostHits: longTermNumberOfHits,
        shortTermMeanApiHits: shortTermMeanApiHits,
        longTermMeanApiHits: longTermMeanApiHits,
        shortTermApisWithMoreHits: shortTermApisWithMoreHits,
        longTermApisWithMoreHits: longTermApisWithMoreHits,
        hasAlertStatusChanged: false,
        historicSystemAlerts: []
      });

      expect(result).toEqual(expectedString);

    });

    it('should generate the correct string when no alert status change but w/ historical alerts', () => {
      const date = new Date();
      date.setDate(5);
      date.setMonth(5);
      date.setFullYear(2018);
      date.setHours(5);
      date.setMinutes(5);
      date.setSeconds(5);

      const shortTermNumberOfHits: NumberOfHits = {
        numberOfHits: 3,
        endpoints: [
          '/taco',
          '/burrito',
          '/enchilada'
        ]
      };

      const longTermNumberOfHits: NumberOfHits = {
        numberOfHits: 5,
        endpoints: [
          '/taco',
          '/burrito',
          '/enchilada'
        ]
      };

      const shortTermMeanApiHits = 1.5;
      const longTermMeanApiHits = 0.8;

      const shortTermApisWithMoreHits = [
        '/taco',
        '/burrito'
      ]

      const longTermApisWithMoreHits = [
        '/quesadilla',
        '/enchilada'
      ]

      const expectedString =
`
05/Jun/2018:05:05:05 - System Summary

In the past ten seconds:

the endpoints(s) with the most hits (3) are
/burrito
/enchilada
/taco


The average endpoint is hit 1.5 times


The following sites are experiencing 2x the mean traffic
/burrito
/taco



In the past two minutes:

the endpoints(s) with the most hits (5) are
/burrito
/enchilada
/taco


The average endpoint is hit 0.8 times


The following sites are experiencing 2x the mean traffic
/enchilada
/quesadilla





System Alert History:
The system began alert at ${convertDateToCommonLogFormat(date)}
The system recovered at ${convertDateToCommonLogFormat(date)}
The system began alert at ${convertDateToCommonLogFormat(date)}
The system recovered at ${convertDateToCommonLogFormat(date)}
`

      const result = handleSnapshotReport({
        date,
        shortTermMostHits: shortTermNumberOfHits,
        longTermMostHits: longTermNumberOfHits,
        shortTermMeanApiHits: shortTermMeanApiHits,
        longTermMeanApiHits: longTermMeanApiHits,
        shortTermApisWithMoreHits: shortTermApisWithMoreHits,
        longTermApisWithMoreHits: longTermApisWithMoreHits,
        hasAlertStatusChanged: false,
        historicSystemAlerts: [
          {
            date,
            isAlerting: true,
            numberOfHits: 0
          },
          {
            date,
            isAlerting: false,
            numberOfHits: 0
          },
          {
            date,
            isAlerting: true,
            numberOfHits: 0
          },
          {
            date,
            isAlerting: false,
            numberOfHits: 0
          }
        ]
      });

      expect(result).toEqual(expectedString);
    });

    it('should generate the correct string when there is alert status change and w/ historical alerts', () => {
      const date = new Date();
      date.setDate(5);
      date.setMonth(5);
      date.setFullYear(2018);
      date.setHours(5);
      date.setMinutes(5);
      date.setSeconds(5);

      const shortTermNumberOfHits: NumberOfHits = {
        numberOfHits: 3,
        endpoints: [
          '/taco',
          '/burrito',
          '/enchilada'
        ]
      };

      const longTermNumberOfHits: NumberOfHits = {
        numberOfHits: 5,
        endpoints: [
          '/taco',
          '/burrito',
          '/enchilada'
        ]
      };

      const shortTermMeanApiHits = 1.5;
      const longTermMeanApiHits = 0.8;

      const shortTermApisWithMoreHits = [
        '/taco',
        '/burrito'
      ]

      const longTermApisWithMoreHits = [
        '/quesadilla',
        '/enchilada'
      ]

      const expectedString =
`
05/Jun/2018:05:05:05 - System Summary

In the past ten seconds:

the endpoints(s) with the most hits (3) are
/burrito
/enchilada
/taco


The average endpoint is hit 1.5 times


The following sites are experiencing 2x the mean traffic
/burrito
/taco



In the past two minutes:

the endpoints(s) with the most hits (5) are
/burrito
/enchilada
/taco


The average endpoint is hit 0.8 times


The following sites are experiencing 2x the mean traffic
/enchilada
/quesadilla



The system recovered from a high-traffic alert at ${convertDateToCommonLogFormat(date)}




System Alert History:
The system began alert at ${convertDateToCommonLogFormat(date)}
The system recovered at ${convertDateToCommonLogFormat(date)}
The system began alert at ${convertDateToCommonLogFormat(date)}
The system recovered at ${convertDateToCommonLogFormat(date)}
`

      const result = handleSnapshotReport({
        date,
        shortTermMostHits: shortTermNumberOfHits,
        longTermMostHits: longTermNumberOfHits,
        shortTermMeanApiHits: shortTermMeanApiHits,
        longTermMeanApiHits: longTermMeanApiHits,
        shortTermApisWithMoreHits: shortTermApisWithMoreHits,
        longTermApisWithMoreHits: longTermApisWithMoreHits,
        hasAlertStatusChanged: true,
        historicSystemAlerts: [
          {
            date,
            isAlerting: true,
            numberOfHits: 0
          },
          {
            date,
            isAlerting: false,
            numberOfHits: 0
          },
          {
            date,
            isAlerting: true,
            numberOfHits: 0
          },
          {
            date,
            isAlerting: false,
            numberOfHits: 0
          }
        ]
      });

      expect(result).toEqual(expectedString);
    });

    it('should generate the correct string when there is alert status change and w/ historical alerts', () => {
      const date = new Date();
      date.setDate(5);
      date.setMonth(5);
      date.setFullYear(2018);
      date.setHours(5);
      date.setMinutes(5);
      date.setSeconds(5);

      const shortTermNumberOfHits: NumberOfHits = {
        numberOfHits: 3,
        endpoints: [
          '/taco',
          '/burrito',
          '/enchilada'
        ]
      };

      const longTermNumberOfHits: NumberOfHits = {
        numberOfHits: 5,
        endpoints: [
          '/taco',
          '/burrito',
          '/enchilada'
        ]
      };

      const shortTermMeanApiHits = 1.5;
      const longTermMeanApiHits = 0.8;

      const shortTermApisWithMoreHits = [
        '/taco',
        '/burrito'
      ]

      const longTermApisWithMoreHits = [
        '/quesadilla',
        '/enchilada'
      ]

      const expectedString =
`
05/Jun/2018:05:05:05 - System Summary

In the past ten seconds:

the endpoints(s) with the most hits (3) are
/burrito
/enchilada
/taco


The average endpoint is hit 1.5 times


The following sites are experiencing 2x the mean traffic
/burrito
/taco



In the past two minutes:

the endpoints(s) with the most hits (5) are
/burrito
/enchilada
/taco


The average endpoint is hit 0.8 times


The following sites are experiencing 2x the mean traffic
/enchilada
/quesadilla



High traffic generated an alert - hits = 10, triggered at ${convertDateToCommonLogFormat(date)}




System Alert History:
The system began alert at ${convertDateToCommonLogFormat(date)}
The system recovered at ${convertDateToCommonLogFormat(date)}
The system began alert at ${convertDateToCommonLogFormat(date)}
The system recovered at ${convertDateToCommonLogFormat(date)}
The system began alert at ${convertDateToCommonLogFormat(date)}
`

      const result = handleSnapshotReport({
        date,
        shortTermMostHits: shortTermNumberOfHits,
        longTermMostHits: longTermNumberOfHits,
        shortTermMeanApiHits: shortTermMeanApiHits,
        longTermMeanApiHits: longTermMeanApiHits,
        shortTermApisWithMoreHits: shortTermApisWithMoreHits,
        longTermApisWithMoreHits: longTermApisWithMoreHits,
        hasAlertStatusChanged: true,
        historicSystemAlerts: [
          {
            date,
            isAlerting: true,
            numberOfHits: 10
          },
          {
            date,
            isAlerting: false,
            numberOfHits: 5
          },
          {
            date,
            isAlerting: true,
            numberOfHits: 10
          },
          {
            date,
            isAlerting: false,
            numberOfHits: 5
          },
          {
            date,
            isAlerting: true,
            numberOfHits: 10
          }
        ]
      });

      expect(result).toEqual(expectedString);
    });
  });
});
