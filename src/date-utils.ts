const shortMonthToNumberMap = new Map<string, number>();

shortMonthToNumberMap.set('Jan', 0);
shortMonthToNumberMap.set('Feb', 1);
shortMonthToNumberMap.set('Mar', 2);
shortMonthToNumberMap.set('Apr', 3);
shortMonthToNumberMap.set('May', 4);
shortMonthToNumberMap.set('Jun', 5);
shortMonthToNumberMap.set('Jul', 6);
shortMonthToNumberMap.set('Aug', 7);
shortMonthToNumberMap.set('Sep', 8);
shortMonthToNumberMap.set('Oct', 9);
shortMonthToNumberMap.set('Nov', 10);
shortMonthToNumberMap.set('Dec', 11);

export function getMonthFromShortString(monthString: string) {
  const result = shortMonthToNumberMap.get(monthString);
  if (result >= 0) {
    return result;
  }
  throw new Error('Invalid Short Month abbreviation');
}

export function convertDateToCommonLogFormat(date: Date) {
  // 10/Mar/2000:13:55:36
  const dayOfMonth = date.getDate();
  const dayOfMonthString = dayOfMonth >= 10 ? `${dayOfMonth}` : `0${dayOfMonth}`; 
  const monthNumber = date.getMonth();
  let monthString: string = '';
  shortMonthToNumberMap.forEach((value: number, shortMonthString: string) => {
    if (value === monthNumber) {
      monthString = shortMonthString;
    }
  });
  const year = date.getFullYear();
  const hour = date.getHours();
  const hourString = hour > 10 ? `${hour}` : `0${hour}`; 
  const minutes = date.getMinutes();
  const minutesString = minutes > 10 ? `${minutes}` : `0${minutes}`; 
  const seconds = date.getSeconds();
  const secondsString = seconds > 10 ? `${seconds}` : `0${seconds}`; 

  return `${dayOfMonthString}/${monthString}/${year}:${hourString}:${minutesString}:${secondsString}`;
}