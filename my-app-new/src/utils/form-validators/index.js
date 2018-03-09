`use strict`;

export default class FormValidators {
  static required(value = '') {
    const trimmedValue = value.trim();

    return trimmedValue.trim() !== '';
  }

  static minLength(minlength, value = '') {
    const trimmedValue = value.trim();

    return trimmedValue.length >= minlength;
  }

  static maxLength(maxlength, value = '') {
    const trimmedValue = value.trim();

    return trimmedValue.length <= maxlength;
  }

  static getValidators(settings = {}) {
    const validators = [];
    const {
      maxLength,
      minLength,
    } = settings;

    if (settings.required) {
      validators.push(FormValidators.required);
    }

    if (settings.minLength) {
      validators.push(FormValidators.minLength.bind(null, minLength));
    }

    if (settings.maxLength) {
      validators.push(FormValidators.maxLength.bind(null, maxLength));
    }

    return validators;
  }
}
