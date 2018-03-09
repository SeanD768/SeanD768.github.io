import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import createFocusObserver from './';

describe('Popover Factory', () => {
  it('activates', () => {
    const onFocusOut = sinon.spy();
    document.body.innerHTML = `
      <div>
        <button type="button">Click me</button>
        <a href="#">Click me too!</a>
      </div>
    `;
    const a = document.body.querySelector('a');
    const button = document.body.querySelector('button');
    const focusObserver = createFocusObserver(button, onFocusOut);
    const event = new Event('click', { bubbles: true });

    focusObserver.activate();
    a.dispatchEvent(event);

    expect(onFocusOut.called).toBe(true);
  });

  it('deactivates', () => {
    const onFocusOut = sinon.spy();
    document.body.innerHTML = `
      <div>
        <button type="button">Click me</button>
        <a href="#">Click me too!</a>
      </div>
    `;
    const a = document.body.querySelector('a');
    const button = document.body.querySelector('button');
    const focusObserver = createFocusObserver(button, onFocusOut);
    const event = new Event('click', { bubbles: true });

    focusObserver.activate();
    focusObserver.deactivate();
    a.dispatchEvent(event);

    expect(onFocusOut.called).toBe(false);
  });

  it('triggers onFocusOut and onFocusIn', () => {
    const onFocusOut = sinon.spy();
    const onFocusIn = sinon.spy();
    document.body.innerHTML = `
      <div>
        <button type="button">Click me</button>
        <a href="#">Click me too!</a>
      </div>
    `;
    const a = document.body.querySelector('a');
    const button = document.body.querySelector('button');
    const focusObserver = createFocusObserver(button, onFocusOut, onFocusIn);
    const event = new Event('click', { bubbles: true });

    focusObserver.activate();
    button.dispatchEvent(event);
    a.dispatchEvent(event);

    expect(onFocusOut.called).toBe(true);
    expect(onFocusIn.called).toBe(true);
  });
});
