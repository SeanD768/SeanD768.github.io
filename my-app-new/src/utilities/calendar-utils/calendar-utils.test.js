import CalendarUtils from './';
import CalendarModel from './../../models/calendar-model';
import CalendarDayModel from './../../models/calendar-day-model/';
import CalendarMonthModel from './../../models/calendar-month-model';
import CONSTANTS from './../../appConstants';

describe('CalendarUtils', () => {
  it('creates calendar model', () => {
    const calendarModel = CalendarUtils.buildCalendar(2016);

    expect(calendarModel.months.length).toBe(12);
    expect(calendarModel.year).toBe(2016);
  });

  it('creates calendar day model', () => {
    const calendarDay = CalendarUtils.buildDay(new Date(2016, 11, 13));

    expect(calendarDay.abbreviatedName).toBe('Tue');
    expect(calendarDay.isWeekend).toBe(false);
    expect(calendarDay.fullName).toBe('Tuesday');
    expect(calendarDay.monthName).toBe('December');
    expect(calendarDay.abbreviatedMonthName).toBe('Dec');
    expect(calendarDay.dayOfWeek).toBe(2);
    expect(calendarDay.month).toBe(11);
    expect(calendarDay.day).toBe(13);
    expect(calendarDay.year).toBe(2016);
  });

  it('gets weeks', () => {
    const paddedCalendarMonth = CalendarUtils.buildPaddedCalendarMonth(11, 2016);

    expect(CalendarUtils.getWeeks(paddedCalendarMonth.days).length).toBe(5);
  });

  it('gets ghost days', () => {
    const novemberGhostDays = CalendarUtils.getGhostDays(10, 2016, 'start', 3);

    expect(novemberGhostDays.length).toBe(3);
    expect(novemberGhostDays[0].day).toBe(1);
    expect(novemberGhostDays[0].fullName).toBe('Tuesday');
  });

  it('builds calendar month', () => {
    const calendarMonth = CalendarUtils.buildCalendarMonth(1, 2016);

    expect(calendarMonth.days.length).toBe(29);
    expect(calendarMonth.fullName).toBe('February');
    expect(calendarMonth.abbreviatedName).toBe('Feb');
    expect(calendarMonth.month).toBe(1);
    expect(calendarMonth.daysOfTheWeek.length).toBe(7);
  });

  it('provides day in month', () => {
    expect(CalendarUtils.daysInMonth(0, 2016)).toBe(31);
    expect(CalendarUtils.daysInMonth(1, 2016)).toBe(29);
    expect(CalendarUtils.daysInMonth(2, 2016)).toBe(31);
    expect(CalendarUtils.daysInMonth(3, 2016)).toBe(30);
  });

  it('provides day of week', () => {
    expect(CalendarUtils.dayOfWeek(1, 0, 2016)).toBe(5);
    expect(CalendarUtils.dayOfWeek(1, 5, 2016)).toBe(3);
    expect(CalendarUtils.dayOfWeek(1, 11, 2016)).toBe(4);
  });

  it('determines if weekend', () => {
    expect(CalendarUtils.isWeekend(0)).toBe(true);
    expect(CalendarUtils.isWeekend(6)).toBe(true);
    expect(CalendarUtils.isWeekend(11)).toBe(false);
    expect(CalendarUtils.isWeekend(2)).toBe(false);
  });

  it('validates day', () => {
    expect(CalendarUtils.isValidDay(0, 11, 2016)).toBe(false);
    expect(CalendarUtils.isValidDay(1, 11, 2016)).toBe(true);
    expect(CalendarUtils.isValidDay(25, 11, 2016)).toBe(true);
    expect(CalendarUtils.isValidDay(40, 11, 2016)).toBe(false);
  });

  it('validates month', () => {
    expect(CalendarUtils.isValidMonth(0)).toBe(true);
    expect(CalendarUtils.isValidMonth(5)).toBe(true);
    expect(CalendarUtils.isValidMonth(-1)).toBe(false);
    expect(CalendarUtils.isValidMonth(13)).toBe(false);
    expect(CalendarUtils.isValidMonth(12)).toBe(false);
  });
});
