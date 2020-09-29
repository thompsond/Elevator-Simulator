import React, { Component } from 'react'
import { LandingCall } from './LandingCall'
import { CallDirection } from './includes'

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
            <div class="person-btn-container">
                <img src="images/arrow-up.png" alt="up button" class="person-elev-btn person-up-btn" onClick={this.btnClickListener} btnType={PersonFloorButtonGroup.BtnType.UP} />
                <img src="images/arrow-down.png" alt="down button" class="person-elev-btn person-down-btn" onClick={this.btnClickListener} btnType={PersonFloorButtonGroup.BtnType.DOWN} />
            </div>
        )
    }

    btnClickListener(event) {
        let type = event.target.getAttribute('btnType');
        if (type === PersonFloorButtonGroup.BtnType.UP) {
            this.elevator.move(new LandingCall(this, CallDirection.UP));
        } else {
            this.elevator.move(new LandingCall(this, CallDirection.DOWN));
        }
    }
}
