import React, { Component } from "react";
import "./buttonstyle.css";

class Button extends Component {
    render(){
        


        
        return (

        <button 
        className="btn" 
        onClick={this.props.handleClick}>{this.props.text}
        </button>      

        )
    }
}

export default Button;