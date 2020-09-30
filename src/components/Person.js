import React, { Component } from 'react'
import PersonFloorButtonGroup from './PersonFloorButtonGroup';

export default class Person extends Component {
    constructor(props) {
        super();
        this.state = ({
            name: props.name,
            currentFloorNum: props.currentFloorNum,
            elevator: props.elevator
        });
    }
    
    render() {
        return (
            <div className="person">
                <span className="person-info">{this.state.name + " " + this.state.currentFloorNum}</span>
                <PersonFloorButtonGroup person={this} elevator={this.state.elevator}/>
            </div>
        )
    }
}
