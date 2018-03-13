import React, { Component } from 'react';
import Autocomplete from '../autocomplete';
import Dropdown from '../dropdown';
import Button from '../button';
import './style.css';



const defaultOptionYear = {
    text: 'Year'
  };
  
  const makes = [
  { text: 'Alfa Romeo', value: 'Alfa Romeo'},      
  { text: 'Audi', value: 'Audi' },
  { text: 'BMW', value: 'BMW'},
  { text: 'Dodge', value: 'Dodge'},  
  { text: 'Ferrari', value: 'Ferrari' }, 
  { text: 'Mitsubishi', value: 'Mitsubishi' },  
  { text: 'Tesla', value: 'Tesla' },
  { text: 'Toyota', value: 'Toyota'},
  
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

  ];

class Vehicle extends Component {
    constructor(props){
        super(props);
        this.focusModelSelection = this.focusModelSelection.bind(this);        
        this.state = {
          makeDisabled: true,
          modelDisabled: true,
          yearValue: '',          
          makeValue: '',
          modelValue: '',
          //buttonDisabled: true,
        };
      }


      focusModelSelection() {
        console.log("Focus function is running")
        this.ModelSelection.focus();                
        
      }



      enableMake = (event) => {
        console.log("The Make is now enabled");
        const value = event.target.value;
        this.setState({ yearValue: value });  
        this.setState({makeValue: ''})
        this.setState({ modelValue: ''})              
        this.setState({ modelDisabled: true });
        this.setState({ makeDisabled: false });
        this.setState({ buttonDisabled: false});
        
      }

      enableModel = (event, focusModelSelection) => {
        console.log("The Model is now enabled");
        console.log(event.value);
        const value = event.value;
        this.setState({ makeValue: value });
        this.setState({modelValue: ''});
        this.setState({ modelDisabled: false });
        //this.ModelSelection.focus();                
    }

      enableComplete = (event) => {
        console.log(event.value);
        const value = event.value;                
        this.setState({ modelValue: value });
        }





        render() {

            const {
                enableMake,
                enableModel,
                focusModelSelection,
            } = this;

            const {
                makeDisabled,
                modelDisabled,
                buttonDisabled
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
            inputclassName="flex-item-1"                      
            //label="Makes"
            placeholder="Make"
            value={ this.state.makeValue }
            minFilterValueLength={ 3 }
            suggestions={ makes }
            onClickSuggestion={(event) => {this.enableModel(event)}}
            disabled={this.state.makeDisabled}
            />


            <Autocomplete
            inputclassName="flex-item-2"
            //label="Models"
            placeholder="Model"
            value={ this.state.modelValue }
            minFilterValueLength={ 3 }
            suggestions={ models }
            //ref={(input) => {this.ModelSelection = input; }}            
            disabled={this.state.modelDisabled}
            onClickSuggestion={(event) => {this.enableComplete(event)}}

            />

            </div>
            
            <div id="ButtonBreak"/>


            <Button className="btn" text="Add" disabled={this.state.buttonDisabled}/>

            {/* <input type="text" ref={(input) => {this.ModelSelection = input; }} /> */}
            {/* <input type="button" onClick={this.focusModelSelection} /> */}



         </div>


);
}
}

export default Vehicle

