import React from 'react';

/**
 * React Label (form field) component.
 *
 * @function Label
 * @param {Object} props
 * @param {String} props.text
 * @param {String} [props.id='']
 * @param {Boolean} [props.required=false]
 * @param {String} [props.className='']
 * @returns {?HTMLLabelElement}
 */
export default function Label({
  className = '',
  htmlFor = '',
  required = false,
  text = '',
}) {
  if (text === '') {
    return null;
  }

  return (
    <label htmlFor={ htmlFor } className={`c-label ${className}`}>
      { createAsterisk(required) }
      { text }
    </label>
  );
}

/**
 * Helper function to create the label's asterisk.
 * If the label doesn't belong to a required field,
 * don't render the asterisk.
 *
 * @function createAsterisk
 * @param {Boolean} [required=false]
 * @returns {HTMLElement}
 * @private
 */
function createAsterisk(required = false) {
  if (!required) {
    return;
  }

  return (
    <span className="c-label__asterisk" aria-label="required">
      <span aria-hidden="true">&#42;</span>
    </span>
  );
}
