import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import Hint from './';
import Icon from './../icon';
import CONSTANTS from './../../appConstants';

const ERROR_CLASS = CONSTANTS.HTML_CLASS.ERROR;

describe('<Hint />', () => {
  it('renders null', () => {
    const hint = shallow(<Hint />);

    expect(hint.children().length).toBe(0);
  });

  it('renders "This is a required field"', () => {
    const text = 'This is a required field';
    const hint = shallow(<Hint text={ text } />);
    const paragraph = hint.find('p');

    expect(paragraph.text()).toBe(text);
  });

  it('has class "purple"', () => {
    const className = 'purple';
    const hint = shallow(<Hint text="Hi" className={ className } />);

    expect(hint.find('.purple').length).toBe(1);
  });

  it('renders an icon', () => {
    const hint = shallow(<Hint text="Warning!" icon="error" />);

    expect(hint.find(Icon).length).toBe(1);
  });

  it('has error class', () => {
    const hint = shallow(<Hint text="Error!" type="error" />);

    expect(hint.find(`.${ERROR_CLASS}`).length).toBe(1);
  });

  it('has warning class', () => {
    const hint = shallow(<Hint text="Warning!" type="warning" />);

    expect(hint.find(`.has-warning`).length).toBe(1);
  });

  it('has success class', () => {
    const hint = shallow(<Hint text="Success!" type="success" />);

    expect(hint.find(`.c-hint--success`).length).toBe(1);
  });

  it('fires click event', () => {
    const onClick = sinon.spy();
    const hint = shallow(<Hint text="Error!" onClick={ onClick } />);

    hint.simulate('click');

    expect(onClick.called).toBe(true);
  });

  it('renders random prop', () => {
    const hint = shallow(<Hint text="Error!" hidden="true" />);

    hint.setProps({
      onClick: () => {},
    });

    expect(hint.instance().props.hidden).toBe('true');
  });
});
