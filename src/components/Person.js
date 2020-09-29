import React, { Component } from 'react'
import PersonFloorButtonGroup from './PersonFloorButtonGroup';

export default class Person extends Component {
    name;
    currentFloorNum;
    elevator;
    
    
    constructor(props) {
        super();
        this.name = props.name;
        this.currentFloorNum = props.currentFloorNum;
        this.elevator = props.elevator;
    }

    render() {
        return (
            <div className="person">
                <span class="person-info">{this.name + " " + this.currentFloorNum}</span>
                <PersonFloorButtonGroup/>
            </div>
        )
    }

    setCurrentFloorNum(num) {
        this.currentFloorNum = num;
    }
}
