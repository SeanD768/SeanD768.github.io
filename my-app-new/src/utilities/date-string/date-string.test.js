import sinon from 'sinon';
import { shallow } from 'enzyme';
import DateString from './';
import DateUtils from './../date-utils/';

describe('DateString', () => {
  it('parts are invalid', () => {
    const range = [new Date(2015, 0), new Date(2017, 0)];

    expect(DateString.partsAreValid({
      month: 19, // errant month
      year: 2015,
    }, range)).toBe(false);
    expect(DateString.partsAreValid({
      month: -1, // errant month
      year: 2015,
    }, range)).toBe(false);
    expect(DateString.partsAreValid({
      day: 50, // errant day
      month: 0,
      year: 2015,
    }, range)).toBe(false);
    expect(DateString.partsAreValid(null, range)).toBe(false);
    expect(DateString.partsAreValid({
      month: 1,
      year: 2015,
    })).toBe(false);
  });

  it('parts are valid', () => {
    const range = [new Date(2015, 0), new Date(2017, 0)];

    expect(DateString.partsAreValid({
      month: 0,
      year: 2015,
    }, range)).toBe(true);
    expect(DateString.partsAreValid({
      day: 2,
      month: 4,
      year: 2015,
    }, range)).toBe(true);
    expect(DateString.partsAreValid({
      day: 1,
      month: 0,
      year: 2017,
    }, range)).toBe(true);
  });

  it('renders date from user string', () => {
    const date = new Date(2016, 0, 5);
    const otherDate = new Date(2016, 1);
    const userDate = DateString.fromUserToDate('01/05/2016');

    expect(DateString.fromUserToDate()).toBe(undefined);
    expect(DateString.toDate('01/50/2016')).toBe(undefined);
    expect(DateUtils.isDate(DateString.fromUserToDate(date))).toBe(true);
    expect(DateUtils.datesMatch(DateString.fromUserToDate(date), date)).toBe(true);
    expect(DateUtils.isDate(userDate)).toBe(true);
    expect(DateUtils.datesMatch(userDate, date)).toBe(true);
    expect(DateUtils.datesMatch(DateString.fromUserToDate('02/2016', 'MM/YYYY'), otherDate)).toBe(true);
  });

  it('renders strings from user date', () => {
    const date = new Date(2016, 0, 5);
    const otherDate = new Date(2016, 2);

    expect(typeof DateString.fromUserFromDate(date)).toBe('string');
    expect(DateString.fromUserFromDate(date)).toBe('01/05/2016');
    expect(DateString.fromUserFromDate(date, 'MM/YYYY')).toBe('01/2016');
    expect(DateString.fromUserFromDate(otherDate, 'MM/YYYY')).toBe('03/2016');
    expect(DateString.fromUserFromDate('03/2016', 'MM/YYYY')).toBe('03/2016');
    expect(DateString.fromUserFromDate('03')).toBe('03');
  });

  it('renders date strings', () => {
    expect(DateString.fromDate(new Date(2016, 0, 20))).toBe('01/20/2016');
    expect(DateString.fromDate(new Date(2016, 0, 23))).toBe('01/23/2016');
    expect(DateString.fromDate(new Date(2017, 3, 23))).toBe('04/23/2017');
    expect(DateString.fromDate(new Date(2017, 11, 23))).toBe('12/23/2017');
    expect(DateString.fromDate(new Date(2017, 11, 23), 'MM/YYYY')).toBe('12/2017');
    expect(DateString.fromDate(new Date(2017, 9, 23), 'MM/YYYY')).toBe('10/2017');
    expect(DateString.fromDate(new Date(2018, 2, 23), 'MM/YYYY')).toBe('03/2018');
    expect(DateString.fromDate(new Date(2018, 2, 7), 'D')).toBe('7');
    expect(DateString.fromDate(new Date(2018, 2, 7), 'DD')).toBe('07');
    expect(DateString.fromDate(new Date(2018, 2, 23), 'M')).toBe('3');
    expect(DateString.fromDate(new Date(2018, 2, 23), 'MM')).toBe('03');
    expect(DateString.fromDate(new Date(2018, 2, 23), 'YY')).toBe('18');
    expect(DateString.fromDate(new Date(2018, 2, 23), 'YYYY')).toBe('2018');
  });

  it('renders dates', () => {
    const dateOne = new Date(2016, 0, 20);
    const dateTwo = new Date(2015, 3, 5);
    const dateThird = new Date(2014, 4);
    const dateFour = new Date(2012, 6);

    expect(DateUtils.datesMatch(DateString.toDate('01/20/2016'), dateOne)).toBe(true);
    expect(DateUtils.datesMatch(DateString.toDate('04/05/2015'), dateTwo)).toBe(true);
    expect(DateUtils.datesMatch(DateString.toDate('05/2014', 'MM/YYYY'), dateThird)).toBe(true);
    expect(DateUtils.datesMatch(DateString.toDate('07/2012', 'MM/YYYY'), dateFour)).toBe(true);
  });

  it('unpacks dates', () => {
    expect(DateString.unpack('01/20/2016')).toEqual({
      day: 20,
      month: 0,
      year: 2016,
    });
    expect(DateString.unpack('1/2/16', 'M/D/YY')).toEqual({
      day: 2,
      month: 0,
      year: 16,
    });
  });
});
