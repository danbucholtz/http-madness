import { NumberOfHits } from './interfaces';
import { handleSnapshotReport } from './report-controller';

describe('Report Controller', () => {
  describe('handleSnapshotReport', () => {
    it('should generate the correct formatted string', () => {
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
        longTermApisWithMoreHits: longTermApisWithMoreHits
      });

      expect(result).toEqual(expectedString);

    });
  });
});
