import CONSTANTS from './../../appConstants';
import CalendarModel from './../../models/calendar-model';
import CalendarDayModel from './../../models/calendar-day-model/';
import CalendarMonthModel from './../../models/calendar-month-model/';
import DateUtils from './../date-utils/';

/**
 * A namespace for calendar utility functions.
 *
 * @class CalendarUtils
 * @static
 */
export default class CalendarUtils {
  /**
   * Returns a CalendarModel that
   * represents the provided year.
   *
   * @method CalendarUtils.buildCalendar
   * @param {Number} year
   * @returns {CalendarModel} a CalendarModel
   */
  static buildCalendar(year) {
    const months = [];

    for (let i = 0; i < CONSTANTS.MONTHS_IN_A_YEAR; i++) {
      months.push(CalendarUtils.buildCalendarMonth(i, year));
    }

    return new CalendarModel().fromJSON({
      year,
      months: months,
    }).toJSON();
  }

  /**
   * Returns a CalendarDayModel that
   * represents the provided date.
   *
   * @method CalendarUtils.buildDay
   * @param {Date} date
   * @returns {CalendarDayModel} a CalendarDayModel
   */
  static buildDay(date) {
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    const dayNames = CONSTANTS.DAYS[dayOfWeek];
    const monthNames = CONSTANTS.MONTHS[month];

    return new CalendarDayModel().fromJSON({
      date,
      day,
      dayOfWeek,
      month,
      year,
      abbreviatedName: dayNames[1],
      isToday: DateUtils.datesMatch(date, new Date()),
      isWeekend: CalendarUtils.isWeekend(dayOfWeek),
      fullName: dayNames[0],
      monthName: monthNames[0],
      abbreviatedMonthName: monthNames[1],
    }).toJSON();
  }

  /**
   * Returns a padded CalendarMonthModel that
   * represents the provided month/year. Padded
   * calendar months contains "ghost days" which
   * even out the weeks in a display (think table).
   *
   * @method CalendarUtils.buildPaddedCalendarMonth
   * @param {Number} month - zero based
   * @param {Number} year
   * @returns {CalendarMonthModel} a CalendarMonthModel
   */
  static buildPaddedCalendarMonth(month, year) {
    const calendarMonth = CalendarUtils.buildCalendarMonth(month, year);
    const days = calendarMonth.days.slice();
    const padLeft = days[0].dayOfWeek;
    /**
     * subtract 1 from both days.length and days of the week,
     * because we're dealing with zero based numbers
     */
    const padRight = (CONSTANTS.DAYS_IN_A_WEEK - 1) - days[days.length - 1].dayOfWeek;
    const ghostDaysLeft = CalendarUtils.getGhostDays(month - 1, year, 'end', padLeft);
    const ghostDaysRight = CalendarUtils.getGhostDays(month + 1, year, 'start', padRight);
    const totalDays = [...ghostDaysLeft, ...days, ...ghostDaysRight];

    return Object.assign(calendarMonth, {
      days: totalDays,
      weeks: CalendarUtils.getWeeks(totalDays),
    });
  }

  /**
   * Accepts a padded (ghost days included) array of days
   * and returns an array of weeks including said days.
   *
   * @method CalendarUtils.getWeeks
   * @param {CalendarDayModel[]} days - array of calendar day models
   * @returns {Array[]}
   */
  static getWeeks(days) {
    const daysCopy = days.slice();
    const numberOfWeeks = days.length / CONSTANTS.DAYS_IN_A_WEEK;
    const weeks = [];

    for (let i = 1; i <= numberOfWeeks; i++) {
      weeks.push(daysCopy.splice(0, CONSTANTS.DAYS_IN_A_WEEK));
    }

    return weeks;
  }

  /**
   * Returns a number of "ghost days", specified by howMany,
   * in the provided month/year extending from the provided position.
   *
   * @method CalendarUtils.getGhostDays
   * @param {Number} month
   * @param {Number} year
   * @param {String} position - 'end' or 'start'
   * @param {Number} howMany
   * @returns {Array} ghostDays - array of day models
   */
  static getGhostDays(month, year, position, howMany) {
    if (month < 0) {
      month = 11;
      year--;
    } else if (month > 11) {
      month = 0;
      year++;
    }

    const ghostCalendarMonth = CalendarUtils.buildCalendarMonth(month, year);
    const ghostDays = ghostCalendarMonth.days;

    if (position === 'start') {
      return ghostDays.slice(0, howMany);
    } else {
      /**
       * reverse the array so we get the final days,
       * then reverse again so that they're in the correct order
       */
      return ghostDays.reverse().slice(0, howMany).reverse();
    }
  }

  /**
   * Return a calendar month model that
   * represents the provided month/year.
   *
   * @method CalendarUtils.buildCalendarMonth
   * @param {Number} month
   * @param {Number} year
   * @returns {CalendarMonthModel} calendarMonthModel
   */
  static buildCalendarMonth(month, year) {
    const totalDays = CalendarUtils.daysInMonth(month, year);
    const days = [];
    const monthNames = CONSTANTS.MONTHS[month];

    for (var i = 1; i <= totalDays; i++) {
      let dayOfWeek = CalendarUtils.dayOfWeek(i, month, year);
      let dayNames = CONSTANTS.DAYS[dayOfWeek];

      days.push(CalendarUtils.buildDay(new Date(year, month, i)));
    }

    return new CalendarMonthModel().fromJSON({
      abbreviatedName: monthNames[1],
      days: days,
      daysOfTheWeek: CONSTANTS.DAYS.slice(),
      fullName: monthNames[0],
      month: month,
      year: year,
    }).toJSON();
  }

  /**
   * Return the number of days
   * in the provided month/year.
   *
   * @method CalendarUtils.daysInMonth
   * @param {Number} month
   * @param {Number} year
   * @returns {Number}
   */
  static daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  /**
   * Return the day of week {0-6}
   * based of of the provided day/month/year.
   *
   * @method CalendarUtils.dayOfWeek
   * @param {Number} day
   * @param {Number} month
   * @param {Number} year
   * @returns {Number}
   */
  static dayOfWeek(day, month, year) {
    return new Date(year, month, day).getDay();
  }

  /**
   * Returns a boolean that determines
   * if the provided day is a weekend.
   *
   * @method CalendarUtils.isWeekend
   * @param {Number} day
   * @returns {Boolean}
   */
  static isWeekend(day) {
    return day === 6 || day === 0;
  }

  /**
   * Returns a boolean that determines whether
   * the provided day is a valid day. A valid day
   * is defined as a day that falls within its
   * months range. 06-40-1990 is not a valid day, as
   * there are not 40 days in June.
   *
   * @method CalendarUtils.isValidDay
   * @param {Number} day
   * @param {Number} month
   * @param {Number} year
   * @returns {Boolean}
   */
  static isValidDay(day, month, year) {
    return day >= 1 && day <= CalendarUtils.daysInMonth(month, year);
  }

  /**
   * Returns a boolean that determines whether
   * the provided month is a valid month number
   * (falls between 0 and 11).
   *
   * @method CalendarUtils.isValidMonth
   * @param {Number} month
   * @returns {Boolean}
   */
  static isValidMonth(month) {
    return month >= 0 && month <= 11;
  }
}
