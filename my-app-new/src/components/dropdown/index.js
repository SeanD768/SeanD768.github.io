import React from 'react';
import PropTypes from 'prop-types';
import FormManager from '../form/FormManager';
import FormControl from '../form/FormControl';
import Label from './../label';
import Hint from '../hint';
import CONSTANTS from './../../appConstants';
import classnames from 'classnames';
import { filter, map, omit, sortedUniqBy } from 'lodash';

const ERROR_CLASS = CONSTANTS.HTML_CLASS.ERROR;
const WARNING_CLASS = CONSTANTS.HTML_CLASS.WARNING;
const ACTIVE_CLASS = CONSTANTS.HTML_CLASS.ACTIVE;

/**
 * Controlled custom select menu Component
 *
 * @class Dropdown
 * @param {Object} props
 * @extends FormControl
 * @constructor
 */
export default class Dropdown extends FormControl {
  constructor(props) {
    super(props);

    const value = props.defaultValue || props.value || '';
    const options = [props.defaultOption].concat(props.options);

    /**
     * The dropdown's internal state.
     *
     * @property dropdown.state
     * @type {Object}
     */
    this.state = {
      /**
       * Does the dropdown contain an error?
       *
       * @property dropdown.state.hasError
       * @type {Boolean}
       * @default false
       */
      hasError: props.hasError === null ? false : props.hasError,
      /**
       * Does the dropdown contain a warning?
       *
       * @property dropdown.state.hasWarning
       * @type {Boolean}
       * @default false
       */
      hasWarning: props.hasWarning === null ? false : props.hasWarning,
      /**
       * The selected option in the select menu
       * represented as data (one of the props.options).
       *
       * @property dropdown.state.selectedOption
       * @type {Object}
       */
      selectedOption: Dropdown.getFirstValidOption(value, options),
      /**
       * The current value of the dropdown.
       *
       * @property dropdown.state.value
       * @type {String}
       * @default ''
       */
      value: Dropdown.isValidValue(value, options) ? value : '',
    };
  }

  /**
   * Defines the default properties for the dropdown.
   *
   * @property Dropdown.defaultProps
   * @type {Object}
   * @static
   */
  static defaultProps = Object.assign({
    /**
     * Custom classnames placed on the dropdown's container.
     *
     * @property Dropdown.defaultProps.className
     * @type {String}
     * @default ''
     */
    className: '',
    /**
     * An optional default option. Typically
     * viewed as "Select One".
     *
     * @property Dropdown.defaultProps.defaultOption
     * @type {Object}
     * @default null
     */
    defaultOption: null,
    /**
     * Text to display when the dropdown
     * encounters an error or is in its hasError state.
     *
     * @property Dropdown.defaultProps.errorText
     * @type {String}
     * @default ''
     */
    errorText: '',
    /**
     * Toggles the dropdowns hasError state.
     *
     * @property Dropdown.defaultProps.hasError
     * @type {Boolean}
     * @default null
     */
    hasError: null,
    /**
     * Toggles the dropdowns hasWarning state.
     *
     * @property Dropdown.defaultProps.hasWarning
     * @type {Boolean}
     * @default null
     */
    hasWarning: null,
    /**
     * Help text that displays under the dropdown.
     *
     * @property Dropdown.defaultProps.helpText
     * @type {String}
     * @default ''
     */
    helpText: '',
    /**
     * The dropdown's label.
     *
     * @property Dropdown.defaultProps.label
     * @type {String}
     * @default ''
     */
    label: '',
    /**
     * The dropdown's name attribute value.
     *
     * @property Dropdown.defaultProps.name
     * @type {String}
     * @default ''
     */
    name: '',
    /**
     * onChange callback. Triggers
     * when the value of the dropdown changes
     *
     * @method Dropdown.defaultProps.onChange
     * @param {Event} event - change event
     */
    onChange(event) {},
    onBlur(event) {},
    /**
     * List of options to render within the select menu.
     *
     * @example
     * [
   *     { text: 'One', value: 'one' },
     *   { text: 'Two', value: 'two' }
     * ]
     *
     * @property Dropdown.defaultProps.options
     * @type {Object[]}
     * @default []
     */
    options: [],
    /**
     * Determines if the dropdown is a required field
     *
     * @property Dropdown.defaultProps.required
     * @type {Boolean}
     * @default false
     */
    required: false,
    /**
     * The dropdown's value. The internal state value
     * will update as this changes.
     *
     * @property Dropdown.defaultProps.value
     * @type {String}
     * @default null
     */
    value: null,
  }, FormControl.defaultProps)

