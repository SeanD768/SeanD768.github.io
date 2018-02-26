import React, { Component } from "react";
import "./buttonstyle.css";

class Button extends Component {

    constructor(props) {
        super(props);

         this.state = {
            disabled: false,
        } 
    }

    render(){
            
        return (
        <div>

        <button className={this.props.className}
        disabled={this.state.disabled} 
        onClick={this.props.handleClick}>
        {this.props.text} 
        </button> 

        </div>
        
        )
    }
}

export default Button;