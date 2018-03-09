import CalendarUtils from './../calendar-utils/';
import DateUtils from './../date-utils/';
import CONSTANTS from './../../appConstants';
const DEFAULT_FORMAT = CONSTANTS.DEFAULT_DATE_FORMAT;

/**
 * A utility class responsible for mapping
 * dates to and from date strings (e.g., 10/20/2016)
 *
 * @class DateString
 * @static
 */
export default class DateString {
  /**
   * Formatters for each of the supported
   * date string types. Each formatter accepts a date
   * and returns its numeric-string equivalent.
   *
   * @example
   * DateString.FORMATTERS.M(new Date(2016, 01)) // 1
   * DateString.FORMATTERS.MM(new Date(2016, 01)) // 01
   *
   * @property DateString.FORMATTERS
   * @type {Object}
   */
  static FORMATTERS = {
    M:    d => d.getMonth() + 1,
    MM:   d => DateUtils.padDateDigit(d.getMonth() + 1, 2, '0'),
    D:    d => d.getDate(),
    DD:   d => DateUtils.padDateDigit(d.getDate(), 2, '0'),
    YY:   d => d.getFullYear().toString().slice(-2),
    YYYY: d => d.getFullYear(),
  }

  /**
   * Accepts unpredictable user input
   * (a date or a date string) and returns a date.
   *
   * @method DateString.fromUserToDate
   * @param {Date|String} [dateOrString='']
   * @param {...*} other
   * @returns {Date}
   */
  static fromUserToDate(dateOrString = '', ...other) {
    if (DateUtils.isDate(dateOrString)) {
      return dateOrString;
    }

    return DateString.toDate(dateOrString, ...other);
  }

  /**
   * Accepts unpredictable user input
   * (a date or a date string) and returns a date string.
   *
   * @method DateString.fromUserFromDate
   * @param {Date|String} dateOrString
   * @param {...*} dateOrString
   * @returns {String}
   */
  static fromUserFromDate(dateOrString, ...other) {
    if (!DateUtils.isDate(dateOrString)) {
      return dateOrString;
    }

    return DateString.fromDate(dateOrString, ...other);
  }

  /**
   * Accepts a date string, validates its parts against
   * the provided format, and returns a validated date object.
   *
   *
   * @method DateString.toDate
   * @param {String} dateString
   * @param {String} [format=DEFAULT_FORMAT] - MM/YYYY
   * @param {Date[]} [range=DateUtils.makeRange()] - date range
   * @returns {Date}
   */
  static toDate(dateString, format = DEFAULT_FORMAT, range = DateUtils.makeRange()) {
    if (dateString.length !== format.length) {
      return;
    }

    const parts = DateString.unpack(dateString, format);

    if (!DateString.partsAreValid(parts, range)) {
      return;
    }

    const { day, month, year } = parts;

    return new Date(year, month, day || 1);
  }

  /**
   * Accepts a date and returns a date string
   * that matches the provide format.
   *
   * @method DateString.fromDate
   * @param {Date} date
   * @param {String} [format=DEFAULT_FORMAT] - MM/YYYY
   * @returns {String}
   */
  static fromDate(date, format = DEFAULT_FORMAT) {
    const replacer = match => {
      const formatter = DateString.FORMATTERS[match];

      if (formatter === undefined) {
        throw new Error(`Invalid formatter: ${match}`);
      }

      return formatter(date);
    };

    return ['M', 'D', 'Y'].reduce((str, flag) => {
      return str.replace(new RegExp(`(${flag})+`, 'g'), replacer);
    }, format);
  }

  /**
   * Accepts a date string and a format and
   * returns the parts (day, month, year) of the date string.
   *
   * @method DateString.unpack
   * @param {String} dateString
   * @param {String} [format=DEFAULT_FORMAT] - MM/YYYY
   * @returns {Object}
   */
  static unpack(dateString, format = DEFAULT_FORMAT) {
    const parts = {};
    const re = /(D|M|Y)+/g;

    format.replace(re, (match, letter, index) => {
      const correspondingMatch = (dateString.slice(index).match(/\d+/) || [])[0];

      if (correspondingMatch === undefined) {
        throw new Error(`Could not match ${match} in dateString`);
      }

      switch (match) {
        case 'M':
        case 'MM':
          parts.month = Number(correspondingMatch) - 1;
          break;

        case 'D':
        case 'DD':
          parts.day = Number(correspondingMatch);
          break;

        case 'YY':
        case 'YYYY':
          parts.year = Number(correspondingMatch);
          break;
      }
    });

    return parts;
  }

  /**
   * Accepts a parts objects and a date range
   * and returns a boolean indicating whether
   * or not the provided parts are valid.
   *
   * @method DateString.partsAreValid
   * @param {Object} parts
   * @param {Date[]} [range=[]] - date range
   * @returns {Boolean}
   */
  static partsAreValid(parts, range = []) {
    // range must contain a start and end date
    if (!parts || range.length !== 2) {
      return false;
    }

    const {
      day,
      month,
      year,
    } = parts;

    //sets undefined days to 1 and keeps 0 valued days for validation
    let setDay = day == undefined ? 1 : day;

    if (
      !CalendarUtils.isValidMonth(month) ||
      !CalendarUtils.isValidDay(setDay, month, year) ||
      !DateUtils.dateIsInRange(new Date(year, month, setDay), range)
    ) {
      return false;
    }

    return true;
  }
}
