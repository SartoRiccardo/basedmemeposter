
/**
 * Checks if a certain time is included in an interval.
 * @param  {string}  time    The time to check.
 * @param  {string}  start   The start of the interval, inclusive.
 * @param  {string}  finish  The end of the interval, exclusive.
 * @return {boolean}
 */
export function isInRangeHours(time, start, finish) {
  if(typeof time === "string") {
    time = strToTime(time);
  }
  if(typeof start === "string") {
    start = strToTime(start);
  }
  if(typeof finish === "string") {
    finish = strToTime(finish);
  }

  const overnight = compareTimes(start, finish) === -1;
  if(overnight) {
    return compareTimes(time, start) !== 1 || compareTimes(time, finish) === 1;
  }
  return compareTimes(time, start) !== 1 && compareTimes(time, finish) === 1;
}

/**
 * Compares two times.
 * @param  {string}  a   A time-formatted string.
 * @param  {string}  b   A time-formatted string.
 * @return {int}         -1 if a > b, 0 if a == b, 1 if a < b.
 */
export function compareTimes(a, b) {
  if(typeof a === "string") {
    a = strToTime(a);
  }
  if(typeof b === "string") {
    b = strToTime(b);
  }

  if(a.hours === b.hours && a.minutes === b.minutes && a.seconds === b.seconds) {
    return 0;
  }

  if(a.hours > b.hours ||
      (a.hours === b.hours && a.minutes > b.minutes) ||
      (a.hours === b.hours && a.minutes === b.minutes && a.seconds > b.seconds)) {
    return -1;
  }

  return 1;
}

/**
 * Turns a string into a Time object.
 * @param  {string} time  The string to transform.
 * @return {Object}
 */
export function strToTime(time) {
  try {
    const [ hours, minutes, seconds ] = time.split(":");
    return {
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds)
    };
  }
  catch(e) {
    return null;
  }
}
