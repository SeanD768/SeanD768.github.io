//`use strict`;

// `use strict` causing an issue where having this declared above the imports:
// "Import in body of module; reorder to top"

import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../form-field/';
import Icon from '../icon/';
import escapeStringRegexp from 'escape-string-regexp';
import generateID from './../../utilities/generateID';
import createFocusObserver from './../../utilities/focus-observer-factory/';
import RovingIndex from './../../utilities/roving-index/';
import isEqual from 'lodash.isequal';
import debounce from 'lodash.debounce';
import './autocomplete.css';

/**
 * An autocomplete suggestion field that allows
 * for variable suggestion list item templates and
 * custom filtering options
 *
 * @class Autocomplete
 * @extends React.PureComponent
 * @constructor
 * @param {Object} props - React properties
 */
export default class Autocomplete extends React.Component {
  constructor(props) {
    super(props);

    /**
     * An object that helps us keep track of the index
     * of the active suggestion (the one that's highlighted).
     * We use this to repsond to keyboard arrow events.
     *
     * @property autocomplete.rovingIndex
     * @type {RovingIndex}
     */
    this.rovingIndex = new RovingIndex();

    /**
     * The ID of the autocomplete
     *
     * @property autocomplete.suggestionListID
     * @type {String}
     */
    this.id = props.id || generateID('autocomplete_');

    /**
     * The ID of the hidden key control help text
     *
     * @property autocomplete.helpTextID
     * @type {String}
     */
    this.helpTextID = generateID('autocomplete_hint_');

    /**
     * The formField element contained
     * within masked form field.
     *
     * @property autocomplete.formField
     * @type {HTMLInputElement}
     * @default null
     */
    this.formField = null;

    this.listItems = new Map();

    /**
     * The autocomplete's internal state
     *
     * @property autocomplete.state
     * @type {Object}
     */
    this.state = {
      /**
       * The ID of the active (highlighted)
       * suggestion within the suggestion list.
       *
       * @property autocomplete.state.activeDescendant
       * @type {String}
       * @default ''
       */
      activeDescendant: '',
      /**
       * The value of the autocomplete
       *
       * @property autocomplete.state.value
       * @type {String}
       * @default ''
       */
      value: props.defaultValue || props.value || '',
      /**
       * Used to help determine if the autocomplete
       * suggestion list should be open or closed
       *
       * @property autocomplete.state.isActive
       * @type {Boolean}
       * @default false
       */
      isActive: false,
      /**
       * A list of filtered suggestions to
       * display in the suggestion box
       *
       * @property autocomplete.state.suggestions
       * @type {Object[]}
       * @default []
       */
      suggestions: [],
      clearBtn: false,
    };

    this.validators = [() => {
      const {
        suggestions,
      } = this.props;

      const validSuggestion = suggestions.filter( (suggestion) => { return suggestion.value == this.state.value })

      let isValid = true;

      // If given value is lower than minimum, it's not valid
      if (validSuggestion.length == 0) {
        isValid = false;
      }

      this.setState({
        hasError: !isValid,
      })

      return isValid;
    }, ...props.validators];
  }

  /**
   * @property Autocomplete.defaultProps
   * @type {Object}
   * @static
   */
  static defaultProps = {
    /**
     * Returns a boolean to determine if
     * the provided suggestion should show or not
     *
     * @method Autocomplete.defaultProps.filterSuggestion
     * @param {Object} [suggestion={}]
     * @param {String} [value='']
     * @returns {Boolean}
     */
    filterSuggestion(suggestion = {}, value = '') {
      const text = (suggestion.text || '');
      const pattern = new RegExp(`${value}`, 'i');
      const matches = text.match(pattern);

      return matches && matches.length > 0;
    },
    /**
     * A list of suggestions
     *
     * @property Autocomplete.defaultProps.suggestions
     * @type {Object[]}
     */
    suggestions: [],
    /**
     * Returns a suggestion HTML element based
     * on the provided suggestion.
     *
     * @method Autocomplete.defaultProps.createSuggestion
     * @param {Object} [suggestion={}]
     * @param {String} value - the current value of the autocomplete
     * @returns {HTMLDivElement}
     */
    createSuggestion(suggestion = {}, value) {
      return (
        <span>{ Autocomplete.strongify(suggestion.text, value) }</span>
      );
    },
    /**
     * Triggered when a suggestion within the suggestion box is clicked.
     *
     * @method Autocomplete.defaultProps.onClickSuggestion
     * @param {Object} details
     * @param {String} details.value
     */
    onClickSuggestion(details) {},
    /**
     * Triggered when a suggestion has been activated,
     * via arrow down/up or click.
     *
     * @method Autocomplete.defaultProps.onSuggestionMade
     * @param {Object} details
     * @param {String} details.value
     */
    onSuggestionMade(details) {},
    /**
     * A callback function called everytime the
     * autocomplete's value changes
     *
     * @method Autocomplete.defaultProps.onValueChanged
     * @param {Object} details
     * @param {String} details.value
     */
    onValueChanged(details) {},
    /**
     * Custom classname modifiers
     *
     * @property Autocomplete.defaultProps.className
     * @type {String}
     */
    className: '',
    /**
     * The Autocomplete's label.
     *
     * @property Autocomplete.defaultProps.label
     * @type {String}
     * @default ''
     */
    label: '',
    /**
     * The value of the autocomplete.
     *
     * @property Autocomplete.defaultProps.value
     * @type {String}
     * @default null
     */
    value: null,
    validators: [],

  }

