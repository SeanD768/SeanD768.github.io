'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '../form/FormControl';
import Hint from '../hint';
import Icon from '../icon';
import CONSTANTS from './../../appConstants';
import classnames from 'classnames';

const ERROR_CLASS = CONSTANTS.HTML_CLASS.ERROR;
const WARNING_CLASS = CONSTANTS.HTML_CLASS.WARNING;

/**
 * Uncontrolled custom checkbox/radio input component.
 *
 * @class FormOption
 * @param {Object} props
 * @extends React.PureComponent
 * @constructor
 */
export default class FormOption extends FormControl {
  constructor(props) {
    super(props);

    /**
     * The formOption's internal state.
     *
     * @property formOption.state
     * @type {Object}
     */
    this.state = {
      /**
       * Does the formOption contain an error?
       *
       * @property formOption.state.hasError
       * @type {Boolean}
       * @default false
       */
      hasError: props.hasError === null ? false : props.hasError,
      /**
       * Does the formOption have a warning?
       *
       * @property formOption.state.hasWarning
       * @type {Boolean}
       * @default false
       */
      hasWarning: props.hasWarning === null ? false : props.hasWarning,
    };
  }

  /**
   * Defines the default properties for the formOption.
   *
   * @property FormOption.defaultProps
   * @type {Object}
   * @static
   */
  static defaultProps = Object.assign({
    /**
     * Custom classnames placed on the formOption's container.
     *
     * @property FormOption.defaultProps.className
     * @type {String}
     * @default ''
     */
    className: '',
    /**
     * Text to display when the formOption
     * encounters an error or is in its hasError state.
     *
     * @property FormOption.defaultProps.errorText
     * @type {String}
     * @default ''
     */
    errorText: '',
    /**
     * Toggles the formOption's hasError state.
     *
     * @property FormOption.defaultProps.hasError
     * @type {Boolean}
     * @default null
     */
    hasError: null,
    /**
     * Toggles the formOptions' hasWarning state.
     *
     * @property FormOption.defaultProps.hasWarning
     * @type {Boolean}
     * @default null
     */
    hasWarning: null,
    /**
     * Help text that displays under the formOption.
     *
     * @property FormOption.defaultProps.helpText
     * @type {String}
     * @default ''
     */
    helpText: '',
    /**
     * The formOption's label.
     *
     * @property FormOption.defaultProps.label
     * @type {String}
     * @default ''
     */
    label: '',
    /**
     * The formOption's name attribute value.
     *
     * @property FormOption.defaultProps.name
     * @type {String}
     * @default ''
     */
    name: '',
    /**
     * onChange callback. Triggers
     * when state (checked/unchecked) of
     * the formOption changes.
     *
     * @method FormOption.defaultProps.onChange
     * @param {Event} event - change event
     */
    onChange(event) {},
    onBlur(event) {},
    /**
     * Determines if the formOption is a required field
     *
     * @property FormOption.defaultProps.required
     * @type {Boolean}
     * @default false
     */
    required: false,
    /**
     * Determines the type of the input. This will
     * be used at the type attribute value.
     *
     * @property FormOption.defaultProps.type
     * @type {String}
     * @default 'checkbox'
     */
    type: 'checkbox',
    /**
     * The formOption's value. The internal state value
     * will update as this changes.
     *
     * @property FormOption.defaultProps.value
     * @type {String}
     * @default ''
     */
    value: '',
  }, FormControl.defaultProps)

  /**
   * Defines the property types for the formOption.
   *
   * @property FormOption.propTypes
   * @type {Object}
   * @static
   */
  static propTypes = Object.assign({
    className: PropTypes.string,
    errorText: PropTypes.string,
    hasError: PropTypes.bool,
    hasWarning: PropTypes.bool,
    helpText: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    required: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.string,
  }, FormControl.propTypes)

  /**
   * Update state if props that we care
   * about have changed.
   *
   * @method formOption.componentWillReceiveProps
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    const { hasError, hasWarning } = nextProps;

    this.setState({
      hasError: hasError === null ? this.state.hasError : hasError,
      hasWarning: hasWarning === null ? this.state.hasWarning : hasWarning,
    });
  }

  /**
   * Validate the formOption and return
   * a validator object, which is a
   * snapshot of the formOption's state.
   *
   * @method formOption.validate
   * @returns {Object}
   */
  validate = () => {
    const id = this.id;
    const { name, required, type, value, } = this.props;
    const checked = this.input.checked;
    const valid = required ? this.input && this.input.checked : true;
    const hasError = !valid;
    const validatorObj = this.props.onValidate({
      hasError,
      value,
    });

    this.setState({ hasError });

    return {
      ...validatorObj,
      id,
      name,
      required,
      type,
      valid,
      value,
      checked,
    };
  }

  _onBlur = event => {
    const {
      _formValidateOnBlur,
    } = this.props;

    if(_formValidateOnBlur) {
      this.validate();
    }

    this.props.onBlur(event);
  }

  /**
   * Renders the form option.
   *
   * @method formOption.render
   */
  render() {
    const {
      children,
      className,
      errorText,
      hasError,
      hasWarning,
      helpText,
      label,
      name,
      onChange,
      onValidate,
      required,
      hidden,
      type,
      validators,
      value,
      _form,
      _formValidateOnBlur,
      ...other,
    } = this.props;

    const id = this.id;
    const _hasError = this.state.hasError;
    const _hasWarning = this.state.hasWarning;

    const _onBlur = this._onBlur;

    return (
      <div className={`c-option ${className || ''}`}
        hidden={ hidden }>
        <label className="c-option__label" htmlFor={ id }>
          <input
            { ...other }
            ref={ input => { this.input = input; } }
            id={ id }
            name={ name }
            required={ required }
            type={ type }
            className={ classnames(
              'c-option__label__input',
              { [ERROR_CLASS]: _hasError, },
              { [WARNING_CLASS]: _hasWarning, },
            ) }
            value={ value }
            onChange={ onChange }
            onBlur={ _onBlur }
            aria-describedby={`${id}_error ${id}_hint`} />
          <span className="c-option__label__icon" aria-hidden="true">
            { type === 'checkbox' ? <Icon icon="checkmark" /> : '' }
          </span>
          <span className="c-option__label__text">{ children || label }</span>
        </label>
        <span className="c-option__message">
          {
            (_hasError && required)
            ? <Hint className="c-hint--condensed" id={`${id}_error`} text={ errorText } type="error" />
            : ''
          }
          <Hint className="c-hint--condensed" id={`${id}_hint`} text={ helpText } />
        </span>
      </div>
    );
  }
}
