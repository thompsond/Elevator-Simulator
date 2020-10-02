import React, { Component } from 'react'
import { LandingCall } from './LandingCall'
import { CallDirection } from './includes'
import arrow_up from '../images/arrow_up.svg'
import arrow_up_highlighted from '../images/arrow_up_highlighted.svg'
import arrow_down from '../images/arrow_down.svg'
import arrow_down_highlighted from '../images/arrow_down_highlighted.svg'

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
            <div className="person-btn-wrapper">
                <div className="person-up-container person-btn-container" onClick={this.btnClickListener}>
                    <img src={arrow_up} alt="up button" className="person-elev-btn person-up-btn" />
                    <img src={arrow_up_highlighted} alt="up button" className="person-elev-btn person-up-btn hover-img hover-up-img" btntype={PersonFloorButtonGroup.BtnType.UP}/>
                </div>
                <div className="person-down-container person-btn-container" onClick={this.btnClickListener}>
                    <img src={arrow_down} alt="down button" className="person-elev-btn person-down-btn" />
                    <img src={arrow_down_highlighted} alt="down button" className="person-elev-btn person-down-btn hover-img hover-down-img" btntype={PersonFloorButtonGroup.BtnType.DOWN}/>
                </div>
            </div>
        )
    }

    btnClickListener(event) {
        let elevator = this.props.elevator;
        let type = event.target.getAttribute('btntype');
        if (type === PersonFloorButtonGroup.BtnType.UP) {
            elevator.addCall(new LandingCall(this.props.person, CallDirection.UP));
        } else {
            elevator.addCall(new LandingCall(this.props.person, CallDirection.DOWN));
        }
    }
}