  /**
   * Defines the property types for the dropdown.
   *
   * @property Dropdown.propTypes
   * @type {Object}
   * @static
   */
  static propTypes = Object.assign({
    className: PropTypes.string,
    defaultOption: PropTypes.object,
    errorText: PropTypes.string,
    hasError: PropTypes.bool,
    hasWarning: PropTypes.bool,
    helpText: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    options: PropTypes.array,
    required: PropTypes.bool,
    value: PropTypes.string,
  }, FormControl.propTypes)

  /**
   * Update state if props that we care
   * about have changed.
   *
   * @method dropdown.componentWillReceiveProps
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    const {
      defaultOption,
      hasError,
      hasWarning,
      options,
    } = nextProps;

    const value = nextProps.value;
    const allOptions = [defaultOption].concat(options);

    this.setState({
      hasError: hasError === null ? this.state.hasError : hasError,
      hasWarning: hasWarning === null ? this.state.hasWarning : hasWarning,
      selectedOption: Dropdown.getFirstValidOption(value, allOptions),
      value: Dropdown.isValidValue(value, options) ? value : '',
    });
  }

  /**
   * Validate the dropdown and return
   * a validator object, which is a
   * snapshot of the dropdown's state.
   *
   * @method dropdown.validate
   * @returns {Object}
   */
  validate = () => {
    const id = this.id;
    const value = this.state.value;
    const { name, required, } = this.props;
    const valid = required ? FormManager.validate(value, this.validators) : true;
    const hasError = !valid;
    const validatorObj = this.props.onValidate({
      hasError,
      value,
    });

    this.setState({
      hasError,
    });

    return {
      ...validatorObj,
      id,
      name,
      required,
      valid,
      value,
      type: 'select',
    };
  }

