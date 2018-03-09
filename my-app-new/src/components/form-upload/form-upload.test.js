import sinon from 'sinon';
import React from 'react';
import { shallow, mount } from 'enzyme';
import FormUpload from './';
import Hint from '../hint';
import Label from '../label';
import FormValidators from './../../utilities/form-validators/';

describe('<FormUpload />', () => {
  it('has class "purple"', () => {
    const formField = shallow(<FormUpload className="purple" />);
    const container = formField.find('.c-form-upload');

    expect(container.hasClass('purple')).toBe(true);
  });

  it('should render an input[type="file"]', () => {
    const formField = shallow(<FormUpload />);
    const input = formField.find('input');

    expect(input.props().type).toBe('file');
  });

  it('should have error', () => {
    const formField = shallow(<FormUpload />);

    formField.setProps({ hasError: true });

    expect(formField.state().hasError).toBe(true);
  });

  it('should have warning', () => {
    const formField = shallow(<FormUpload />);

    formField.setProps({ hasWarning: true });

    expect(formField.state().hasWarning).toBe(true);
  });

  it('should render the drag and drop variant', () => {
    const formField = shallow(<FormUpload dropzone={ true } />);

    expect(formField.find('.c-form-upload--dropzone').length).toBe(1);
  });

  it('should be loading', () => {
    const formField = shallow(<FormUpload isLoading />);
    const container = formField.find('.c-form-upload');

    expect(container.hasClass('is-loading')).toBe(true);
  });

  it('should trigger onChange callback', () => {
    const onFileUpload = sinon.spy();
    const blob = new Blob(['foo'], {type : 'text/plain'});
    const readAsText = jest.fn();
    const addEventListener = jest.fn((_, evtHandler) => { evtHandler(); });
    const readAsDataURL =jest.fn(() => {});
    const dummyFileReader = {addEventListener, readAsText, result: 'foo', readAsDataURL};
    window.FileReader = jest.fn(() => dummyFileReader);
    const formField = shallow(<FormUpload onChange={ onFileUpload } />);
    const input = formField.find('input');

    input.simulate(
      'change',
      {
        target: {
          files: [
            blob
          ],
        }
      }
    );

    expect(onFileUpload.called).toBe(true);
  });

  it('should trigger onDrop callback', () => {
    const onFileUpload = sinon.spy();
    const blob = new Blob(['foo'], {type : 'text/plain'});
    const readAsText = jest.fn();
    const addEventListener = jest.fn((_, evtHandler) => { evtHandler(); });
    const readAsDataURL =jest.fn(() => {});
    const dummyFileReader = {addEventListener, readAsText, result: 'foo', readAsDataURL};
    window.FileReader = jest.fn(() => dummyFileReader);
    const formField = shallow(<FormUpload onDrop={ onFileUpload } />);
    const input = formField.find('input');

    input.simulate(
      'drop',
      {
        dataTransfer: {
          files: [
            blob
          ],
        },
        preventDefault() {},
      },
    );

    expect(onFileUpload.called).toBe(true);
  });

  it('should trigger onDragOver callback', () => {
    const onDragOver = sinon.spy();
    const formField = shallow(<FormUpload onDragOver={ onDragOver } />);
    const input = formField.find('input');

    input.simulate(
      'dragover',
      {
        preventDefault() {},
      },
    );

    expect(onDragOver.called).toBe(true);
  });

  it('shows a error message', () => {
    const formField = shallow(
      <FormUpload errorText="ERROR!" hasError={ true } required />
    );
    const hint = formField.find(Hint).first();

    expect(hint.props().text).toBe('ERROR!');
  });

  it('shows a warning message', () => {
    const formField = shallow(
      <FormUpload warningText="WARNING!" hasWarning={ true } required />
    );
    const hint = formField.find(Hint).last();

    expect(hint.props().text).toBe('WARNING!');
  });

  it('shows help text', () => {
    const formField = shallow(<FormUpload helpText="Soo helpful" />);
    const hint = formField.find(Hint).last();

    expect(hint.props().text).toBe('Soo helpful');
  });

  it('shows success text', () => {
    const formField = shallow(<FormUpload successText="Soo successful" />);
    const hint = formField.find(Hint).last();

    expect(hint.props().text).toBe('Soo successful');
  });

  it('renders a label', () => {
    const formField = shallow(<FormUpload helpText="Soo helpful" />);
    const label = formField.find(Label);

    expect(label.length).toBe(1);
  });

  it('id equals "name"', () => {
    const formField = shallow(<FormUpload id="name" />);

    expect(formField.instance().id).toBe('name');
  });

  it('validates', () => {
    const formField = shallow(
      <FormUpload
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
    formField.setState({ fileName: 'awesome' });
    validatorObj = formField.instance().validate();
    expect(validatorObj.valid).toBe(true);
    expect(validatorObj.fileName).toBe('awesome');
    expect(validatorObj.required).toBe(true);
    expect(validatorObj.id).toBe('name');
    expect(validatorObj.testing).toBe('123');
    expect(validatorObj.name).toBe('name');
    expect(validatorObj.type).toBe('file');
  });

  it('holds onto error', () => {
    const formField = shallow(<FormUpload type="textarea" />);
    formField.instance().setState({ hasError: true });
    formField.setProps({});

    expect(formField.instance().state.hasError).toBe(true);
  });
});
