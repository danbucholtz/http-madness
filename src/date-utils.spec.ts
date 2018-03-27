
import { convertDateToCommonLogFormat } from './date-utils';

describe('Date Utils', () => {
  describe('convertDateToCommonLogFormat', () => {
    it('should return a correct string', () => {
      const date = new Date();
      date.setMonth(1);
      date.setDate(14);
      date.setFullYear(2018);
      date.setHours(13);
      date.setMinutes(50);
      date.setSeconds(30);

      const result = convertDateToCommonLogFormat(date);
      expect(result).toEqual('14/Feb/2018:13:50:30');
    });
  });
});
