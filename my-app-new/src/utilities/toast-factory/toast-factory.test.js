import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import createToast from './';

describe('toast Factory', () => {
  let Toast;

  beforeEach(() => {
    Toast = createToast();
  });

  it('creates a toast with a p in it', () => {
    const toast = shallow(<Toast><p></p></Toast>);
    const button = toast.find('p');

    expect(button.length).toBe(1);
  });

  it('is active', () => {
    const toast = mount(<Toast></Toast>);

    expect(toast.instance().state.isActive).toBe(true);
  });

  it('is inactive', () => {
    const toast = mount(<Toast></Toast>);

    toast.instance().close();

    expect(toast.instance().state.isActive).toBe(false);
  });


  it('triggers callbacks', () => {
    const onOpen = sinon.spy();
    const onClose = sinon.spy();
    const toast = mount(<Toast onOpen={ onOpen } onClose={ onClose }></Toast>);

    expect(onOpen.called).toBe(true);

    toast.instance().close();

    setTimeout(() => {
     expect(onClose.called).toBe(true), 750
    });

  });

  it('triggers close after 300ms', () => {
    const onClose = sinon.spy();
    const toast = mount(<Toast timeOut={ 300 } onClose={ onClose }></Toast>);

    setTimeout(() => {
     expect(onClose.called).toBe(true), 1050
    });

  });

  it('doesn\'t trigger close if autoRemove is off', () => {
    const onClose = sinon.spy();
    const toast = mount(<Toast timeOut={ 300 } autoRemove={ false } onClose={ onClose }></Toast>);

    setTimeout(() => {
     expect(onClose.called).toBe(false), 1050
    });

  });

  it('close btn triggers close', () => {
    const onClose = sinon.spy();
    const toast = mount(<Toast autoRemove={ false } onClose={ onClose }></Toast>);

    let btn = toast.find('button');

    btn.simulate('click');

    setTimeout(() => {
     expect(onClose.called).toBe(true), 750
    });

  });

  it('renders an icon', () => {
    const toast = mount(<Toast icon="checkmark"></Toast>);

    let icon = toast.find('Icon');

    expect(icon.length).toBe(2);
  });

  it('renders a confirmation icon', () => {
    const toast = mount(<Toast icon="checkmark" promptType="c-toaster__toast--confirmation"></Toast>);

    let icon = toast.find('Icon').last();

    expect(icon.props().icon).toBe('checkmark');
  });

  it('renders a warning icon', () => {
    const toast = mount(<Toast icon="error" promptType="c-toaster__toast--warning"></Toast>);

    let icon = toast.find('Icon').last();

    expect(icon.props().icon).toBe('error');
  });

  it('renders a custom icon', () => {
    const toast = mount(<Toast icon="calendar" promptType="c-toaster__toast--warning"></Toast>);

    let icon = toast.find('Icon').last();

    expect(icon.props().icon).toBe('calendar');
  });

  it('renders a no icon', () => {
    const toast = mount(<Toast promptType="c-toaster__toast--warning"></Toast>);

    let icon = toast.find('Icon');

    expect(icon.length).toBe(1);
    expect(toast.find('.c-toaster__toast--no-icon').length).toBe(1);
  });
});
