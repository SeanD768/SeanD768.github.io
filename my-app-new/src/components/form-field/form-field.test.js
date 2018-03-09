import sinon from 'sinon';
import React from 'react';
import { shallow, mount } from 'enzyme';
//import TestUtils from 'react-addons-test-utils';
import FormField from './';
import Hint from '../hint';
import Label from '../label';
import FormValidators from './../../utilities/form-validators/';

describe('<FormField />', () => {
  it('has class "purple"', () => {
    const formField = shallow(<FormField className="purple" />);
    const container = formField.find('.c-form-field');

    expect(container.hasClass('purple')).toBe(true);
  });

  it('should render an input[type="text"]', () => {
    const formField = shallow(<FormField />);
    const input = formField.find('input');

    expect(input.props().type).toBe('text');
  });

  it('should render a textarea', () => {
    const formField = shallow(<FormField type="textarea" />);
    const textarea = formField.find('textarea');

    expect(textarea.length).toBe(1);
  });

  it('should render an input[type="email"]', () => {
    const formField = shallow(<FormField type="email" />);
    const input = formField.find('input');

    expect(input.props().type).toBe('email');
  });

  it('value should be "Bernie"', () => {
    const formField = shallow(<FormField value="Bernie" />);
    const input = formField.find('input');

    expect(input.props().value).toBe('Bernie');
  });

  it('value should be "Purple"', () => {
    const formField = shallow(<FormField />);

    formField.setProps({ value: 'Purple' });

    expect(formField.state().value).toBe('Purple');
  });

  it('should have error', () => {
    const formField = shallow(<FormField />);

    formField.setProps({ hasError: true });

    expect(formField.state().hasError).toBe(true);
  });

  it('should have warning', () => {
    const formField = shallow(<FormField />);

    formField.setProps({ hasWarning: true });

    expect(formField.state().hasWarning).toBe(true);
  });

  it('should be loading', () => {
    const formField = shallow(<FormField isLoading />);
    const container = formField.find('.c-form-field');

    expect(container.hasClass('is-loading')).toBe(true);
  });

  it('should trigger onChange callback', () => {
    const onChange = sinon.spy();
    const formField = shallow(<FormField onChange={ onChange } />);
    const input = formField.find('input').shallow();

    input.simulate(
      'change',
      {
        target: {
          value: 'sauce',
        }
      }
    );

    expect(onChange.called).toBe(true);
    expect(formField.state().value).toBe('sauce');
  });

  it('shows a error message', () => {
    const formField = shallow(
      <FormField errorText="ERROR!" hasError={ true } required />
    );
    const hint = formField.find(Hint).first();

    expect(hint.props().text).toBe('ERROR!');
  });

  it('shows a warning message', () => {
    const formField = shallow(
      <FormField warningText="WARNING!" hasWarning={ true } required />
    );
    const hint = formField.find(Hint).last();

    expect(hint.props().text).toBe('WARNING!');
  });

  it('shows a success message', () => {
    const formField = shallow(
      <FormField successText="Success!" />
    );
    const hint = formField.find(Hint).last();

    expect(hint.props().type).toBe('success');
    expect(hint.props().text).toBe('Success!');
  });

  it('shows help text', () => {
    const formField = shallow(<FormField helpText="Soo helpful" />);
    const hint = formField.find(Hint).last();

    expect(hint.props().text).toBe('Soo helpful');
  });

  it('renders a label', () => {
    const formField = shallow(<FormField helpText="Soo helpful" />);
    const label = formField.find(Label);

    expect(label.length).toBe(1);
  });

  it('has class "c-form-field--labelless"', () => {
    const formField = shallow(<FormField />);
    const labelless = formField.find('.c-form-field--labelless');

    expect(labelless.length).toBe(1);
  });

  it('id equals "name"', () => {
    const formField = shallow(<FormField id="name" />);

    expect(formField.instance().id).toBe('name');
  });

  it('validates', () => {
    const formField = shallow(
      <FormField
        id="name"
        name="name"
        required
        onValidate={ () => {
          return {
            testing: '123',
          };
        } } />
    );

    let validatorObj = formField.instance().validate();
    expect(validatorObj.valid).toBe(false);
    formField.setState({ value: 'awesome' });
    validatorObj = formField.instance().validate();
    expect(validatorObj.valid).toBe(true);
    expect(validatorObj.value).toBe('awesome');
    expect(validatorObj.required).toBe(true);
    expect(validatorObj.id).toBe('name');
    expect(validatorObj.testing).toBe('123');
    expect(validatorObj.name).toBe('name');
    expect(validatorObj.type).toBe('text');
  });

  it('holds onto error', () => {
    const formField = shallow(<FormField type="textarea" />);
    formField.instance().setState({ hasError: true });
    formField.setProps({});

    expect(formField.instance().state.hasError).toBe(true);
  });

  it('can auto expand a textarea', () => {
    const formField = mount(<FormField value="j" autoExpand type="textarea" />);

    formField.simulate("keyDown", { keyCode: 74 });

    expect(formField.instance().state.value).toBe('j');
  });


  it('should prevent entry of characters specified in regex property', () => {
    const formField = mount(<FormField
                            id="regular_expression_ignore"
                            type="text"
                            value="5678aB"
                            label="Regular Expression Ignore"
                            regex={/[5-9g-zG-Z]+/g}  />);

    formField.simulate('focus');
    formField.simulate('change');
    expect(formField.state().value).toEqual('aB');
  });

  it('should only allow entry of characters specified in regex property', () => {
    const formField = mount(<FormField
                            id="regular_expression_allow"
                            type="text"
                            value="12345r"
                            label="Regular Expression Allow"
                            regex={/[^5-9g-zG-Z]+/g}  />);

    //formField.simulate('focus');
    formField.simulate('change');
    expect(formField.state().value).toEqual('5r');
  });

  it('preventPaste should disable onPaste', () => {
    const onPaste = sinon.spy();
    const formField = mount(<FormField onPaste={ onPaste } preventPaste />);
    const input = formField.find('input')

    input.simulate(
      'paste',
      {
        target: {
          value: 'sauce',
        },
        preventDefault() {},
      }
    );

    expect(onPaste.called).toBe(true);
    expect(input.props().value).toBe('');
  });

  it('can set null value to componentWillReceiveProps', () => {
    const formField = shallow(<FormField value="hello" />);

    formField.setProps({ value: null });

    expect(formField.find('input').props().value).toBe('');
  });

  it('It counts down max characters', () => {
    const formField = shallow(<FormField showCharCount={true} maxLength={10} value="hello" />);
    const input = formField.find('input')

    formField.setProps({ value: 'a' });

    let hint = formField.find(Hint).last();

    expect(hint.props().text).toBe('Max character: 9');

    input.simulate(
      'change',
      {
        target: {
          value: 'sauce',
        }
      }
    );

    hint = formField.find(Hint).last();

    expect(hint.props().text).toBe('Max character: 5');
  });
});
