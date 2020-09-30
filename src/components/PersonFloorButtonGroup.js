import React, { Component } from 'react'
import { LandingCall } from './LandingCall'
import { CallDirection } from './includes'
import arrow_up from '../images/arrow_up.png'
import arrow_down from '../images/arrow_down.png'

export default class PersonFloorButtonGroup extends Component {
    static BtnType = {
        UP: 'up',
        DOWN: 'down'
    };

    constructor(props) {
        super();
        this.btnClickListener = this.btnClickListener.bind(this);
    }

    render() {
        return (
            <div className="person-btn-container">
                <img src={arrow_up} alt="up button" className="person-elev-btn person-up-btn" onClick={this.btnClickListener} btntype={PersonFloorButtonGroup.BtnType.UP} />
                <img src={arrow_down} alt="down button" className="person-elev-btn person-down-btn" onClick={this.btnClickListener} btntype={PersonFloorButtonGroup.BtnType.DOWN} />
            </div>
        )
    }

    btnClickListener(event) {
        let elevator = this.props.elevator;
        let type = event.target.getAttribute('btnType');
        if (type === PersonFloorButtonGroup.BtnType.UP) {
            elevator.addCall(new LandingCall(this.props.person, CallDirection.UP));
        } else {
            elevator.addCall(new LandingCall(this.props.person, CallDirection.DOWN));
        }
    }
}