  /**
   * Defines the expected proptypes.
   *
   * @property Autocomplete.propTypes
   * @type {Object}
   * @static
   */
  static propTypes = {
    filterSuggestion: PropTypes.func,
    suggestions: PropTypes.array,
    createSuggestion: PropTypes.func,
    onClickSuggestion: PropTypes.func,
    onSuggestionMade: PropTypes.func,
    onValueChanged: PropTypes.func,
    className: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    validators: PropTypes.arrayOf(PropTypes.func),
  }

  /**
   * Bind event listeners
   *
   * @method autocomplete.componentDidMount
   */
  componentDidMount() {
    this.focusObserver = createFocusObserver(this.autocomplete, this._onFocusout);
  }

  /**
   * Unbind event listeners
   *
   * @method autocomplete.componentWillUnmount
   */
  componentWillUnmount() {
    this.focusObserver.deactivate();
  }

  /**
   * React lifecycle method.
   * Ensures the autocomplete's value is
   * kept in sync when it changes externally
   *
   * @method autocomplete.componentWillReceiveProps
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    const {
      filterSuggestion,
      suggestions,
    } = nextProps;

    let filteredSuggestions;
    const value = nextProps.value === null ? this.state.value : nextProps.value;
    const suggestionsHaveChanged = !isEqual(this.props.suggestions, suggestions);

    if (suggestionsHaveChanged) {
      filteredSuggestions = Autocomplete.filterSuggestions(suggestions, value, filterSuggestion);
      this.rovingIndex.setTotal(filteredSuggestions.length);
    }

    // if the suggestions have changed, update our filtered suggestions (state.suggestions)
    this.setState(Object.assign({
      value,
    }, suggestionsHaveChanged ? {
      suggestions: filteredSuggestions,
    } : null));
  }

  /**
   * Determines whether of not the suggestion box should
   * be open. This is determined by checking if state.isActive
   * is false, then, if it isn't false, checking if we have
   * suggestions (no need to show the box if we don't have suggestions)
   *
   * @method autocomplete.isActive
   * @returns {Boolean}
   */
  isActive() {
    const {
      isActive,
      suggestions,
    } = this.state;

    return isActive === false ? false : suggestions.length > 0;
  }

  /**
   * Deactivate the autocomplete and reset the index.
   *
   * @method autocomplete._onFocusout
   * @protected
   */
  _onFocusout = () => {
    if (!this.isActive()) {
      return;
    }

    this.setState({
      activeDescendant: '',
      isActive: false,
    });

    this.rovingIndex.resetIndex();
    this.focusObserver.deactivate();
  }

  /**
   * Handle the input event; and send to debounce function
   *
   * @method autocomplete._onInput
   * @param {Event} event
   * @protected
   */
  _onInput = (event) => {
    const value = event.target.value || '';

    if(this.props.hasDebounce) {
      this.debounce(value);

      return;
    }

    this.filterSuggestions(value);
  }

  /**
   * Adds a debounce before filtering suggestions
   *
   * @method autocomplete.debounce
   * @param {Event} event
   * @protected
   */  
  debounce = debounce((value) => {
    this.filterSuggestions(value);
  }, 200);

