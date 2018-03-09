import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import Form from './';
import FormField from '../form-field';
import DateField from './../date-field';
import MaskedFormField from './../masked-form-field';
import DatePicker from './../date-picker';
import FormOption from '../form-option';
import Dropdown from '../dropdown';
import Autocomplete from '../autocomplete';
import FormManager from './FormManager';

describe('<Form />', () => {
  it('triggers onSubmit', () => {
    const onSubmit = sinon.spy();
    const form = mount(<Form onSubmit={ onSubmit }></Form>);

    form.simulate('submit');

    expect(onSubmit.called).toBe(true);
  })

  it('adds _form prop to form controls', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <Form
        id="my_form"
        onSubmit={ onSubmit }>
        <FormField />
        <DateField />
        <MaskedFormField mask="00/00/0000" />
        <DatePicker />
        <FormOption />
        <Dropdown />
        <Autocomplete />
      </Form>
    );
    const formField = form.find(FormField).at(0);
    const dateField = form.find(FormField).at(1);
    const maskedFormField = form.find(FormField).at(2);
    const datePicker = form.find(FormField).at(3);
    const formOption = form.find(FormOption);
    const dropdown = form.find(Dropdown);
    const autocomplete = form.find(FormField).at(4);

    expect(formField.props()._form).toBe('my_form');
    expect(dateField.props()._form).toBe('my_form');
    expect(maskedFormField.props()._form).toBe('my_form');
    expect(datePicker.props()._form).toBe('my_form');
    expect(formOption.props()._form).toBe('my_form');
    expect(dropdown.props()._form).toBe('my_form');
    expect(autocomplete.props()._form).toBe('my_form');
  });

  it('provides details onSubmit', () => {
    const onSubmit = (event, details) => {};
    const spy = sinon.spy(onSubmit);
    const form = mount(
      <Form onSubmit={ spy }>
        <FormField id="name" name="name" value="Bob" required />
        <Autocomplete id="color" suggestions={[{text: 'Blue', value: 'Blue'}]} name="color" value="Blue" required />
      </Form>
    );

    form.simulate('submit');

    const details = spy.args[0][1];

    expect(details.valid).toBe(true);
    expect(details.fields.name.required).toBe(true);
    expect(details.fields.name.type).toBe('text');
    expect(details.fields.name.valid).toBe(true);
    expect(details.fields.name.value).toBe('Bob');
    expect(details.fields.color.required).toBe(true);
    expect(details.fields.color.type).toBe('text');
    expect(details.fields.color.valid).toBe(true);
    expect(details.fields.color.value).toBe('Blue');
  });

  it('adds new field', () => {
    class TestField extends React.Component {
      render() {
        return <input type="text" />;
      }
    };
    Form.addField(TestField);
    const form = mount(
      <Form id="testing">
        <TestField />
      </Form>
    );
    const testField = form.find(TestField);

    expect(testField.props()._form).toBe('testing');
  });

  it('removes itself from form managers', () => {
    const form = mount(
      <Form id="cool_form"></Form>
    );

    form.unmount();

    expect(FormManager.forms.get('cool_form')).toBe(undefined);
  });
});
