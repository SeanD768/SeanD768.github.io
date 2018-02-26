import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './selectable-panel.css';

export default class SelectablePanel extends Component {
  constructor(props) {
    super(props);

    this.id = props.id;
  }

  static propTypes = {
    text: PropTypes.string,
    price: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    checked: PropTypes.bool,
  };

  static defaultProps = {
    text: '',
    price: '',
    type: 'checkbox',
    className: '',
    name: '',
    value: '',
    checked: false,
  };

  render() {
    const {
      children,
      className,
      defaultChecked,
      text,
      price,
      type,
      name,
      value,
      checked,
      ...other,
    } = this.props;

    const id = this.id;
    const _onChange = this._onChange;

    return (
        <label
          htmlFor={ id }
          className={`c-selectable-panel ${this.props.disabled ? `is-disabled` : ''} ${className}`}>
          <input
            { ...other }
            type={ type }
            ref={ input => { this.input = input; } }
            id={ id }
            name={ name }
            className="c-selectable-panel__input"
            value={ value }
            defaultChecked={ defaultChecked || checked } />
          <span className="c-selectable-panel__hd">{ children }</span>
          <span className="c-selectable-panel__bd">{ text }</span>
          <span className="c-selectable-panel__bd">{ price }</span>
        </label>
      );
  }
}
