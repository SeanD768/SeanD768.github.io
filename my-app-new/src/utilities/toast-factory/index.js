import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../../components/icon/';
import CONSTANTS from './../../appConstants';
const ACTIVE_CLASS = `${CONSTANTS.HTML_CLASS.ACTIVE} c-toaster__toast--animateIn`;

/**
 * A higher-order component used to create Toast menus.
 *
 * @function createToast
 * @returns {React.Component} Toast
 */
export default function createToast() {
  return class Toast extends React.Component {
    constructor(props) {
      super(props);

      /**
       * The Toast's internal state.
       *
       * @property Toast.state
       * @type {Object}
       */
      this.state = {
        /**
         * Determines whether the Toast is open/closed.
         *
         * @property Toast.state.isActive
         * @type {Boolean}
         * @default false
         */
        isActive: props.isActive,
      };

      this.autoRemoveTimeout = null;
    }

    /**
     * @property Toast.defaultProps
     * @type {Object}
     * @static
     */
    static defaultProps = {
      /**
       * onOpen callback.
       *
       * @method Toast.defaultProps.onOpen
       */
      onOpen() {},
      /**
       * onClose callback.
       *
       * @method Toast.defaultProps.onClose
       */
      onClose() {},

      isActive: true,
      autoRemove: true,
      timeOut: 5000,
      promptType: 'c-toaster__toast--info',
      iconPosition: 'left'
    }

    /**
     * @property Toast.propTypes
     * @type {Object}
     * @static
     */
    static propTypes = {
      onOpen: PropTypes.func,
      onClose: PropTypes.func,
      icon: PropTypes.string,
      iconPosition: PropTypes.string,
    }

    componentDidMount() {
      const {
        timeOut,
        autoRemove,
      } = this.props;

      this.props.onOpen();

      if(autoRemove) {
        this.autoRemoveTimeout = setTimeout(() => {
          this.close();
        }, timeOut)
      }
    }

    /**
     * Closes the Toast.
     *
     * @method Toast.close
     */
    close() {
      if(this.toast !== null) {
        this.setState({
          isActive: false,
        });
      }

      setTimeout(() => {
        this.props.onClose(this.toast);

        clearTimeout(this.autoRemoveTimeout);
        
        if(this.toast !== null) {
          this.toast.parentNode.removeChild(this.toast);
        }
      }, 750)
    }

    /**
     * Toggles the Toast as the trigger is clicked.
     *
     * @method Toast.onClickTrigger
     * @param {Event} event - click event
     */
    onClickTrigger = event => {
      event.preventDefault();
      this.close();
    }

    /**
     * @method Toast.render
     */
    render() {
      const {
        children,
        autoRemove,
        timeOut,
        className,
        promptType,
        icon,
        iconPosition,
      } = this.props;

      const isActive = this.state.isActive;
      const isPrompt = promptType !== 'normal';

      const {
        onClickTrigger,
      } = this;

      const renderIcon = icon ? icon : false;

      return (
        <div
          ref={ ref => { this.toast = ref; } }
          className={ classnames(
            'c-toaster__toast animated',
            {[`${promptType}`]: isPrompt},
            {[`c-toaster__toast--no-icon`]: !icon},
            { [className]: className, },
            { [ACTIVE_CLASS]: isActive, },
            `c-toaster__toast--${iconPosition}`,
            { 'c-toaster__toast--animateOut': !isActive, },
          ) }>
          <div className="c-toaster__toast__hd">
            <button
              aria-label="Close Toast"
              className="c-btn c-btn--icon c-btn--phony c-toaster__toast__trigger"
              ref={ ref => { this.trigger = ref; } }
              onClick={ onClickTrigger }>
              <Icon icon="cross" color="white" size={ 1 } />
            </button>

            { renderIcon ?
              <Icon icon={renderIcon} color="white" size={ iconPosition == 'left' ? 1.5 : 3 } /> :
              null
            }
          </div>
          <div className="c-toaster__toast__bd">
            { children }
          </div>
        </div>
      );
    }
  }
}
