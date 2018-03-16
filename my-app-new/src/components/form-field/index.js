//`use strict`;

// `use strict` causing an issue where having this declared above the imports:
// "Import in body of module; reorder to top"

import React from 'react';
import PropTypes from 'prop-types';
import FormManager from '../form/FormManager';
import FormControl from '../form/FormControl';
import Label from './../label';
import Hint from '../hint';
import CONSTANTS from './../../appConstants';
import classnames from 'classnames';
import './form-field.css';

const ERROR_CLASS = CONSTANTS.HTML_CLASS.ERROR;
const WARNING_CLASS = CONSTANTS.HTML_CLASS.WARNING;
const ACTIVE_CLASS = CONSTANTS.HTML_CLASS.ACTIVE;

/**
 * Supplies a new value based on the regular expression,.
 * @param {value, pattern}
 * @public
 */
function _regex(value, pattern, character = '') {
  if (value) {
    let newValue;
    const reg = new RegExp(pattern);
    const isValid = reg.test(value);
    newValue = isValid ? value.replace(pattern, character) : value;

    return newValue;
  }
}

/**
 * Controlled custom form field: of type text,
 * email, number, any of other types, and textareas.
 *
 * @class FormField
 * @param {Object} props
 * @extends FormControl
 * @constructor
 */
export default class FormField extends FormControl {
  constructor(props) {
    super(props);

    /**
     * The formFields's internal state.
     *
     * @property formField.state
     * @type {Object}
     */
    this.state = {
      /**
       * The current value.
       *
       * @property formField.state.value
       * @type {String}
       * @default ''
       */
      value: props.defaultValue || props.value || '',
      /**
       * Does the formField contain an error?
       *
       * @property formField.state.hasError
       * @type {Boolean}
       * @default false
       */
      hasError: props.hasError === null ? false : props.hasError,
      /**
       * Does the formField have a warning?
       *
       * @property formField.state.hasWarning
       * @type {Boolean}
       * @default false
       */
      hasWarning: props.hasWarning === null ? false : props.hasWarning,
      /**
       * Set max characters to maxLength prop
       *
       * @property formField.state.charCount
       * @type {String}
       * @default ''
       */
      charCount: props.maxLength || '',
    };
  }

/**
   * Defines the default properties for the formField.
   *
   * @property FormField.defaultProps
   * @type {Object}
   * @static
   */
 static defaultProps = Object.assign({
   /**
    * aria-describedby attribute value.
    *
    * @property FormField.defaultProps['aria-describedby']
    * @type {String}
    * @default ''
    */
   'aria-describedby': '',
   /**
    * Custom classnames placed on the formField's container.
    *
    * @property FormField.defaultProps.className
    * @type {String}
    * @default ''
    */
   className: '',
   /**
    * Text to display when the formField
    * encounters an error or is in its hasError state.
    *
    * @property FormField.defaultProps.errorText
    * @type {String}
    * @default ''
    */
   errorText: '',
   /**
    * Toggles the formFields' hasError state.
    *
    * @property FormField.defaultProps.hasError
    * @type {Boolean}
    * @default null
    */
   hasError: null,
   /**
    * Help text that displays under the formField.
    *
    * @property FormField.defaultProps.helpText
    * @type {String}
    * @default ''
    */
   helpText: '',
   /**
    * Toggles the formFields' hasWarning state.
    *
    * @property FormField.defaultProps.hasWarning
    * @type {Boolean}
    * @default null
    */
   hasWarning: null,
    /**
     * Toggles the formFields' isLoading state.
     *
     * @property FormField.defaultProps.isLoading
     * @type {Boolean}
     * @default null
     */
   isLoading: null,
   /**
    * Used to hijack control over the onChange event,
    * because the maskedInput needs to handle it internally.
    *
    * @property FormField.defaultProps.isMaskedInput
    * @type {Boolean}
    * @default false
    */
   isMaskedInput: false,
   /**
    * The formField's label.
    *
    * @property FormField.defaultProps.label
    * @type {String}
    * @default ''
    */
   label: '',
   /**
    * onChange callback. Triggers
    * when the value of the formField changes.
    *
    * @method FormField.defaultProps.onChange
    * @param {Event} event - change event
    */
   onChange(event) {},
   onBlur(event) {},
   onKeyDown(event) {},
   onPaste(event) {},
   /**
    * The formField's name attribute value.
    *
    * @property FormField.defaultProps.name
    * @type {String}
    * @default ''
    */
   name: '',
   /**
    * The formField's placeholder attribute value.
    *
    * @property FormField.defaultProps.placeholder
    * @type {String}
    * @default ''
    */
   placeholder: '',
   /**
    * Determines if the formField is a required field
    *
    * @property FormField.defaultProps.required
    * @type {Boolean}
    * @default false
    */
   required: false,
   /**
    * Determines the type of the input. This will
    * be used at the type attribute value.
    *
    * @property FormField.defaultProps.type
    * @type {String}
    * @default 'text'
    */
   type: 'text',
   /**
    * The formFields's value. The internal state value
    * will update as this changes.
    *
    * @property FormField.defaultProps.value
    * @type {String}
    * @default null
    */
   value: null,

 }, FormControl.defaultProps)

