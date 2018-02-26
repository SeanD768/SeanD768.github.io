import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import './style.css';

const languages = [
      
      {
      make: 'Ferrari',
      model: 'Enzo'
      },
      
      {
      make: 'Toyota',
      model: 'Supra' 
      },

      {
      make: 'Ford',
      model: 'Mustang'
      },

      ];

      

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  
  return inputLength === 0 ? [] : languages.filter(lang => lang.make.toLowerCase().slice(0, inputLength) === inputValue 
 ); 
};

const getSuggestionValue = suggestion => suggestion.make; 

const renderSuggestion = suggestion => (
<div>
  {suggestion.make}
</div>
);








  class AutoSingular extends React.Component {
    constructor() {
      super();

      this.state = {
        value: '',
        suggestions:[]
      };
    }

    onChange = (event, { newValue }) => {
      this.setState({
        value: newValue
      });
    };
   
  onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
        suggestions: getSuggestions(value)
      });
    };


    onSuggestionsClearRequested = () => {
      this.setState({
        suggestions: []
      });
    };



    render() {
      const { value, suggestions } = this.state;

      const inputProps = {
        placeholder: 'Type a programming language',
          value,
          onChange: this.onChange
      };



    return (
 

      <div> 


      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        />

        </div>


    );
  }
}


export default AutoSingular;
