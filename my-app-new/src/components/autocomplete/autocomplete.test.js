import React from 'react';
import { shallow, mount } from 'enzyme';
import Autocomplete from './';
import sinon from 'sinon';

Object.defineProperty(window, 'requestAnimationFrame', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: function() {},
});

describe('<Autocomplete />', () => {
  const suggestions = [
    { text: 'one', value: '1', },
    { text: 'own', value: '2', },
    { text: 'onto', value: '3', },
    { text: 'Two', value: '4', },
    { text: 'Three', value: '5', },
    { text: 'Four', value: '6', },
    { text: 'Someone', value: '7', },
  ];

  let autocomplete;

  beforeEach(() => {
    autocomplete = mount(<Autocomplete suggestions={ suggestions } />);
  });

  it('should render <span>Awe<strong>some</strong></span>', () => {
    const span = shallow(<span dangerouslySetInnerHTML={
      { __html: 'Awe<strong>some</strong>' }
    }></span>);
    expect(span.equals(Autocomplete.strongify('Awesome', 'some'))).toBe(true);
  });

  it('should render <span>Awesome</span>', () => {
    const span = shallow(<span dangerouslySetInnerHTML={
      { __html: 'Awesome' }
    }></span>);
    expect(span.equals(Autocomplete.strongify('Awesome', 'flubber'))).toBe(true);
  });

  it('should return suggestions whose text property starts with "on"', () => {
    const filter = (suggestion, value) => suggestion.text.startsWith(value);

    expect(Autocomplete.filterSuggestions(
      suggestions,
      'on',
      filter,
    )).toEqual([
      { text: 'one', value: '1', },
      { text: 'onto', value: '3', },
    ]);
  });

  it('should show two suggestions', () => {
    autocomplete.setState({
      isActive: true,
      suggestions: [
        { text: 'One', value: '1', },
        { text: 'Two', value: '2', },
      ],
    });

    expect(autocomplete.find('li').length).toBe(2);
  });

  it('should be inactive', () => {
    expect(autocomplete.instance().isActive()).toBe(false);
  });

  it('should be active', () => {
    autocomplete.setState({
      isActive: true,
      suggestions: [
        { text: 'One', value: '1', },
        { text: 'Two', value: '2', },
        { text: 'Three', value: '3', },
      ],
    });

    expect(autocomplete.instance().isActive()).toBe(true);
  });

  it('onValueChanged callback is triggered', () => {
    const onValueChanged = sinon.spy();
    const autocomplete = mount(<Autocomplete onValueChanged={ onValueChanged } />);

    autocomplete.setState({
      isActive: true,
      suggestions: [
        { text: 'One', value: '1', },
        { text: 'Two', value: '2', },
      ],
    });

    autocomplete.find('.c-autocomplete__list__item').first().simulate('click');

    expect(onValueChanged.called).toBe(true);
  });

  it('value should be 2', () => {
    autocomplete.setState({
      isActive: true,
      suggestions: [
        { text: 'One', value: '1', },
        { text: 'Two', value: '2', },
      ],
    });

    autocomplete.find('button').last().simulate('click');

    expect(autocomplete.state().value).toBe('2');
  });

  it('props should update; state value should be "shark"', () => {
    autocomplete.setProps({
      value: 'shark'
    });

    expect(autocomplete.state().value).toBe('shark');
  });

  it('props should update; we should have 4 suggestions within props', () => {
    autocomplete.setProps({
      suggestions: [{}, {}, {}, {}],
    });

    expect(autocomplete.instance().props.suggestions.length).toBe(4);
  });

  it('has class "testing"', () => {
    const autocomplete = shallow(<Autocomplete className="testing" />);

    expect(autocomplete.find('.testing').length).toBe(1);
  });

  it('should render custom suggestion', () => {
    const span = shallow(<span className="cool">Blue</span>);
    const suggestions = [{
      text: 'Blue',
      value: 'blue',
    }];
    const autocomplete = shallow(
      <Autocomplete
        className="testing"
        createSuggestion={ (suggestion, value) => {
          return <span className="cool">{ suggestion.text }</span>
        } }
        suggestions={ suggestions } />
    );

    expect(
      span.equals(
        autocomplete
          .instance()
          .props
          .createSuggestion(suggestions[0], ''))
    ).toBe(true);
  });

  it('handles keyDown', () => {
    autocomplete.setState({
      isActive: true,
      suggestions: [
        { text: 'One', value: '1', },
        { text: 'Two', value: '2', },
        { text: 'Three', value: '3', },
      ],
    });

    autocomplete.instance().rovingIndex.setTotal(3);
    autocomplete.instance()._onKeyDown({
      keyCode: 40,
      preventDefault() {},
    });
    autocomplete.instance()._onKeyDown({
      key: 'ArrowDown',
      preventDefault() {},
    });
    autocomplete.instance()._onKeyDown({
      keyCode: 40,
      preventDefault() {},
    });
    expect(autocomplete.instance().state.value).toBe('3');
    autocomplete.instance()._onKeyDown({
      keyCode: 38,
      preventDefault() {},
    });
    expect(autocomplete.instance().state.value).toBe('2');
    autocomplete.instance()._onKeyDown({
      key: 'ArrowUp',
      preventDefault() {},
    });
    expect(autocomplete.instance().state.value).toBe('1');
    autocomplete.instance()._onKeyDown({
      key: 'Enter',
      stopPropagation() {},
      preventDefault() {},
    });
    expect(autocomplete.instance().state.isActive).toBe(false);
  });

  it('handles escape', () => {
    autocomplete.setState({
      isActive: true,
      suggestions: [
        { text: 'One', value: '1', },
      ],
    });

    autocomplete.instance()._onKeyDown({
      key: 'Escape',
      preventDefault() {},
    });
    expect(autocomplete.instance().state.isActive).toBe(false);
    expect(autocomplete.instance()._onKeyDown({})).toBe(undefined); // early return
  });

  it('handles input', () => {
    const onValueChanged = sinon.spy();
    const autocomplete = mount(
      <Autocomplete
        onValueChanged={ onValueChanged }
        suggestions={ suggestions } />
    );
    autocomplete.instance()._onInput({
      target: {
        value: 'own'
      }
    });
    expect(autocomplete.instance().state.value).toBe('own');
    expect(autocomplete.instance().state.isActive).toBe(true);
    expect(autocomplete.instance().state.suggestions.length).toBe(1);
    expect(onValueChanged.called).toBe(true);
  });

  it('handles input with debounce', () => {
    const onValueChanged = sinon.spy();
    const autocomplete = mount(
      <Autocomplete
        hasDebounce={ true }
        onValueChanged={ onValueChanged }
        suggestions={ suggestions } />
    );
    autocomplete.instance()._onInput({
      target: {
        value: 'own'
      }
    });

    setTimeout (() => {
      expect(autocomplete.instance().state.value).toBe('own');
      expect(autocomplete.instance().state.isActive).toBe(true);
      expect(autocomplete.instance().state.suggestions.length).toBe(1);
      expect(onValueChanged.called).toBe(true);
    }, 200);
  });

  it('should include suggestion', () => {
    expect(
      autocomplete
        .instance()
        .props
        .filterSuggestion({ text: 'Blackhawks' }, 'khaw')
    ).toBe(true);
  });

  it('clear button clears value', () => {
    autocomplete.setState({
      isActive: true,
      suggestions: [
        { text: 'One', value: '1', },
      ],
    });

    autocomplete.find('button').first().simulate('click');

    setTimeout (() => {
      expect(autocomplete.instance().state.value).toBe('');;
    }, 200);
  });
});