  /**
   * update the value of the autocomplete with debounce,
   * activate the suggestion box, and filter the suggestions. If
   * the autcomplete holds to characters, trigger the suggest callback.
   *
   * @method autocomplete._onInput
   * @param {Event} event
   * @protected
   */
  filterSuggestions = (value) => {
    const {
      suggestions,
      filterSuggestion,
    } = this.props;

    const filteredSuggestions = Autocomplete.filterSuggestions(suggestions, value, filterSuggestion);

    this.setState({
      value,
      isActive: true,
      suggestions: filteredSuggestions,
    });

    this.rovingIndex.resetIndex();
    this.rovingIndex.setTotal(filteredSuggestions.length);
    this.focusObserver.activate();

    this.props.onValueChanged({
      value,
    });
  }

  /**
   * Handle index change; sets state to make
   * sure the appropriate suggestion is activated.
   *
   * @method autocomplete._onIndexChange
   * @param {Number} oldIndex
   * @param {Number} newIndex
   * @protected
   */
  _onIndexChange = (oldIndex, newIndex) => {
    const suggestion = this.state.suggestions[newIndex] || {};
    const value = suggestion.value || this.state.value;

    this.setState({
      suggestion,
      value,
      activeDescendant: Autocomplete.generateOptionID(this.id, newIndex),
      index: newIndex,
    });

    this.props.onValueChanged({ value, suggestion });
    this.props.onSuggestionMade({ value, suggestion });

    const position = value.length + 1;

    // RAF necessary to wait for the input to update
    window.requestAnimationFrame(() => {
      // Update the cursor position so that it's always at the end
      this.formField.setSelectionRange(position, position);
    });
  }

  /**
   * Handle the keydown event; if the up arrow is pressed,
   * rotate up, if the down arrow is pressed, rotate down, and
   * , if the escape key is pressed, close the suggestion box
   *
   * @method autocomplete._onKeyDown
   * @param {Event} event
   * @protected
   */
  _onKeyDown = event => {
    const key = event.key || event.keyCode;

    const listItems = Array.from(this.listItems.values());

    const {
      activeDescendant,
    } = this.state;

    // Do nothing if the suggestion box is closed
    if (!this.isActive()) {
      return;
    }

    switch (key) {
      case 'ArrowDown':
      case 40:
        //stop scrolling after every arrow key
        event.preventDefault();

        this.rovingIndex.next(this._onIndexChange);

        /**
          Apply focus to the list item button
          this will scroll throught the suggestions
        **/
        listItems[this.rovingIndex.getIndex()].focus();

        break;
      case 'ArrowUp':
      case 38:
        //stop scrolling after every arrow key
        event.preventDefault();
        this.rovingIndex.prev(this._onIndexChange);

        /**
          Apply focus to the list item button
          this will scroll throught the suggestions
        **/
       listItems[this.rovingIndex.getIndex()].focus();

        break;
      case 'Enter':
      case 13:
        const value = this.state.value;
        const suggestion = this.state.suggestion;
        // Prevent forms from submitting
        event.stopPropagation();
        event.preventDefault();

        this.rovingIndex.resetIndex();
        this.focusObserver.deactivate();

        this.setState({
          activeDescendant: '',
          clearBtn: true,
          isActive: false,
        });

        if(this.props.onClickSuggestion){
          this.props.onClickSuggestion({
            value,
            suggestion
          });
        }

        this.formField.focus();

        break;
      case 'Escape':
      case 27:
        // Prevent Firefox from reverting the inputs value
        event.preventDefault();

        this.rovingIndex.resetIndex();
        this.focusObserver.deactivate()

        this.setState({
          activeDescendant: '',
          isActive: false,
        });

        this.formField.focus();

        break;
    }
  }

  /**
   * Handle suggestion click; update the value
   * of the state, close the menu, and reset the index
   *
   * @method autocomplete._onClickSuggestion
   * @param {Object} suggestion
   * @param {String} suggestion.value
   */
  _onClickSuggestion(suggestion) {
    const value = suggestion.value;

    this.setState({
      value,
      clearBtn: true,
      isActive: false,
    });

    this.rovingIndex.resetIndex();
    this.focusObserver.deactivate();
    this.props.onValueChanged({ value, suggestion });
    this.props.onClickSuggestion({ value, suggestion });
  }

  /**
   * Handle clearing of autocomplete value
   *
   * @method autocomplete._clearAutocomplete
   * @protected
   */
  _clearAutocomplete = (event) => {
    this.setState({
      value: '',
      clearBtn: false,
      isActive: false,
    }, this.formField.focus());
  }

