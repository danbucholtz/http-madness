import { EventEmitter } from 'events';

import { SNAPSHOT_REPORT_CREATED_EVENT } from './constants';
import { convertDateToCommonLogFormat } from './date-utils';
import { SnapshotReport } from './interfaces';

export function initializeController(emitter: EventEmitter) {
  emitter.addListener(SNAPSHOT_REPORT_CREATED_EVENT, handleSnapshotReport);
}

export function handleSnapshotReport(snapshotReport: SnapshotReport) {
  const dateString = convertDateToCommonLogFormat(snapshotReport.date);
  
  
  const shortTermNumberOfHitsEndpointsString = snapshotReport.shortTermMostHits.endpoints.sort().join('\n');
  
  const shortTermMostHitsSummary = snapshotReport.shortTermMostHits.numberOfHits > 0 ? 
`the endpoints(s) with the most hits (${snapshotReport.shortTermMostHits.numberOfHits}) are
${shortTermNumberOfHitsEndpointsString}
`
:
`No new traffic.`;

  const shortTermMeanApiHits = `The average endpoint is hit ${snapshotReport.shortTermMeanApiHits} times`;

  const shortTermApisWithMoreHitsString = snapshotReport.shortTermApisWithMoreHits.sort().join('\n');
  const shortTermSignificantTraffic = snapshotReport.shortTermApisWithMoreHits.length > 0 ? 
`
The following sites are experiencing 2x the mean traffic
${shortTermApisWithMoreHitsString}
`
:
`No endpoints with significant (2x mean) traffic`;




  const longTermNumberOfHitsEndpointsString = snapshotReport.longTermMostHits.endpoints.sort().join('\n');
  const longTermMostHitsSummary = snapshotReport.longTermMostHits.numberOfHits > 0 ? 
`the endpoints(s) with the most hits (${snapshotReport.longTermMostHits.numberOfHits}) are
${longTermNumberOfHitsEndpointsString}
`
:
`No new traffic.`;

  const longTermMeanApiHits = `The average endpoint is hit ${snapshotReport.longTermMeanApiHits} times`;

  const longTermApisWithMoreHitsString = snapshotReport.longTermApisWithMoreHits.sort().join('\n');
  const longTermSignificantTraffic = snapshotReport.longTermApisWithMoreHits.length > 0 ? 
`
The following sites are experiencing 2x the mean traffic
${longTermApisWithMoreHitsString}
`
:
`No endpoints with significant (2x mean) traffic`;

  let alertStatusChangeString = '';
  if (snapshotReport.hasAlertStatusChanged && snapshotReport.historicSystemAlerts.length) {
    // get the top entry from the list
    const topAlert = snapshotReport.historicSystemAlerts[snapshotReport.historicSystemAlerts.length - 1];
    if (topAlert.isAlerting) {
      alertStatusChangeString = 
      `High traffic generated an alert - hits = ${topAlert.numberOfHits}, triggered at ${convertDateToCommonLogFormat(topAlert.date)}


`
    } else {
      alertStatusChangeString = 
      `The system recovered from a high-traffic alert at ${convertDateToCommonLogFormat(topAlert.date)}


`
    }
  }

  let historicAlertString = '';
  if (snapshotReport.historicSystemAlerts.length) {
    const historicAlertMessageContent = snapshotReport.historicSystemAlerts.map(historicSystemAlert => {
      if (historicSystemAlert.isAlerting) {
        return `The system began alert at ${convertDateToCommonLogFormat(historicSystemAlert.date)}`;
      }
      return `The system recovered at ${convertDateToCommonLogFormat(historicSystemAlert.date)}`;
    }).reduce((accumulator: string, next: string) => {
      return `${accumulator}
${next}`
    });
    historicAlertString = `
System Alert History:
${historicAlertMessageContent}`
  }
  


  const reportString =
`
${dateString} - System Summary

In the past ten seconds:

${shortTermMostHitsSummary}

${shortTermMeanApiHits}

${shortTermSignificantTraffic}


In the past two minutes:

${longTermMostHitsSummary}

${longTermMeanApiHits}

${longTermSignificantTraffic}


${alertStatusChangeString}
${historicAlertString}
`;

  console.log(reportString);
  return reportString;
}