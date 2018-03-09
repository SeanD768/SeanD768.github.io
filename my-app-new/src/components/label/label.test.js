import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';
import Label from './';

describe('<Label />', () => {
  it('renders null', () => {
    const label = shallow(<Label />);

    expect(label.hasClass('c-label')).toBe(false);
  });

  it('renders custom className', () => {
    const label = shallow(<Label text="Name" className="red" />);

    expect(label.hasClass('red')).toBe(true);
  });

  it('renders htmlFor', () => {
    const div = shallow(<div><Label htmlFor="name" text="Name" /></div>);

    expect(div.find(Label).render().find('label')[0].attribs);
  });

  it('renders text "street address"', () => {
    const label = shallow(<Label text="street address" />);

    expect(label.text()).toBe('street address');
  });

  it('renders asterisk', () => {
    const label = shallow(<Label text="street address" required />);

    expect(label.find('.c-label__asterisk').text()).toBe('*');
  });
});
