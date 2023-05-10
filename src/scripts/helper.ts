export function timeElapsed(timestamp: number) {
  const timeDifference = Date.now() - (new Date(timestamp)).getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;


  if (timeDifference < minute) {
    return `${Math.floor(timeDifference / 1000)}s`;
  } else if (timeDifference < hour) {
    return `${Math.floor(timeDifference / minute)}min`;
  } else if (timeDifference < day) {
    return `${Math.floor(timeDifference / hour)}h`;
  } else if (timeDifference < month) {
    return `${Math.floor(timeDifference / day)}d`;
  } else {
    return `${Math.floor(timeDifference / month)} month`;
  }
};