import React from 'react';
import FormField from '../form-field';
import Autocomplete from '../autocomplete';
import ButtonGroup from '../button-group';
import CurrencyFormField from '../currency-form-field';
import DateField from './../date-field';
import Dropdown from '../dropdown';
import FormOption from '../form-option';
import FormUpload from '../form-upload';
import MaskedFormField from './../masked-form-field';
import DatePicker from './../date-picker';
import FormManager from './FormManager';
import generateID from './../../utilities/generateID';

/**
 * A container component for form controls. The Form Component
 * will implicitly validate all the form controls it cares about
 * when it's submitted.
 *
 * @class Form
 * @param {Object} props
 * @extends React.PureComponent
 * @constructor
 */
export default class Form extends React.PureComponent {
  constructor(props) {
    super(props);

    /**
     * A unique id.
     *
     * @property form.id
     * @type {String}
     */
    this.id = this.props.id || generateID('form_');

    /**
     * Removes the form from the FormManager.
     *
     * @property form.removeForm
     * @type {Function}
     * @default null
     */
    this.removeForm = null;
  }

  /**
   * @property Form.fields.defaultProps
   * @type {Object}
   * @static
   */
  static defaultProps = {
    /**
     * onSubmit callback.
     *
     * @method Form.fields.onSubmit
     * @param {Event} event - submit event
     * @param {Object} details
     * @param {Boolean} details.valid - is the form valid?
     * @param {Object} details.fields - contains all the fiels within the form.
     */
    onSubmit(event, details) {},
    /**
     * onSubmit callback.
     *
     * @method Form.fields.onSubmit
     * @param {Event} event - submit event
     * @param {Object} details
     * @param {Boolean} details.valid - is the form valid?
     * @param {Object} details.fields - contains all the fiels within the form.
     */
    validateOnBlur: false,
    submitted: false,
  }

  /**
   * Add the form to the FormManager.
   *
   * @method form.componentWillMount
   */
  componentWillMount() {
    this.removeForm = FormManager.addForm({
      id: this.id,
    });
  }

  /**
   * Remove the form from the FormManager.
   *
   * @method form.componentWillMount
   */
  componentWillUnmount() {
    this.removeForm();
  }

  /**
   * Validate containing form controls.
   * Pass the details along to the onSubmit callback.
   *
   * @method form._onSubmit
   * @param {Event} event - submit event
   * @protected
   */
  _onSubmit = event => {
    event.preventDefault();

    const details = FormManager.validateFormById(this.id);

    this.props.onSubmit(event, details);
  }

  /**
   * Return a set of cloned children. If a child that we care
   * about is found, add a _form property to it. This allows form
   * controls to sync up with the form via the FormManager.
   *
   * @method form._cloneChildren
   * @param {Object[]} children - a collection of react elements and/or components.
   * @protected
   */
  _cloneChildren = children => {

    const {
      validateOnBlur,
    } = this.props;

    return React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return child;
      }

      const childProps = {};
      childProps.children = this._cloneChildren(child.props.children);

      if (this._isOfTypeFormField(child.type)) {
        childProps._form = this.id;

        if (validateOnBlur) {
          childProps._formValidateOnBlur = true;
        }
      }

      return React.cloneElement(child, childProps);
    });
  }

  /**
   * Determine if the provided type is one we care about.
   *
   * @method form._isOfTypeFormField
   * @param {String|Function} type - an element tagname or a react component constructor.
   * @protected
   * @returns {Boolean}
   */
  _isOfTypeFormField(type) {
    return Form.fields.filter(field => type === field).length > 0;
  }

  /**
   * Determine if the provided type is one we care about.
   *
   * @method form.render
   * @returns {HTMLFormElement}
   */
  render() {
    // abstract children so that we don't try to spread it (below)
    const { children, validateOnBlur, submitted, ...other, } = this.props;
    const { _onSubmit, _cloneChildren, } = this;

    return (
      <form
        { ...other }
        action="#"
        onSubmit={ _onSubmit }
        noValidate>{ _cloneChildren(children) }</form>
    );
  }

  /**
   * Add a field to the list of fields that we care about.
   *
   * @method Form.addField
   * @param {React.Component[]} field - a react component constructor
   */
  static addField(field) {
    Form.fields.push(field);
  }

  /**
   * The list of fields we care about. Each field is expected to be
   * a react component constructor. These fields will receive a protected
   * "_form" prop which they may use to sync up with the form via the FormManager.
   *
   * @property Form.fields
   * @type {React.Component[]}
   * @static
   */
  static fields = [
    FormField,
    MaskedFormField,
    DatePicker,
    FormOption,
    Dropdown,
    Autocomplete,
    DateField,
    CurrencyFormField,
    FormUpload,
    ButtonGroup
  ]
}
