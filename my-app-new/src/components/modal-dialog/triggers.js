import React from 'react';
import Icon from '../icon';

/**
 * The trigger for the ModalDialog.
 *
 * @function ButtonTrigger
 * @param {Object} props
 * @param {Function} props.onClick
 * @param {String} [props.text="Open Modal"]
 */
export function ButtonTrigger({ onClick, buttonText }) {
  return (
    <button className="c-btn c-btn--secondary" onClick={ onClick }>
      <span>{ (buttonText ? buttonText : "Open Modal") }</span>
    </button>
  );
}
