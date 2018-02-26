import sinon from 'sinon';
import React from 'react';
import { shallow, mount } from 'enzyme';
import ModalDialog from './';
import { ButtonTrigger } from './triggers';
import Icon from '../icon';

describe('ModalDialog', () => {

  it('renders button trigger and its props', () => {
    const onClick = sinon.spy();
    const buttonTrigger = shallow(<ButtonTrigger buttonText="Hi" onClick={ onClick } />);
    const button = buttonTrigger.find('button');
    const span = buttonTrigger.find('span');
    button.simulate('click');
    expect(onClick.called).toBe(true);
    expect(span.text()).toBe('Hi');
  });

  it('custom props', () => {
    const modal = shallow(<ModalDialog foo="bar"></ModalDialog>);

    expect(modal.instance().props.foo).toBe("bar");
  });

  it('creates a modal with a paragraph in it', () => {
    const modal = shallow(<ModalDialog text="Hello"><p></p></ModalDialog>);
    const p = modal.find('p');

    expect(p.length).toBe(1);
  });

  it('is active', () => {
    const modal = mount(<ModalDialog></ModalDialog>);

    modal.instance().open();

    expect(modal.instance().state.isActive).toBe(true);
  });

  it('is inactive', () => {
    const modal = mount(<ModalDialog></ModalDialog>);

    modal.instance().open();
    modal.instance().close();

    expect(modal.instance().state.isActive).toBe(false);
  });

  it('closes when escape is pressed', () => {
    const modal = mount(<ModalDialog />);

    modal.instance().open();
    modal.instance()._onKeydown({ key: 27 });

    expect(modal.state().isActive).toBe(false);
  });

  it('closes when overlay is clicked', () => {
    const modal = mount(<ModalDialog isActive={ true } />);
    const button = modal.find('.c-overlay');

    button.simulate('click');

    expect(modal.state().isActive).toBe(false);
  });

  it('closes when close btn is clicked', () => {
    const modal = mount(<ModalDialog isActive={ true } />);
    const button = modal.find('.c-btn--icon');

    button.simulate('click');

    expect(modal.state().isActive).toBe(false);
  });

  it('toggles', () => {
    const modal = mount(<ModalDialog></ModalDialog>);

    modal.instance().toggle();
    modal.instance().toggle();
    modal.instance().toggle();

    expect(modal.instance().state.isActive).toBe(true);
  });

  it('triggers callbacks', () => {
    const onOpen = sinon.spy();
    const onClose = sinon.spy();
    const modal = mount(<ModalDialog onOpen={ onOpen } onClose={ onClose }></ModalDialog>);

    modal.instance().open();
    modal.instance().close();

    expect(onOpen.called).toBe(true);
    expect(onClose.called).toBe(true);
  });

  it('displays inline when isInline prop passed', () => {
    const modal = mount(<ModalDialog isInline></ModalDialog>);

    expect(modal.instance().props.isInline).toBe(true);
  });

  it('doesn\'t render overlay', () => {
    const modal = mount(<ModalDialog isSlideDrawer noOverlay></ModalDialog>);

    expect(modal.find('.c-overlay').length).toBe(0);
  });

  it('condensed prop removes horizontal padding', () => {
    const modal = mount(<ModalDialog condensed></ModalDialog>);

    expect(modal.find('.c-modal-dialog__dialog--condensed').length).toBe(1);
  });
});
