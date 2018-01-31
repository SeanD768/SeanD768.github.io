import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './components/button';


class App extends Component {
  

  
    clicked(){
      
            alert("This should be a more appropriate function!");
           // More appropriate function 

          }
    

    
    render() {
    

    return (
      <div className="App">


        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>


        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      

      <Button handleClick={ (e) => { e.preventDefault(); this.clicked(); } } text="Continue"/>
      {/* Prevents default submission of the buttons function */}
      </div>

    );
  }
}


export default App;