 /**
  * Defines the property types for the formField.
  *
  * @property FormField.propTypes
  * @type {Object}
  * @static
  */
 static propTypes = Object.assign({
   'aria-describedby': PropTypes.string,
   className: PropTypes.string,
   errorText: PropTypes.string,
   hasError: PropTypes.bool,
   hasWarning: PropTypes.bool,
   isLoading: PropTypes.bool,
   helpText: PropTypes.string,
   successText: PropTypes.string,
   warningText: PropTypes.string,
   isMaskedInput: PropTypes.bool,
   label: PropTypes.string,
   onChange: PropTypes.func,
   onBlur: PropTypes.func,
   onKeyDown: PropTypes.func,
   onPaste: PropTypes.func,
   maxLength: PropTypes.number,
   minLength: PropTypes.number,
   name: PropTypes.string,
   placeholder: PropTypes.string,
   inputclassName: PropTypes.string,
   inputRef: PropTypes.func,
   regex: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
   ]),
   required: PropTypes.bool,
   type: PropTypes.string,
   value: PropTypes.oneOfType([
     PropTypes.string,
     PropTypes.number
   ]),
 }, FormControl.propTypes)

  /**
   * Validate the formField and return
   * a validator object, which is a
   * snapshot of the formField's state.
   *
   * @method formField.validate
   * @return {Object}
   */
  validate = () => {
    const id = this.id;
    const value = this.state.value;
    const { name, required, type } = this.props;
    const valid = required ? FormManager.validate(value, this.validators) : true;
    const hasError = !valid;
    const validatorObj = this.props.onValidate({
      hasError,
      value,
    });

    this.setState({ hasError, });

    return {
      ...validatorObj,
      id,
      name,
      required,
      type,
      valid,
      value,
    };
  }

  componentDidMount() {
    const {
      autoExpand,
      rows,
      regex,
      value,
      showCharCount,
      maxLength,
    } = this.props;

    if(autoExpand && !rows) {
      this._autoExpand();
    }

    if(regex) {
      const newValue = value ? _regex(value, regex) : null;

      this.setState({
        value: newValue === null ? '' : newValue,
      });
    }

    if(maxLength && showCharCount) {
      const charCount = maxLength - this.state.value.length;

      this.setState({
        charCount,
      });
    }
  }

  /**
   * Update state if props that we care
   * about have changed.
   *
   * @method formField.componentWillReceiveProps
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    const {
      maxLength,
      showCharCount,
    } = this.props;

    const { value, hasError, hasWarning } = nextProps;

    /**
     * Only update these with the received props if we have a valid value.
     * This check is necessary because their default value is null.
     */

    this.setState({
      value: value === null ? '' : value,
      hasError: hasError === null ? this.state.hasError : hasError,
      hasWarning: hasWarning === null ? this.state.hasWarning : hasWarning,
    });

    if(maxLength && showCharCount) {
      const valLength = value ? value.length : 0;
      const charCount = maxLength - valLength;

      this.setState({
        charCount,
      });
    }
  }

  /**
   * Handle the change event:
   * Update the states value and trigger onChange callback.
   *
   * @method formField._onChange
   * @param  {Event} event - change event
   * @private
   */
  _onChange = event => {
    let value = event.target.value;

    const {
      autoExpand,
      regex,
      rows,
      maxLength,
      showCharCount,
    } = this.props;

    if(autoExpand && !rows) {
      this._autoExpand(event)
    }

    if(regex) {
      const newValue = _regex(value, regex);

      value = newValue;
    }

    if(maxLength && showCharCount) {
      const charCount = maxLength - value.length;

      this.setState({
        charCount,
      });
    }

    this.setState({  value: value === null ? '' : value, });

    this.props.onChange(event, value);
  }

  onKeyDown = event => {
    const {
      autoExpand,
      rows
    } = this.props;

    if(autoExpand && !rows) {
      this._autoExpand(event)
    }

    this.props.onKeyDown(event);
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

  _autoExpand = event => {
    this.formField.style.cssText = 'height: auto;';

    const height = this.formField.scrollHeight;
    this.formField.style.cssText = `height: ${height}px;`;
  }

  _onPaste = event => {
    const {
      preventPaste,
    } = this.props;

    if(preventPaste) {
      event.preventDefault();
    }

    this.props.onPaste(event);
  }

  /**
   * Handle the conditional rendering of the Hint component
   *
   * @method formField._hintGenerator
   * @param  {Event} event - change event
   * @private
   */
  _hintGenerator = () => {
    const {
      errorText,
      id,
      required,
    } = this.props;

    if(!required) {
      return <Hint id={`${id}_error`} text={ errorText } icon="error-solid" type="error" />
    } else {
      return <Hint id={`${id}_error`} text={ errorText } icon="error-solid" type="error" />
    }
  }

  /**
   * Renders the form field.
   *
   * @method formField.render
   */
  render() {
    const {
      autoExpand,
      className,
      defaultValue,
      hasError,
      hasWarning,
      isLoading,
      helpText,
      errorText,
      isMaskedInput,
      label,
      name,
      onValidate,
      hidden,
      placeholder,
      inputclassName,
      inputRef,
      preventPaste,
      showCharCount,
      maxLength,
      regex,
      required,
      successText,
      warningText,
      rows,
      type,
      validators,
      onPaste,
      _form,
      _formValidateOnBlur,
      ...other,
    } = this.props;

    const {id, props, onKeyDown, _onPaste} = this;

    const {
      value,
      charCount,
    } = this.state;

    const ariaDescribedby = `${id}_error ${id}_hint ${props['aria-describedby']}`;
    const _hasError = this.state.hasError;
    const _hasWarning = this.state.hasWarning;
    // If we're dealing with a masked input, use its onChange
    const _onChange = isMaskedInput ? props.onChange : this._onChange;
    //If we're dealing with onBlur validation
    const _onBlur = this._onBlur;

    return (
      <div hidden={ hidden }>
        <div className={ classnames(
          'c-form-field',
          { [className]: className, },
          { 'c-form-field--labelless': !label, },
          { 'c-form-field--filled': value, },
          { [ERROR_CLASS]: _hasError, },
          { [WARNING_CLASS]: _hasWarning, },
          { 'is-loading': isLoading, },
        ) }>
          {
            type === 'textarea' ?
            <textarea
              { ...other }
              id={ id }
              ref={ (textarea) => { this.formField = textarea; } }
              className={`c-form-field__textarea ${autoExpand && !rows ? 'c-form-field__textarea--auto-expand' : ''}`}
              name={ name }
              required={ required }
              maxLength={ maxLength }
              placeholder={ placeholder }
              onChange={ _onChange }
              onBlur={ _onBlur }
              onKeyDown={ onKeyDown }
              onPaste={ _onPaste }
              rows={ rows }
              value={ value }
              aria-describedby={ ariaDescribedby }
            ></textarea> :
            <input
              { ...other }
              id={ id }
              ref={ inputRef }
              //ref={ (input) => { this.formField = input; } }
              className={ inputclassName }
              name={ name }
              required={ required }
              maxLength={ maxLength }
              placeholder={ placeholder }
              type={ type || 'text' }
              onChange={ _onChange }
              onBlur={ _onBlur }
              onPaste={ _onPaste }
              value={ value }
              aria-describedby={ ariaDescribedby } />
           }
          <span className="c-form-field__label">
            {
              <Label
                htmlFor={ id }
                text={ label }
                required={ required }
                className="c-label--agreeable">

              </Label>
            }
          </span>
          <span className="c-form-field__underline" />
        </div>
        { (_hasError) ? this._hintGenerator() : '' }
        { (!_hasError || !_hasWarning ? <Hint id={`${id}_hint`} text={ helpText } /> : '') }
        { (successText ? <Hint icon="check-circle" type="success" id={`${id}_success`} text={ successText } /> : '') }
        { (_hasWarning ? <Hint type="warning" id={`${id}_warning`} text={ warningText } /> : '') }
        { (showCharCount && maxLength ? <Hint id={`${id}_charCount`} text={ `Max character: ${charCount}` } /> : '') }
      </div>
    );
  }
}
