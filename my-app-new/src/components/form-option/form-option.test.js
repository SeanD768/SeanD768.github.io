import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import expect from 'expect';
import FormOption from './';


describe('Component: FormOption', () => {
  it('renders with warning and error', () => {
    const formOption = shallow(
      <FormOption hasError={ true } hasWarning={ true } />
    );

    const instance = formOption.instance();

    expect(instance.state.hasWarning).toBe(true);
    expect(instance.state.hasError).toBe(true);
  });

  it('updates with warning and error', () => {
    const formOption = shallow(<FormOption />);
    formOption.setProps({
      hasError: true,
      hasWarning: true,
    });
    const instance = formOption.instance();

    expect(instance.state.hasWarning).toBe(true);
    expect(instance.state.hasError).toBe(true);
  });

  it('triggers onChange', () => {
    const onChange = event => {};
    const spy = sinon.spy(onChange);
    const formOption = shallow(<FormOption defaultChecked={ true } onChange={ spy } />);
    const input = formOption.find('input');

    input.simulate('change', {
      target: {
        checked: false,
      },
    });

    expect(spy.args[0][0].target.checked).toBe(false);
  });

  it('renders checked', () => {
    const formOption = mount(<FormOption defaultChecked={ true } />);

    expect(formOption.instance().input.checked).toBe(true);
  });

  it('validates', () => {
    const onValidate = sinon.spy();
    const formOption = mount(
      <FormOption
        id="terms"
        name="terms"
        value="yes"
        defaultChecked={ true }
        required
        onValidate={ onValidate } />);
    const details = formOption.instance().validate();

    expect(details.checked).toBe(true);
    expect(details.name).toBe('terms');
    expect(details.id).toBe('terms');
    expect(details.value).toBe('yes');
    expect(details.valid).toBe(true);
    expect(details.type).toBe('checkbox');
    expect(details.required).toBe(true);
    expect(onValidate.called).toBe(true);
  });
});