  /**
   * Render the autocomplete component
   *
   * @method autocomplete.render
   * @returns {HTMLDivElement}
   */
  render() {
    const {
      className,
      label,
      createSuggestion,
      filterSuggestion,
      hasDebounce,
      onValueChanged,
      onClickSuggestion,
      onSuggestionMade,
      suggestions,
      ...other,
    } = this.props;

    const {
      activeDescendant,
      value,
      clearBtn,
    } = this.state;

    const validators = this.validators;

    const index = this.rovingIndex.getIndex();
    const isActive = this.isActive();
    const _hasError = this.state.hasError;
    const _hasWarning = this.state.hasWarning;
    // If the suggestion list is closed, don't render suggestions
    const _suggestions = isActive ? this.state.suggestions : [];

    const {
      helpTextID,
      id,
      suggestionListID,
      _onClickSuggestion,
      _onInput,
      _onKeyDown,
      _clearAutocomplete,
    } = this;

    return (
      <div
        ref={(ref) => this.autocomplete = ref}
        className={`c-autocomplete ${className}`}
        onKeyDown={ _onKeyDown }>
        <FormField
          { ...other }
          _formValidateOnBlur={false}
          id={ id }
          ref={ (formField) => {
            if (!formField) {
              return;
            }
            this.formField = formField.formField;
          } }
          role="combobox"
          aria-expanded={ isActive ? 'true' : 'false' }
          aria-autocomplete="both"
          aria-describedby={`${helpTextID}`}
          aria-activedescendant={ isActive ? activeDescendant : '' }
          autoComplete="off"
          label={label}
          value={ typeof value === 'object' ? value.text : value }
          validators={ validators }
          hasError={ _hasError }
          onInput={ _onInput }
         />
         <button
          type="button"
          onClick={ _clearAutocomplete }
          className={`c-btn c-btn--icon c-autocomplete__clear ${clearBtn ? 'is-active' : ''} ${!label ? 'c-autocomplete__clear--no-label' : ''}`}>
            <Icon size={.7} icon="cross" />
         </button>
        <ul
          role="listbox"
          tabIndex="-1"
          className={ `c-autocomplete__list ${isActive ? 'is-active' : ''}` }>
          { _suggestions.map(((suggestion, i) => {
            const optionID =  Autocomplete.generateOptionID(id, i);

            return (
              <li key={ `suggestion_${i}` }>
                <button
                  tabIndex={-1}
                  ref={c => this.listItems.set(i, c)}
                  id={ optionID }
                  role="option"
                  className={ `c-autocomplete__list__item ${index === i ? 'is-selected' : ''}` }
                  onClick={ _onClickSuggestion.bind(this, suggestion, optionID) }>
                  { createSuggestion(suggestion, value) }
                </button>
              </li>
            );
          })) }
        </ul>
        <div id={`${helpTextID}`} className="u-sr-only">When autocomplete results are available use up and down arrows to review and enter to select. Press escape to close the suggestion box.</div>
      </div>
    );
  }

  /**
   * Return a unique option ID based
   * on the provided autocompleteID and index.
   *
   * @method Autocomplete.generateOptionID
   * @param {String} autocompleteID
   * @param {Number} index
   * @returns {String}
   * @static
   */
  static generateOptionID(autocompleteID, index) {
    return `${autocompleteID}_option_${index}`;
  }

  /**
   * Given a piece of text and search text,
   * strongify will return a React span element
   * with a <strong></strong> tag around the matched search text.
   *
   * @method Autocomplete.strongify
   * @param {String} text
   * @param {String} searchText
   * @returns {HTMLSpanElement}
   * @static
   * @example
   *   Autocomplete.strongify('Awesome', 'some'); // <span>Awe<strong>some</strong></span>
   */
  static strongify(text = '', searchText = '') {
    const pattern = new RegExp(`(${searchText})`, 'i');
    const __html = text.replace(pattern, '<strong>$1</strong>');

    return (
      <span dangerouslySetInnerHTML={
          { __html }
        }></span>
    );
  }

  /**
   * Return a list of filtered suggestions
   * based on the the provided value.
   *
   * @method Autocomplete.filterSuggestions
   * @param {Object[]} suggestions
   * @param {String} value
   * @param {Function} filterFunction
   * @returns {Object[]}
   * @static
   */
  static filterSuggestions(suggestions, value, filterFunction) {
    return suggestions.filter(suggestion => {
      // Don't show suggestion if we don't have a value
      if (!value) {
        return false;
      }

      return filterFunction(suggestion, escapeStringRegexp(value));
    });
  }
}
