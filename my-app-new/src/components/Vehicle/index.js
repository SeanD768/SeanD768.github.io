import React, { Component } from 'react';
import Autocomplete from '../autocomplete';
import Dropdown from '../dropdown';
import Formfield from '../form-field';
import Button from '../button';
import './style.css';



const defaultOptionYear = {
    text: 'Year'
  };
  
  const makes = [
  { text: 'Alfa Romeo', value: 'Alfa Romeo' },      
  { text: 'Audi', value: 'Audi' },
  { text: 'BMW', value: 'BMW' },
  { text: 'Dodge', value: 'Dodge' },  
  { text: 'Ferrari', value: 'Ferrari' }, 
  { text: 'Mitsubishi', value: 'Mitsubishi' },  
  { text: 'Tesla', value: 'Tesla' },
  { text: 'Toyota', value: 'Toyota' },
  { text: 'Lexus', value: 'Lexus' },
  ];
  
  const models = [
  { text: 'Lancer', value: 'Lancer' },   
  { text: 'Model S', value: 'Model S' }, 
  { text: 'M6', value: 'M6 '},  
  { text: 'R8', value: 'R8' },
  { text: 'Supra', value: 'Supra'},  
  { text: 'Viper', value: 'Viper'},  
  { text: '4C Spider', value: '4C Spider'},
  { text: '458 Italia', value: '458 Italia' },
  { text: 'RX', value: 'RX' },
  ];


class Vehicle extends Component {
    constructor(props){
        super(props);
        this.state = {
          makeDisabled: true,
          modelDisabled: true,
          yearValue: '',          
          makeValue: '',
          modelValue: '',

        };
      }


      

      enableMake = (event) => {
        console.log("The Make is now enabled");
        const value = event.target.value;
        this.setState({ yearValue: value });  
        this.setState({makeValue: ''})
        this.setState({ modelValue: ''})              
        this.setState({ modelDisabled: true });
        this.setState({ buttonDisabled: false });
        this.setState({ makeDisabled: false }, () => {
           this.makeInput.formField.focus();
        });
      }

      enableModel = (event) => {
        const value = event.value;
        this.setState({ makeValue: value });
        this.setState({modelValue: ''});
        this.setState({ modelDisabled: false }, () => {
          this.modelInput.formField.focus();
        });
        console.log("The Model is now enabled");
        
      }

      enableComplete = (event) => {             
        const value = event.value;                
        this.setState({ modelValue: value });
        console.log("All options chosen");
      }

      logValues = (event) => {

        const makeValue = this.state.makeValue;
        const modelValue = this.state.modelValue;
        const yearValue = this.state.yearValue;
        console.log( yearValue, ",", makeValue, ",", modelValue );
        alert( yearValue + ", " + makeValue + ", " + modelValue );
      }







        render() {

            const {
                enableMake,
                enableModel,
                enableComplete,
                logValues,
                focusModelSelection,
                focusTextInput,
            } = this;

            const {
                makeDisabled,
                modelDisabled,
                buttonDisabled,
                makeValue,
                modelValue,
                yearValue,
            } = this.state;

  
        return (


        <div className="selectcontainer">

            <Dropdown
            id="year"
            name="year"
            defaultOption={ defaultOptionYear }
            options={ [
            { text: '1960', value: '1960', },
            { text: '2000', value: '2000', },
            { text: '2010', value: '2010', },
            { text: '2011', value: '2011', },
            { text: '2012', value: '2012', },
            { text: '2013', value: '2013', },
            { text: '2014', value: '2014', },
            { text: '2015', value: '2015', },
            { text: '2016', value: '2016', }
            ] }
            value={this.state.yearValue}
            onChange={(event) => {this.enableMake(event)}}
            //onClick={(event) => {this.enableMake(event)}}
            required 
            /> 

            <div id="Break"/>


            <div className="input-border">

            <div className="grid-container">
            <Autocomplete
            inputclassName="grid-item-1"
            placeholder="Make"
            ref={(input) => {this.makeInput = input; }}                        
            value={ this.state.makeValue }
            minFilterValueLength={ 3 }
            suggestions={ makes }
            onClickSuggestion={(event) => {this.enableModel(event)}}
            disabled={this.state.makeDisabled}
            />


            <p className="grid-item-2"> / </p>
            
            <Autocomplete
            inputclassName="grid-item-3"
            placeholder="Model"
            ref={input => {this.modelInput = input; }}
            value={ this.state.modelValue }
            minFilterValueLength={ 2 }
            suggestions={ models }
            disabled={this.state.modelDisabled}
            onClickSuggestion={(event) => {this.enableComplete(event)}}
            />

            </div>
            </div>
            
            <div id="ButtonBreak"/>

            <button className="btn" value="Add" onClick={logValues}> Add </button>



         </div>


);
}
}

export default Vehicle

