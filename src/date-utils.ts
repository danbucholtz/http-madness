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