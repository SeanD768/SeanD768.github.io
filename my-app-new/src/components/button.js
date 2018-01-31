import React, { Component } from "react";
import "./buttonstyle.css";

class Button extends Component {
    constructor() {
        super();
        this.state = { value: ''};
        this.onChange = this.onChange.bind(this);
        this.add = this.add.bind(this);
    }

    add() {
        this.props.onButtonClick(this.state.value);
        this.setState({ value: ''});
    }

    onChange(e) {
        this.setState({ value: e.target.value});
    }


        /* disabled={!this.state.value} */


    render(){
            
        return (
    <div>
        <button
        disabled={!this.state.value}
        className="btn" 
        onClick={this.props.handleClick}
        >{this.props.text} 
        </button>      

 
 
        <input
        type="text"
        className="add-item__input"
        value={this.state.value}
        onChange={this.onChange}
        placeholder={this.props.placeholder}
        />

    </div>

        )
    }
}

export default Button;