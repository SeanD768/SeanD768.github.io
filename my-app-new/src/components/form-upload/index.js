//`use strict`;

// `use strict` causing an issue where having this declared above the imports:
// "Import in body of module; reorder to top"

import React from 'react';
import PropTypes from 'prop-types';
import FormManager from '../form/FormManager';
import Icon from '../icon/';
import FormControl from '../form/FormControl';
import Label from './../label';
import Hint from '../hint';
import CONSTANTS from './../../appConstants';
import classnames from 'classnames';

const ERROR_CLASS = CONSTANTS.HTML_CLASS.ERROR;
const WARNING_CLASS = CONSTANTS.HTML_CLASS.WARNING;
const ACTIVE_CLASS = CONSTANTS.HTML_CLASS.ACTIVE;

/**
 * Controlled custom form field: of type text,
 * email, number, any of other types, and textareas.
 *
 * @class FormUpload
 * @param {Object} props
 * @extends FormControl
 * @constructor
 */
export default class FormUpload extends FormControl {
  constructor(props) {
    super(props);

    /**
     * The FormUploads's internal state.
     *
     * @property FormUpload.state
     * @type {Object}
     */
    this.state = {
      /**
       * The current dataUri.
       *
       * @property FormUpload.state.dataUri
       * @type {String}
       * @default ''
       */
      dataUri: '',
      /**
       * The current fileName.
       *
       * @property FormUpload.state.fileName
       * @type {String}
       * @default ''
       */
      fileName: '',
      /**
       * The current fileType.
       *
       * @property FormUpload.state.fileType
       * @type {String}
       * @default ''
       */
      fileType: '',
      /**
       * The current value.
       *
       * @property FormUpload.state.value
       * @type {String}
       * @default ''
       */
      value: props.defaultValue || props.value || '',
      /**
       * Does the FormUpload contain an error?
       *
       * @property FormUpload.state.hasError
       * @type {Boolean}
       * @default false
       */
      hasError: props.hasError === null ? false : props.hasError,
      /**
       * Does the FormUpload have a warning?
       *
       * @property FormUpload.state.hasWarning
       * @type {Boolean}
       * @default false
       */
      hasWarning: props.hasWarning === null ? false : props.hasWarning,
    };
  }

/**
   * Defines the default properties for the FormUpload.
   *
   * @property FormUpload.defaultProps
   * @type {Object}
   * @static
   */
 static defaultProps = Object.assign({
   /**
    * aria-describedby attribute value.
    *
    * @property FormUpload.defaultProps['aria-describedby']
    * @type {String}
    * @default ''
    */
   'aria-describedby': '',
   /**
    * Custom classnames placed on the FormUpload's container.
    *
    * @property FormUpload.defaultProps.className
    * @type {String}
    * @default ''
    */
   className: '',
   /**
    * Text to display when the FormUpload
    * encounters an error or is in its hasError state.
    *
    * @property FormUpload.defaultProps.errorText
    * @type {String}
    * @default ''
    */
   errorText: '',
   /**
    * Toggles the FormUploads' hasError state.
    *
    * @property FormUpload.defaultProps.hasError
    * @type {Boolean}
    * @default null
    */
   hasError: null,
   /**
    * Help text that displays under the FormUpload.
    *
    * @property FormUpload.defaultProps.helpText
    * @type {String}
    * @default ''
    */
   helpText: '',
   /**
    * Toggles the FormUploads' hasWarning state.
    *
    * @property FormUpload.defaultProps.hasWarning
    * @type {Boolean}
    * @default null
    */
   hasWarning: null,
    /**
     * Toggles the FormUploads' isLoading state.
     *
     * @property FormUpload.defaultProps.isLoading
     * @type {Boolean}
     * @default null
     */
   isLoading: null,
   /**
    * The FormUpload's label.
    *
    * @property FormUpload.defaultProps.label
    * @type {String}
    * @default ''
    */
   label: '',
   /**
    * onChange callback. Triggers
    * when the value of the FormUpload changes.
    *
    * @method FormUpload.defaultProps.onChange
    * @param {Event} event - change event
    */
   onChange(event) {},
   onBlur(event) {},
   onFileUpload(details) {},
   onDrop(event) {},
   onDragOver(event) {},
   /**
    * The FormUpload's name attribute value.
    *
    * @property FormUpload.defaultProps.name
    * @type {String}
    * @default ''
    */
   name: '',
   /**
    * The FormUpload's placeholder attribute value.
    *
    * @property FormUpload.defaultProps.placeholder
    * @type {String}
    * @default ''
    */
   placeholder: '',
   /**
    * Determines if the FormUpload is a required field
    *
    * @property FormUpload.defaultProps.required
    * @type {Boolean}
    * @default false
    */
   required: false,
   /**
    * Determines the type of the input. This will
    * be used at the type attribute value.
    *
    * @property FormUpload.defaultProps.type
    * @type {String}
    * @default 'text'
    */
   type: 'file',
   /**
    * The FormUploads's value. The internal state value
    * will update as this changes.
    *
    * @property FormUpload.defaultProps.value
    * @type {String}
    * @default null
    */
   value: '',
 }, FormControl.defaultProps)

