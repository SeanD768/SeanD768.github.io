import React, { Component } from 'react';
import Autocomplete from '../autocomplete';
import Dropdown from '../dropdown';
import Button from '../button';
import './style.css';



const defaultOptionYear = {
    text: 'Year'
  };
  
  const makes = [
  { text: 'Audi', value: 'Audi' },
  { text: 'BMW', value: 'BMW'},
  { text: 'Tesla', value: 'Tesla' },
  { text: 'Alfa Romeo', value: 'Alfa Romeo'},
  { text: 'Ferrari', value: 'Ferrari' },
  { text: 'Dodge', value: 'Dodge'},
  { text: 'Mitsubishi', value: 'Mitsubishi' },
  { text: 'Toyota', value: 'Toyota'},
  
  ];
  
  
  const models = [
  { text: 'R8', value: 'R8' },
  { text: 'M6', value: 'M6 '},
  { text: 'Model S', value: 'Model S' },
  { text: '4C Spider', value: '4C Spider'},
  { text: '458 Italia', value: '458 Italia' },
  { text: 'Viper', value: 'Viper'},
  { text: 'Lancer', value: 'Lancer' },
  { text: 'Supra', value: 'Supra'},

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
        this.setState({ modelDisabled: true});
        this.setState({ makeDisabled: false });
        
        //this.setState({ })
      }

      enableModel = (event) => {
        console.log("The Model is now enabled");
        console.log(event.value);
        const value = event.value;
        this.setState({ makeValue: value });
        this.setState({modelValue: ''});
        this.setState({ modelDisabled: false });
        this.textInput.focusTextInput();
    }

      enableComplete = (event) => {
        const value = event.value;                
        this.setState({ modelValue: value });
        }





        render() {

            const {
                enableMake,
                enableModel,
            } = this;

            const {
                makeDisabled,
                modelDisabled,
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
            { text: '2010', value: '2010', }
            ] }
            value={this.state.yearValue}
            onChange={(event) => {this.enableMake(event)}}
            required 
            /> 

            <div id="Break"/>

            <div className="flex-container">
            <Autocomplete
            className="flex-item-1"                        
            label="Makes"
            value={ this.state.makeValue }
            //minFilterValueLength={ 3 }
            suggestions={ makes }
            onClickSuggestion={(event) => {this.enableModel(event)}}
            disabled={this.state.makeDisabled}
            />


            <Autocomplete
            className="flex-item-2"
            label="Models"
            value={ this.state.modelValue }
            //minFilterValueLength={ 3 }
            suggestions={ models }
            disabled={this.state.modelDisabled}
            onClickSuggestion={(event) => {this.enableComplete(event)}}
            ref={(input) => { this.textInput = input; }}
            />

            </div>
            
            <div id="ButtonBreak"/>


            <Button className="btn" text="Add"/>


         </div>


);
}
}

export default Vehicle

