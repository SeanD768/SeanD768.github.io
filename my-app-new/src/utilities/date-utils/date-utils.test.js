import sinon from 'sinon';
import { shallow } from 'enzyme';
import DateUtils from './';

describe('DateUtils', () => {
  it('creates range', () => {
    const now = new Date();
    const dateTwo = new Date(1800, 0);
    const rangeOne = DateUtils.makeRange(new Date(2016, 11, 0), 200);

    expect(DateUtils.dateIsInRange(now, rangeOne)).toBe(true);
    expect(DateUtils.dateIsInRange(dateTwo, rangeOne)).toBe(false);
  });

  it('date is in range', () => {
    const year2015 = new Date(2015, 0);
    const feb2017 = new Date(2017, 1);
    const range = [
      new Date(2016, 11, 0),
      new Date(2017, 11, 0)
    ];

    expect(DateUtils.dateIsInRange(year2015, range)).toBe(false);
    expect(DateUtils.dateIsInRange(feb2017, range)).toBe(true);
  });

  it('list of dates contains date', () => {
    const jan2017 = new Date(2017, 0);

    expect(DateUtils.datesContain([jan2017, new Date(2015, 1)], jan2017)).toBe(true);
  });

  it('dates match', () => {
    expect(DateUtils.datesMatch(new Date(2017, 1, 2), new Date(2017, 1, 2))).toBe(true);
  });

  it('pads date digit', () => {
    expect(DateUtils.padDateDigit(1)).toBe('01');
    expect(DateUtils.padDateDigit(8)).toBe('08');
    expect(DateUtils.padDateDigit(10)).toBe('10');
  });

  it('is date', () => {
    expect(DateUtils.isDate(1)).toBe(false);
    expect(DateUtils.isDate(new Date())).toBe(true);
    expect(DateUtils.isDate()).toBe(false);
  });

  it('returns offset dates', () => {
    const offsetDate = DateUtils.getOffsetDate(new Date(2016, 0), 1);
    const otherOffsetDate = DateUtils.getOffsetDate(new Date(2016, 0), -10);

    expect(DateUtils.datesMatch(new Date(2017, 0), offsetDate)).toBe(true);
    expect(DateUtils.datesMatch(new Date(2006, 0), otherOffsetDate)).toBe(true);
  });
});
