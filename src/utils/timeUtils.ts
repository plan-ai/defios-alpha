export const timeAgo = (time: string | number) => {
  let seconds = 0;

  if (typeof time === 'string') {
    seconds += Math.floor((Date.now() - Date.parse(time)) / 1000);
  }
  if (typeof time === 'number') {
    seconds += Math.floor((Date.now() - time) / 1000);
  }
  var interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes';
  return Math.floor(seconds) + ' seconds';
};

export const GraphDataGenerator = (issuesArray: any) => {
  let issuesCount: any = [];
  let stakedCount: any = [];
  let intervals: any = [];
  const difference =
    Date.parse(issuesArray[issuesArray.length - 1].createdAt) -
    Date.parse(issuesArray[0].createdAt);
  if (difference < 604800000) {
    let _interval = Date.parse(issuesArray[0].createdAt);
    issuesCount = [0, 0, 0, 0, 0, 0, 0];
    stakedCount = [0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 7; i++) {
      const dateStr =
        new Date(_interval).getDate() +
        ' ' +
        new Date(_interval).toLocaleString('default', { month: 'short' });
      intervals.push(dateStr);
      _interval += 86400000;
    }
    for (let j = 0; j < issuesArray.length; j++) {
      const dateStr =
        new Date(issuesArray[j].createdAt).getDate() +
        ' ' +
        new Date(issuesArray[j].createdAt).toLocaleString('default', {
          month: 'short',
        });
      const _index = intervals.indexOf(dateStr);
      issuesCount[_index] += 1;
      stakedCount[_index] += issuesArray[j].issueStaked;
    }
  } else if (difference < 2419200000) {
    let _interval = Date.parse(issuesArray[0].createdAt);
    issuesCount = [0, 0, 0, 0];
    stakedCount = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      const dateInterval =
        new Date(_interval).getDate() +
        '-' +
        new Date(_interval + 604800000).getDate();
      const MonthInterval1 = new Date(_interval).toLocaleString('default', {
        month: 'short',
      });
      const MonthInterval2 = new Date(_interval + 604800000).toLocaleString(
        'default',
        { month: 'short' }
      );
      const MonthInterval =
        MonthInterval1 === MonthInterval2
          ? MonthInterval1
          : MonthInterval1 + '-' + MonthInterval2;
      const dateStr = dateInterval + ' ' + MonthInterval;
      intervals.push(dateStr);
      _interval += 604800000;
    }
    for (let j = 0; j < issuesArray.length; j++) {
      const dateInterval = new Date(_interval).getDate();
      const MonthInterval = new Date(_interval).toLocaleString('default', {
        month: 'short',
      });
      let _index = 0;
      for (let k = 0; k < intervals.length; k++) {
        const _dateInterval1 = parseInt(
          intervals[k].split(' ')[0].split('-')[0]
        );
        const _dateInterval2 = parseInt(
          intervals[k].split(' ')[0].split('-')[1]
        );
        if (MonthInterval.includes('-')) {
          const _MonthInterval1 = intervals[k].split(' ')[1].split('-')[0];
          const _MonthInterval2 = intervals[k].split(' ')[1].split('-')[1];
          if (
            (dateInterval >= _dateInterval1 &&
              MonthInterval === _MonthInterval1) ||
            (dateInterval <= _dateInterval2 &&
              MonthInterval === _MonthInterval2)
          ) {
            _index = k;
            break;
          }
        } else {
          if (
            dateInterval >= _dateInterval1 &&
            dateInterval <= _dateInterval2 &&
            MonthInterval === intervals[k].split(' ')[1]
          ) {
            _index = k;
            break;
          }
        }
      }
      issuesCount[_index] += 1;
      stakedCount[_index] += issuesArray[j].issueStaked;
    }
  } else if (difference < 31536000000) {
    let _interval = Date.parse(issuesArray[0].createdAt);
    issuesCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    stakedCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 12; i++) {
      const dateStr = new Date(_interval).toLocaleString('default', {
        month: 'long',
      });
      intervals.push(dateStr);
      _interval += 2628000000;
    }
    for (let j = 0; j < issuesArray.length; j++) {
      const dateStr = new Date(issuesArray[j].createdAt).toLocaleString(
        'default',
        { month: 'long' }
      );
      const _index = intervals.indexOf(dateStr);
      issuesCount[_index] += 1;
      stakedCount[_index] += issuesArray[j].issueStaked;
    }
  } else {
    let _interval = Date.parse(issuesArray[0].createdAt);
    issuesCount = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    stakedCount = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    for (let i = 0; i < 24; i++) {
      const dateStr = new Date(_interval).getFullYear();
      intervals.push(dateStr);
      _interval += 31536000000;
    }
    for (let j = 0; j < issuesArray.length; j++) {
      const dateStr = new Date(issuesArray[j].createdAt).getFullYear();
      const _index = intervals.indexOf(dateStr);
      issuesCount[_index] += 1;
      stakedCount[_index] += issuesArray[j].issueStaked;
    }
  }
  return {
    intervals: intervals,
    issuesCount: issuesCount,
    stakedCount: stakedCount,
  };
};
