import React, { Component } from 'react';
import ModalDialog from '../modal-dialog';


export default class ModalPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isActive: false };
  }

  openModal = () => {
    console.log("Modal Open");
    this.setState({
      isActive: true,
    });
  }

  onClickAction = () => {
    console.log("Modal Action");
    this.setState({
      isActive: false,
    });
  }

  render() {
    const {
      openModal,
      onClickAction,
    } = this;

    const isActive = this.state.isActive;

    return (
      <div>
         <button className="c-btn c-btn--primary" onClick={ openModal }>
           Open Modal
          </button>

        <ModalDialog
          title="Add Vehicle"
          hideTrigger // we can use an ordinary button to control isActive prop
          showCloseBtn={ false } // we want to control the close method with a button in the footer
          isActive={ isActive } // Uses the `isActive` state value rather than the internal state
          onCloseCallback={ onClickAction } // Ties the overlay & close button clicks to the external functions
          footer={

            <div> 

            <button className="c-btn c-btn--primary" onClick={ onClickAction }>Add</button>

            </div>


          }>
        </ModalDialog>
      </div>
    )
  }
}