import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import createFocusTrap from 'focus-trap';
import { ButtonTrigger } from './triggers';
import Icon from '../icon/';
import CONSTANTS from './../../appConstants';
import './modal-dialog.css';

const ACTIVE_CLASS = CONSTANTS.HTML_CLASS.ACTIVE;
const ESCAPE_KEY = CONSTANTS.KEY_CODES.ESCAPE;

/**
 * A higher-order component used to create modal menus.
 *
 * @function createModal
 * @param {React.Component} Trigger - inserted into the trigger slot
 * @returns {React.Component} Modal
 */
export default class ModalDialog extends React.Component {
  constructor(props) {
    super(props);
    /**
     * A utility for triggering callbacks that occur
     * when an element has lost or gained focus. The modal
     * will use this to close itself when it's lost focus.
     *
     * @property modal.focusObserver
     * @type {Object}
     */
    this.focusTrap = null;

    /**
     * The modal's internal state.
     *
     * @property modal.state
     * @type {Object}
     */
    this.state = {
      /**
       * Determines whether the modal is open/closed.
       *
       * @property modal.state.isActive
       * @type {Boolean}
       * @default false
       */
      isActive: props.isActive,
    };
  }

  /**
   * @property modal.defaultProps
   * @type {Object}
   * @static
   */
  static defaultProps = {
    /**
     * onOpen callback.
     *
     * @method modal.defaultProps.onOpen
     */
    onOpen() {},
    /**
     * onClose callback.
     *
     * @method modal.defaultProps.onClose
     */
    onClose() {},
    /**
     * showCloseBtn property.
     *
     * @method modal.defaultProps.showCloseBtn
     */
     showCloseBtn: true,
     promptType: 'normal',
     condensed: false,
  }

  /**
   * @property modal.propTypes
   * @type {Object}
   * @static
   */
  static propTypes = {
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  }

  /**
   * @method modal.componentDidMount
   */
  componentDidMount() {
    if(this.props.isInline) {
        return;
      }

    this.focusTrap = createFocusTrap(this.modal, {
      escapeDeactivates: false,
      fallbackFocus: this.modal
    });
    /**
     * Determines whether the enter key triggers closed.
     *
     * @property modal.state.isActive
     * @type {Boolean}
     * @default false
     */
  }

  componentWillReceiveProps(nextProps) {
    const {
      isActive,
    } = nextProps;

    if(isActive != this.state.isActive) {
      if(isActive) {
        this.open();
      }
      else if(isActive === false){
        this.close();
      }
    }
  }

  /**
   * @method modal.componentWillUnmount
   */
  componentWillUnmount() {
    if(this.props.isInline) {
        return;
    }

    this.focusTrap.deactivate();
  }

  /**
   * Opens the modal.
   *
   * @method modal.open
   */
  open() {
    this.setState({
      isActive: true,
    }, () => {
      this.props.onOpen(this.state.isActive);

      if(!this.props.isInline) {
        this.focusTrap.activate();
      }
    });
  }

  /**
   * Closes the modal.
   *
   * @method modal.close
   */
  close() {
    this.setState({
      isActive: false,
    }, () => {
      this.props.onClose(this.state.isActive);

      if(!this.props.isInline) {
        this.focusTrap.deactivate();
      }
    });
  }

  /**
   * Toggles the modal based on
   * the value of state.isActive
   *
   * @method modal.toggle
   */
  toggle() {
    if (this.state.isActive) {
      this.close();

      return;
    }

    this.open();
  }

  /**
   * Closes the modal when the overlay
   * is clicked.
   *
   * @method modal.onClickOverlay
   * @param {Event} event - click event
   */
  onClickOverlay = (event) => {
    this.close();
  }

  /**
   * Toggles the modal as the trigger is clicked.
   *
   * @method modal.onClickTrigger
   * @param {Event} event - click event
   */
  onClickTrigger = (event) => {
    event.preventDefault();
    this.toggle();
  }

  /**
   * @method modal._onCancel
   * @param {Event} event - keydown event
   * @protected
   */
  _onKeydown = event => {
    const key = event.key;

    if (key === "Escape" || key === ESCAPE_KEY) {
      this.close();
    }
  }

  /**
   * @method modal.render
   */
  render() {
    const {
      id,
      footer,
      buttonText,
      title,
      children,
      className,
      isSlideDrawer,
      isInline,
      trigger,
      text,
      staticModal,
      showCloseBtn,
      hideTrigger,
      onOpen,
      isPrompt,
      promptType,
      onClose,
      isActive,
      noOverlay,
      condensed,
      ...other,
    } = this.props;

    const isStateActive = this.state.isActive;

    const {
      onClickOverlay,
      onClickTrigger,
      _onKeydown,
    } = this;

    const inlineStyle = isInline && isSlideDrawer && noOverlay;

    const hasFooter = footer ? true : false;

    const ariaLabel = `${id}-label`;

    const closeBtn = <button onClick={ onClickTrigger }
                        className={`c-btn c-btn--icon u-float--right`}
                        aria-label="Close Modal">
                        <Icon icon="cross" color="action" size={ 1 } />
                      </button>
    ;

    const Trigger = (trigger ? trigger : ButtonTrigger);

    const renderTrigger = <Trigger
      ref={ ref => { this.trigger = ref; } }
      buttonText={ buttonText }
      onClick={ onClickTrigger }
      text={ text } />;

    return (
    <div>
      { (hideTrigger ? '' : renderTrigger) }

      <div
        { ...other }
        className={ classnames(
            'c-modal-dialog',
            { [className]: className, },
            { [ACTIVE_CLASS]: isStateActive, },
          ) }
        tabIndex={-1}
        ref={ ref => { this.modal = ref; } }
        onKeyDown={ (staticModal ? null : _onKeydown) }
        >

        { createOverlay(
          noOverlay,
          isSlideDrawer,
          isStateActive,
          staticModal,
          isPrompt,
          onClickOverlay,
        ) }

          <div className={ classnames(
              'c-modal-dialog__dialog',
              {'is-slide-drawer': isSlideDrawer},
              {'c-modal-dialog__dialog--inline': inlineStyle},
              {'c-modal-dialog__dialog--condensed': condensed},
              {'c-modal-dialog__dialog--no-footer': !hasFooter},
              {[`c-modal-dialog__dialog--is-prompt c-modal-dialog__dialog--${promptType}`]: isPrompt},
              ) }
              role="dialog"
              aria-labelledby={ ariaLabel }>
            <div id={`${id}-content`}
              className={`c-modal-dialog__content`}
              role="document"
              >
              {
                (!isPrompt ?
                  <div className="c-modal-dialog__header">
                    { showCloseBtn ? closeBtn : null }
                    <h3 className="c-modal__title">{ title }</h3>
                  </div>
                : '')
              }
              <div className="c-modal-dialog__body">
                { children }
              </div>

              {
                (footer ?
                  <div className="c-modal-dialog__footer">
                    { footer }
                  </div>
                : '')
              }
            </div>
          </div>
      </div>
    </div>
    );
  }
}

function createOverlay(
  noOverlay,
  isSlideDrawer,
  isStateActive,
  staticModal,
  isPrompt,
  onClickOverlay,
  ) {
  if (noOverlay && isSlideDrawer) {
    return;
  }

  return(
    <div
      className={
      `c-overlay c-overlay--modal${
        isStateActive ? ' is-visible ' : ''
        }`}
         onClick={ (staticModal || isPrompt) ? null : onClickOverlay }
         >
    </div>
  )
}
