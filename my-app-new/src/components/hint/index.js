import React from 'react';
import Icon from '../icon';
import PropTypes from 'prop-types';
import CONSTANTS from './../../appConstants';

const ERROR_CLASS = CONSTANTS.HTML_CLASS.ERROR;
const WARNING_CLASS = CONSTANTS.HTML_CLASS.WARNING;

const HintRequiredProps = {
  icon: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
};

function Hint({
  icon = '',
  text = '',
  type = '',
  className = '',
  ...other,
}) {
  const hasError = type === 'error';
  const hasSuccess = type === 'success';
  const hasWarning = type === 'warning';

  if (text === '') {
    return null;
  }

  return(
    <div className={`c-hint ${hasError ? ERROR_CLASS : ''} ${hasSuccess ? 'c-hint--success' : ''} ${hasWarning ? WARNING_CLASS : ''} ${className}`} { ...other }>
      { icon ? <Icon className="c-hint__icon" size={.75} icon={ icon } /> : '' }
      <p>{ text }</p>
    </div>
  );
}

Hint.propTypes = HintRequiredProps;

export default Hint

