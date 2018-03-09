import RovingIndex from './';
import sinon from 'sinon';

describe('RovingIndex', () => {
  it('is cyclic', () => {
    const rovingIndex = new RovingIndex();

    expect(rovingIndex.cyclic).toEqual(true);
  });

  it('is pausable', () => {
    const rovingIndex = new RovingIndex({
        pausable: true,
    });

    expect(rovingIndex.pausable).toEqual(true);
  });

  it('has default index of -1', () => {
    const rovingIndex = new RovingIndex();

    expect(rovingIndex.getIndex()).toEqual(-1);
  });

  it('has default total of 0', () => {
    const rovingIndex = new RovingIndex();

    expect(rovingIndex.getTotal()).toEqual(0);
  });

  it('resets index', () => {
    const rovingIndex = new RovingIndex({
        index: 1,
    });

    rovingIndex.resetIndex();

    expect(rovingIndex.getIndex()).toEqual(-1);
  });

  it('sets total', () => {
    const rovingIndex = new RovingIndex();

    rovingIndex.setTotal(10);

    expect(rovingIndex.getTotal()).toEqual(10);
  });

  it('index is 0', () => {
    const rovingIndex = new RovingIndex();

    rovingIndex.setTotal(10);
    rovingIndex.next();

    expect(rovingIndex.getIndex()).toEqual(0);
  });

  it('index is 9', () => {
    const rovingIndex = new RovingIndex();

    rovingIndex.setTotal(10);
    rovingIndex.prev();

    expect(rovingIndex.getIndex()).toEqual(9);
  });

  it('index cycles', () => {
    const rovingIndex = new RovingIndex();

    rovingIndex.setTotal(3);
    rovingIndex.next();
    rovingIndex.next();
    rovingIndex.next();
    rovingIndex.next();
    rovingIndex.next();

    expect(rovingIndex.getIndex()).toEqual(1);
  });

  it('index is finite', () => {
    const rovingIndex = new RovingIndex({
        cyclic: false,
    });

    rovingIndex.setTotal(3);
    rovingIndex.next();
    rovingIndex.next();
    rovingIndex.next();
    rovingIndex.next();
    rovingIndex.next();

    expect(rovingIndex.getIndex()).toEqual(2);
  });

  it('index is pausable', () => {
    const rovingIndex = new RovingIndex({
        pausable: true,
    });

    rovingIndex.setTotal(3);
    rovingIndex.next();
    rovingIndex.next();
    rovingIndex.next();
    rovingIndex.next();

    expect(rovingIndex.getIndex()).toEqual(-1);
  });

  it('triggers next callback', () => {
    const onNext = sinon.spy();
    const rovingIndex = new RovingIndex();

    rovingIndex.setTotal(3);
    rovingIndex.next(onNext);

    expect(onNext.called).toEqual(true);
  });

  it('triggers prev callback', () => {
    const onPrev = sinon.spy();
    const rovingIndex = new RovingIndex();

    rovingIndex.setTotal(3);
    rovingIndex.prev(onPrev);

    expect(onPrev.called).toEqual(true);
  });

  it('returns valid cyclic index', () => {
    expect(RovingIndex.validateCyclicIndex(11, 10)).toEqual(0);
    expect(RovingIndex.validateCyclicIndex(-3, 10)).toEqual(9);
  });

  it('returns valid finite index', () => {
    expect(RovingIndex.validateFiniteIndex(-1, 10)).toEqual(0);
    expect(RovingIndex.validateFiniteIndex(11, 10)).toEqual(9);
  });

  it('returns valid pausable index', () => {
    expect(RovingIndex.validatePausableIndex(-2, 10)).toEqual(9);
    expect(RovingIndex.validatePausableIndex(12, 10)).toEqual(-1);
  });
});