 /**
  * Defines the property types for the FormUpload.
  *
  * @property FormUpload.propTypes
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
   warningText: PropTypes.string,
   successText: PropTypes.string,
   label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
   icon: PropTypes.string,
   onChange: PropTypes.func,
   onFileUpload: PropTypes.func,
   onBlur: PropTypes.func,
   onDrop: PropTypes.func,
   onDragOver: PropTypes.func,
   name: PropTypes.string,
   required: PropTypes.bool,
   value: PropTypes.string,
 }, FormControl.propTypes)

  /**
   * Validate the FormUpload and return
   * a validator object, which is a
   * snapshot of the FormUpload's state.
   *
   * @method FormUpload.validate
   * @return {Object}
   */
  validate = () => {
    const id = this.id;
    //const value = this.FormUpload.value;
    const { dataUri, fileName, fileType } = this.state
    const { name, required, type } = this.props;
    const valid = required ? FormManager.validate(fileName, this.validators) : true;
    const hasError = !valid;
    const validatorObj = this.props.onValidate({
      hasError,
      dataUri,
      fileName,
      fileType
    });

    this.setState({ hasError, });

    return {
      ...validatorObj,
      id,
      name,
      required,
      type,
      valid,
      dataUri,
      fileName,
      fileType,
    };
  }

  /**
   * Add event listeners for dropzone
   *
   * @method FormUpload.componentDidMount
   * @param {Object} props
   */
  componentDidMount() {
  }

  /**
   * Update state if props that we care
   * about have changed.
   *
   * @method FormUpload.componentWillReceiveProps
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    const { hasError, hasWarning } = nextProps;

    /**
     * Only update these with the received props if we have a valid value.
     * This check is necessary because their default value is null.
     */

    this.setState({
      hasError: hasError === null ? this.state.hasError : hasError,
      hasWarning: hasWarning === null ? this.state.hasWarning : hasWarning,
    });
  }

  /**
   * Handle the change event:
   * Update the states value and trigger onChange/onFileUpload callback.
   *
   * @method FormUpload._onChange
   * @param  {Event} event - change event
   * @private
   */
  _onChange = (event) => {
    const file = event.target.files[0];

    this.processFile(file);

    this.props.onChange(event);
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
   * Handle the conditional rendering of the Hint component
   *
   * @method FormUpload._hintGenerator
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
   * Disable default drag over for IE
   *
   * @method FormUpload._onDragOver
   * @param  {Event} event - change event
   * @private
   */
  _onDragOver = event => {
    event.preventDefault();

    this.props.onDragOver(event);
  }

  /**
   * Get the file details when droping
   *
   * @method FormUpload._onDrop
   * @param  {Event} event - change event
   * @private
   */
  _onDrop = event => {
    event.preventDefault();

     if(event.dataTransfer && event.dataTransfer.files.length != 0){
      const files = event.dataTransfer.files;
      const file = files[0];

      this.processFile(file);
    }

    this.props.onDrop(event);
  }

  /**
   * Process the file and set internal state
   *
   * @method FormUpload.processFile
   * @param  {file}
   * @private
   */
  processFile = file => {
    const reader = new FileReader();

    reader.onload = (upload) => {
      this.setState({
        loading: true,
        dataUri: upload.target.result,
        fileName: file.name,
        fileType: file.type,
      });
    };

    reader.onloadend = () =>{
      this.setState({
        loading: false,
      });

      this.props.onFileUpload({
        dataUri: this.state.dataUri,
        fileName: this.state.fileName,
        fileType: this.state.fileType,
      });
    }

    reader.readAsDataURL(file);
  }

  /**
   * Renders the form field.
   *
   * @method FormUpload.render
   */
  render() {
    const {
      className,
      hasError,
      hasWarning,
      isLoading,
      dropzone,
      helpText,
      errorText,
      label,
      icon,
      name,
      onValidate,
      successText,
      warningText,
      onFileUpload,
      hidden,
      required,
      validators,
      _form,
      _formValidateOnBlur,
      ...other,
    } = this.props;

    const {id, props, _onDrop, _onDragOver} = this;
    const ariaDescribedby = `${id}_error ${id}_hint ${props['aria-describedby']}`;
    const _hasError = this.state.hasError;
    const _hasWarning = this.state.hasWarning;
    const _onChange = this._onChange;
    //If we're dealing with onBlur validation
    const _onBlur = this._onBlur;
    const fileName = this.state.fileName;

    return (
      <div hidden={ hidden }>
        <div className={ classnames(
          'c-form-upload',
          {'c-form-upload--dropzone': dropzone},
          { [className]: className, },
          { [ERROR_CLASS]: _hasError, },
          { [WARNING_CLASS]: _hasWarning, },
          { 'is-loading': isLoading, },
        ) }>
          <input
            { ...other }
            id={ id }
            ref={ (input) => { this.FormUpload = input; } }
            className="c-form-upload__input"
            name={ name }
            required={ required }
            type={ 'file' }
            onChange={ _onChange }
            onDragOver={ _onDragOver }
            onBlur={ _onBlur }
            onDrop={ _onDrop }
            aria-describedby={ ariaDescribedby } />
          <span className="c-form-upload__label">
            <Label
              htmlFor={ id }
              text={ label }
              required={ required }
              className="c-form-upload__label__text c-label--agreeable u-vr" />
            { !dropzone ?
              <div>
                <span className="c-form-upload__btn c-btn c-btn--secondary">Choose File</span>
                <span className="c-form-upload__name u-hr-left u-text-gray u-text-bold">{fileName ? fileName : ''}</span>
              </div>
            : ''}
          </span>
          <span className="c-form-upload__underline" />
        </div>
        { (_hasError) ? this._hintGenerator() : '' }
        { (!_hasError || !_hasWarning ? <Hint id={`${id}_hint`} text={ helpText } /> : '') }
        { (successText ? <Hint icon="check-circle" type="success" id={`${id}_success`} text={ successText } /> : '') }
        { (_hasWarning ? <Hint type="warning" id={`${id}_warning`} text={ warningText } /> : '') }
      </div>
    );
  }
}
