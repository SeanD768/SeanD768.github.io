'use strict';

const DEFAULTS_OPTIONS = {
    cyclic: true,
    index: -1,
    pausable: false,
    total: 0,
};

export default class RovingIndex {
  constructor(config = {}) {
    const options = Object.assign({}, DEFAULTS_OPTIONS, config);

    this.cyclic = options.cyclic;
    this.index = options.index;
    this.pausable = options.pausable;
    this.total = options.total;
  }

  resetIndex() {
    this.index = -1;
  }

  getIndex() {
    return this.index;
  }

  getTotal() {
    return this.total;
  }

  prev(callback = () => {}) {
    const oldIndex = this.index;
    this.setIndex(this.index - 1);
    callback(oldIndex, this.index);
  }

  next(callback = () => {}) {
    const oldIndex = this.index;
    this.setIndex(this.index + 1);
    callback(oldIndex, this.index);
  }

  setIndex(index = 0, total = this.total) {
    this.index = RovingIndex.validateIndex(
      index,
      total,
      {
        cyclic: this.cyclic,
        pausable: this.pausable,
      }
    );
  }

  setTotal(total = 0) {
    this.total = total;
  }

  static validateIndex(index = 0, total = 0, options = {}) {
    if (options.pausable) {
      return RovingIndex.validatePausableIndex(index, total)
    }

    if (options.cyclic) {
      return RovingIndex.validateCyclicIndex(index, total);
    }

    return RovingIndex.validateFiniteIndex(index, total);
  }

  static validateFiniteIndex(index, total) {
    if (index < 0) {
      return 0;
    } else if (index >= total) {
      return total - 1;
    }

    return index;
  }

  static validateCyclicIndex(index, total) {
    if (index < 0) {
      return total - 1;
    } else if (index >= total) {
      return 0;
    }

    return index;
  }

  static validatePausableIndex(index, total) {
    if (index === -1 || index >= total) {
      return -1;
    } else if (index < -1) {
      return total - 1;
    }

    return index;
  }
}
