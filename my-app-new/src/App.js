import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
//import Button from './components/button';
//import Autosuggest from 'react-autosuggest';
import AutoMany from './components/AutoMany';



  class App extends React.Component {




    render() {


    return (
      <div className="App">



        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Testing Environment</h1>
        </header>


        <p className="App-intro">

        </p>
      


        <AutoMany/>

        </div>



    );
  }
}


export default App;
