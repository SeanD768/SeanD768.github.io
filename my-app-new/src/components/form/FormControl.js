import React from 'react';
import PropTypes from 'prop-types';
import FormManager from './FormManager';
import FormValidators from './../../utils/form-validators/';
import generateID from './../../utils/generateID';

/**
 * A base class that provides the API necessary for
 * form controls to interact with forms via the FormManager.
 *
 * @class FormControl
 * @param {Object} props
 * @extends React.PureComponent
 * @constructor
 */
export default class FormControl extends React.PureComponent {
  constructor(props) {
    super(props);

    /**
     * A unique ID.
     *
     * @property formControl.id
     * @type {String}
     */
    this.id = props.id || generateID('field_');

    /**
     * A list of validator functions.
     *
     * @property formControl.validators
     * @type {Function[]}
     */
    this.validators = [...FormValidators.getValidators(props), ...props.validators];

    /**
     * A method that remove that unlinks
     * the form control instance from the form.
     *
     * @property formControl.removeValidator
     * @type {Function}
     */
    this.removeValidator = null;
  }

  /**
   * Link this form control with its form
   * (if it has a _form property).
   *
   * @method formControl.componentWillMount
   */
  componentWillMount() {
    this.removeValidator = FormManager.addValidator(this.props._form,
      {
        id: this.id,
        validator: this.validate,
      }
    );
  }

  /**
   * Unlink this form control from its parent
   * form (if it has one).
   *
   * @method formControl.componentWillUnmount
   */
  componentWillUnmount() {
    if (this.removeValidator) {
      this.removeValidator();
    }
  }

  /**
   * Validate self. Return validator object.
   *
   * @method formControl.validate
   * @returns {Object} validator object
   */
  validate() { return {}; }

  /**
   * @property FormControl.defaultProps
   * @static
   */
  static defaultProps = {
    /**
     * onValidate callback.
     *
     * @method FormControl.defaultProps.onValidate
     * @param {Object} details
     * @param {Boolean} details.hasError
     * @param {String} details.value
     */
    onValidate(details) {},
    /**
     * A list of validator functions. Each validator function received
     * the form controls value and is expected to return a Boolean
     * indicating whether or not the value is valid.
     *
     * @property FormControl.defaultProps.validators
     * @type {Function[]}
     */
    validators: [],
  }

  /**
   * @property FormControl.propTypes
   * @type {Object}
   * @static
   */
  static propTypes = {
    onValidate: PropTypes.func,
    validators: PropTypes.array,
  }
}
