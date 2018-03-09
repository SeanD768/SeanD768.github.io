import React from 'react';
import sinon from 'sinon';
import { shallow, mount, render } from 'enzyme';
import expect from 'expect';
import stickify from './';

describe('Component: Sticky', () => {
  let Stickify;

  beforeEach(() => {
    Stickify = stickify();
  });

  /* Testing that the Component is rendering */
  it('It renders without errors', () => {
    expect(
      shallow(
      <div id="sticky-parent" style={ {height: '1000px'} }>
        <Stickify parentId="sticky-parent" />
      </div>
      ).length
    ).toEqual(1);
  })

  it('It can handle extra css classes', () => {
    const Sticky = shallow(
      <div id="sticky-parent" style={ {height: '1000px'} }>
        <Stickify className="foo" parentId="sticky-parent" />
      </div>
    );

    expect(Sticky.find('.foo').length).toBe(1);
 });

  it('It can handle custom props', () => {
    const sticky = mount(
        <Stickify hidden parentId={document.body}>
          <p>hello</p>
        </Stickify>
    );

    expect(sticky.props().hidden).toBe(true);
  });

  it('renders it\'s children`', () => {
    const sticky = mount(<Stickify className="foo" parentId={document.body}>
                          <p>Hello</p>
                        </Stickify>)

    expect(sticky.find('p').length).toBe(1);
  });

  it('has a parent which maintains a height`', () => {
    const sticky = mount(<Stickify className="foo" parentId={document.body}>
                          <p>Hello</p>
                          </Stickify>)

    expect(sticky.find('.l-sticky').props().style.height).toBe('auto');
  });

  it('unmounts and kills event listeners', () => {

    const sticky = mount(<Stickify className="foo" parentId={document.body}>
                          <p>Hello</p>
                          </Stickify>)

    sticky.instance().resetWindow();
    sticky.instance().stickify();
    sticky.unmount();

    expect(sticky.node._calledComponentWillUnmount).toBe(true);
  });

  it('it is active when scrolled passed element start`', () => {
    let child = document.createElement('div');
    document.body.appendChild(child);
    document.body.style.overflow = 'auto';
    child.style.height = '1000px';

    document.body.height = 600;
    document.body.scrolltop = 300;

    const sticky = mount(<Stickify className="foo" parentId={document.body}>
                    <p>Hello</p>
                    </Stickify>)

    sticky.instance().setState({active: true});

    expect(sticky.find('.is-active').length).toBe(1);
  });

});
