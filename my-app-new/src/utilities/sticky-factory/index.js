import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import CONSTANTS from './../../appConstants';

const ACTIVE_CLASS = CONSTANTS.HTML_CLASS.ACTIVE;

function getOffsetBottom(windowHeight, parentOffset, offset, height) {
  const stickyHeight = offset + height;
  let offsetBottom = (windowHeight - parentOffset) - stickyHeight;

  return offsetBottom;
}

/**
 * A higher-order component used to create Toast menus.
 *
 * @function createToast
 * @returns {React.Component} Toast
 */
export default function stickify() {
  return class Stickify extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        active: false,
        ending: false,
        height: 0,
        parentOffset: 0,
        parentScrollHeight: 0,
        offset: 0,
        offsetBottom: 0,
      }

      this.parent = props.parentId;
    }

    static defaultProps = {
      marginTop: 32,
      className: '',
    };

    static propTypes = {
      marginTop: PropTypes.number,
      className: PropTypes.string,
    };

    componentDidMount() {

      const {
        parentId
      } = this.props;

      if(typeof parentId == "string"){
        this.parent = document.getElementById(parentId);
      }
      else{
        this.parent = parentId;
      }

      this.initSticky();
    };

    initSticky() {
      this.resetWindow();
      this.stickify();

      this.parent.addEventListener('scroll', this.stickify);
      window.addEventListener('resize', this.resetWindow);
    }

    destroySticky() {
      const parent = this.parent;

      parent.removeEventListener('scroll', this.stickify);
      window.removeEventListener('resize', this.resetWindow);
    }

    stickify = () => {
      const {
        active,
        offset,
        ending,
        parentScrollHeight,
        offsetBottom,
      } = this.state;

      const parent = this.parent;
      const parentDetails = parent.getBoundingClientRect();
      const sticky = this.sticky.getBoundingClientRect();

      this.setState({
        parentScrollHeight: this.parent.scrollHeight,
      });

      if(!active && parent.scrollTop > offset) {
        this.setState({
          active: true,
          offsetBottom: getOffsetBottom(window.innerHeight, parentDetails.top, this.sticky.offsetTop, sticky.height)
        })
      }

      if(active && parent.scrollTop < offset || parent.scrollTop == 0) {
        this.setState({
          active: false,
          offsetBottom: getOffsetBottom(window.innerHeight, parentDetails.top, this.sticky.offsetTop, sticky.height)
        })
      }

      if(offsetBottom < 0) {
        let remainingScroll = parentScrollHeight - (parent.scrollTop + parentDetails.height);
        const belowViewPort = Math.abs(offsetBottom) + 32;

        if(remainingScroll <= belowViewPort) {
          this.setState({
            ending: true,
          });
        }
        else{
          this.setState({
            ending: false,
          });
        }
      }
      else{
        if(ending) {
           this.setState({
            ending: false,
          });
        }
      }
    }

    resetWindow = () => {
      const parentDetails = this.parent.getBoundingClientRect();
      const sticky = this.sticky.getBoundingClientRect();

      const offset = this.sticky.offsetTop - this.props.marginTop;

      this.setState({
        height: sticky.height,
        offset: offset,
        parentOffset: parentDetails.top,
        parentScrollHeight: this.parent.scrollHeight,
        currentWidth: sticky.width,
        offsetBottom: getOffsetBottom(window.innerHeight, parentDetails.top, this.sticky.offsetTop, sticky.height)
      });
    }

    componentWillUnmount() {
      this.destroySticky();
    }

    render() {
        const {
          children,
          marginTop,
          className,
        } = this.props;

        const {
          active,
          ending,
          height,
          parentOffset,
          currentWidth,
        } = this.state;

        const parentStyles = {
          height: active ? `${height}px` : 'auto'
        }

        const childStyles = {
          top: ending ? 'auto' : `${parentOffset + marginTop}px`,
          width: active || ending ? `${currentWidth}px` : 'auto',
        }

        return(
          <div
            ref={ (ref) => { this.sticky = ref} }
            className={`l-sticky ${className}`}
            style={ parentStyles }>
            <div
              style={ childStyles }
              className={`l-sticky__element ${active ? ACTIVE_CLASS : ''} ${ending ? 'is-ending' : ''}`}>
              { children }
            </div>
          </div>
      )
    }
  }
}
