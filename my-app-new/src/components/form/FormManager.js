import find from 'lodash.find';
/**
 * A workflow object responsible for establishing
 * relationships between forms and their controls and
 * provides means for validating forms and their individual controls.
 *
 * @class FormManager
 * @constructor
 * @static
 */
export default class FormManager {
  /**
   * Add the provided form to the forms collection.
   * Return early if the form has already been added.
   *
   * @method FormManager.addForm
   * @param {Object} form
   * @param {String} form.id
   * @returns {Function} removeForm
   */
  static addForm({ id }) {
    if (FormManager.forms.has(id)) {
      return;
    }

    FormManager.forms.set(id, { id, validators: [] });

    return () => {
      FormManager.forms.delete(id);
    }
  }

  /**
   * Return the index of the validator the uses the
   * provided id and belongs to the provided form.
   *
   * @method FormManager.getValidatorIndexByID
   * @param {String} id
   * @param {Object} form
   * @returns {Number} validator index
   */
  static getValidatorIndexByID(id, form) {
    let index = -1;

    form.validators.some((validator, i) => {
      const match = validator.id === id;

      if (match) {
        index = i;
      }

      return match;
    });

    return index;
  }

  /**
   * Add the provided validator object to the
   * form that uses the provided formID.
   *
   * @method FormManager.addValidator
   * @param {String} formID
   * @param {Object} validatorObject
   * @returns {Function} removeValidator
   */
  static addValidator(formID, validatorObject = {}) {
    const form = FormManager.forms.get(formID);

    if (!form) {
      return;
    }

    const id = validatorObject.id;
    const isDuplicate = FormManager.getValidatorByID(id, form) !== null;

    if (isDuplicate) {
      throw new Error(`Duplicate ID detected: ${JSON.stringify(validatorObject)}`);
    }

    form.validators.push(validatorObject);

    return () => {
      const start = FormManager.getValidatorIndexByID(id, form);

      form.validators.splice(start, 1);
    }
  }

  /**
   * Return the validator the uses the provided id
   * and belongs to the provided form.
   *
   * @method FormManager.getValidatorByID
   * @param {String} id
   * @param {Object} form
   * @returns {Object} validator
   */
  static getValidatorByID(id, form) {
    let validator = null;

    form.validators.some((v, i) => {
      const match = v.id === id;

      if (match) {
        validator = v;
      }

      return match;
    });

    return validator;
  }

  /**
   * Validate the form that uses the provided formID.
   *
   * @method FormManager.getValidatorByID
   * @param {String} id
   * @param {Object} form
   * @return {Object} validator object
   */
  static validateFormById(formID) {
    const form = FormManager.forms.get(formID);
    const validators = form.validators;
    const fields = {};

    const valid = validators.filter(validatorObject => {
      const field = validatorObject.validator();
      const { id, ...other } = field;

      fields[id] = { ...other };

      return !field.valid;
    }).length === 0;

    return {
      valid,
      fields,
    }
  }

  /**
   * Validate the provided value against the provided validators.
   *
   * @method FormManager.validate
   * @param {String} [value='']
   * @param {Function[]} [validators=[]]
   * @return {Boolean}
   */
  static validate(value = '', validators = []) {
    return validators.filter(validator => !validator(value)).length === 0;
  }

  /**
   * A collection of forms.
   *
   * @property FormManager.forms
   * @type {Map}
   */
  static forms = new Map();
}
