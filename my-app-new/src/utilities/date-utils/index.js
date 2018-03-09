/**
 * Namespace for date utilities
 *
 * @class DateUtils
 * @static
 */
export default class DateUtils {
  /**
   * Returns a date date range created using
   * the provided date and offset.
   *
   * @method DateUtils.makeRange
   * @param {Date} [date=new Date()]
   * @param {Number} [offset=200]
   * @returns {Array}
   */
  static makeRange(date = new Date(), offset = 200) {
    return [
      DateUtils.getOffsetDate(date, offset * -1),
      DateUtils.getOffsetDate(date, offset)
    ];
  }

  /**
   * Accepts a date and a range (an array containing two dates)
   * and returns a boolean determining whether the provided
   * date is within the provided range.
   *
   * @method DateUtils.dateIsInRange
   * @param {Date} date
   * @param {Date[]} range
   * @returns {Boolean}
   */
  static dateIsInRange(date, range) {
    const startDateTime = new Date(range[0]).setHours(0, 0, 0, 0);
    const endDateTime = new Date(range[1]).setHours(0, 0, 0, 0);
    const dateTime = date.getTime();

    return dateTime >= startDateTime && dateTime <= endDateTime;
  }

  /**
   * Returns a boolean that determines whether
   * the provided date is contained within the provided
   * array of dates.
   *
   * @method DateUtils.datesContain
   * @param {Date[]} dates
   * @param {Date} date
   * @returns {Boolean}
   */
  static datesContain(dates, date) {
    return dates.filter((d) => DateUtils.datesMatch(d, date)).length > 0;
  }

  /**
   * Returns a boolean that determines whether
   * the two provided dates match.
   *
   * @method DateUtils.datesMatch
   * @param {Date} dateOne
   * @param {Date} dateTwo
   * @returns {Boolean}
   */
  static datesMatch(dateOne, dateTwo) {
    return dateOne.toDateString() === dateTwo.toDateString();
  }

  /**
   * Returns a padded date digit.
   * Given `1`, this method will return `01`.
   *
   * @method DateUtils.padDateDigit
   * @param {Number} dateNumber
   * @returns {String} dateString
   */
  static padDateDigit(dateNumber) {
    if (dateNumber < 10) {
      return `0${dateNumber}`;
    }

    return `${dateNumber}`;
  }

  /**
   * Returns a boolean that determines whether
   * the provided param is a date or not.
   *
   * @method DateUtils.isDate
   * @param {Date} date
   * @returns {Boolean}
   */
  static isDate(date) {
    return date instanceof Date;
  }

  /**
   * Returns a date that uses the provided offset.
   * The offest how many years (+/-) you want to
   * offset the provided date.
   *
   * @method DateUtils.getOffsetDate
   * @param {Date} date
   * @param {Number} [offset=0]
   * @returns {Date}
   */
  static getOffsetDate(date, offset = 0) {
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    return new Date(year + offset, month, day);
  }
}