  /**
   * Handle the change event:
   * Update the states value, selected option,
   * and trigger onChange callback.
   *
   * @method dropdown._onChange
   * @param  {Event} event - change event
   * @private
   */
  _onChange = event => {
    const selectElement = event.target;
    const value = selectElement.value;
    const options = [this.props.defaultOption].concat(this.props.options);

    this.setState({
      value,
      selectedOption: Dropdown.getFirstValidOption(value, options),
    });

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

  _renderOptions = () => {
    const { options } = this.props;
    let optgroups = {};

    let groupedOptions = filter(options, 'group');
    let ungroupedOptions = filter(options, opt => !opt.group).map((option, i) => Dropdown.createOption(option, `option-${i}`));

    if (groupedOptions.length) {
      map(sortedUniqBy(groupedOptions, 'group'), 'group').forEach(group => optgroups[group] = []);
      groupedOptions.forEach(opt => optgroups[opt.group].push(opt));
    }

    return map(optgroups, (optgroup, key) => {
      return <optgroup key={ `optgroup-${key}` } label={ key }>
               { map(optgroup, (group, i) => Dropdown.createOption(omit(group, ['group']), `option-${i}`)) }
             </optgroup>;
    }).concat(ungroupedOptions);
  }

  /**
   * Renders the select menu.
   *
   * @method dropdown.render
   */
  render() {
    const {
      className,
      defaultOption,
      defaultValue,
      errorText,
      hasError,
      hasWarning,
      warningText,
      successText,
      helpText,
      hidden,
      label,
      name,
      onValidate,
      options,
      required,
      validators,
      _form,
      _formValidateOnBlur,
      ...other,
  } = this.props;

    const { id, _onChange, _renderOptions } = this;
    const { selectedOption, value, } = this.state;
    const _hasError = this.state.hasError;
    const _hasWarning = this.state.hasWarning;
    const isFilled = selectedOption && (selectedOption.text || selectedOption.value);

    const _onBlur = this._onBlur;

    return (
      <div hidden={ hidden }>
        <div className={ classnames(
          'c-dropdown',
          { 'c-dropdown--labelless': !label, },
          { [className]: className, },
          { [ACTIVE_CLASS]: value, },
          { [ERROR_CLASS]: _hasError, },
          { [WARNING_CLASS]: _hasWarning, },
        ) }>
            <select
              { ...other }
              ref={(ref) => this.select = ref }
              id={ id }
              name={ name }
              className="c-dropdown__menu"
              value={ value }
              onChange={ _onChange }
              onBlur={ _onBlur }
              required={ required }
              aria-describedby={`${id}_error ${id}_hint`}>
              { defaultOption ? Dropdown.createDefaultOption(defaultOption) : '' }
              { _renderOptions() }
            </select>
            <span className="c-dropdown__label" htmlFor={ id }>
              {
                <Label
                  htmlFor={ id }
                  text={ label }
                  required={ required }
                  className="c-label--agreeable" />
              }
            </span>
            <span className="c-dropdown__underline" />
            <div className="c-dropdown__icon" />
        </div>
        {
          (_hasError)
          ? <Hint id={`${id}_error`} text={ errorText } icon="error-solid" type="error" />
          : ''
        }
        { _hasError || !_hasWarning ? <Hint id={`${id}_hint`} text={ helpText } /> : '' }
        { (successText ? <Hint icon="check-circle" type="success" id={`${id}_success`} text={ successText } /> : '') }
        { (_hasWarning ? <Hint type="warning" id={`${id}_warning`} text={ warningText } /> : '') }
      </div>
    );
  }

  /**
   * Determines if value is valid
   * based on the provided options.
   *
   * @method Dropdown.isValidValue
   * @param {String} [value='']
   * @param {Object[]} [options=[]]
   * @returns {Boolean}
   */
  static isValidValue(value = '', options = []) {
    const option = Dropdown.getOptionByValue(value, options);

    return typeof option === 'object';
  }

  /**
   * Returns option based on a predicate (filter).
   *
   * @method Dropdown.getOption
   * @param {Object[]} [options=[]]
   * @param {Function} [filter=() => {}] - filter function
   * @returns {Object} an option
   */
  static getOption(options = [], filter = () => {}) {
    return options.filter(filter)[0];
  }

  /**
   * Returns option that uses the provided value.
   *
   * @method Dropdown.getOptionByValue
   * @param {String} [value='']
   * @param {Object[]} [options=[]]
   * @returns {Object} an option
   */
  static getOptionByValue(value = '', options = []) {
    return Dropdown.getOption(options, option => {
      return option && option.value === value;
    });
  }

  /**
   * Returns first valid option.
   * A "valid option" must match the
   * provided value or, if none of the options match,
   * be an object.
   *
   * @method Dropdown.getFirstValidOption
   * @param {String} [value='']
   * @param {Array} [options=[]]
   * @returns {Object} an option
   */
  static getFirstValidOption(value = '', options = []) {
    let validOption = Dropdown.getOptionByValue(value, options);

    if (validOption) {
      return validOption;
    }

    return Dropdown.getOption(options, option => {
      return typeof option === 'object' && option !== null;
    });
  }

  /**
   * Returns an HTML option element
   * filled in with the provided properties.
   *
   * @method Dropdown.createDefaultOption
   * @param {Object} option
   * @param {String} [option.text='']
   * @param {String} [option.value='']
   * @returns {HTMLOptionElement} an HTML option element
   */
  static createDefaultOption({ value = '', text = '', ...other }) {
    return (
      <option { ...other } value={ value }>{ text }</option>
    );
  }

  /**
   * Returns an HTML option element
   * filled in with the provided properties.
   * Since this is used in a loop, this method
   * also applies a key to the returned option.
   *
   * @method Dropdown.createDefaultOption
   * @param {Object} option
   * @param {String} [option.text='']
   * @param {String} [option.value='']
   * @param {String} key
   * @returns {HTMLOptionElement} an HTML option element
   */
  static createOption({ value = '', text = '', ...other }, key) {
    return (
      <option { ...other } key={ key } value={ value }>{ text }</option>
    )
  }
}
