import React, { Component } from 'react'
import CartButton from './CartButton';

export default class InsideElevator extends Component {
    constructor(props) {
        super();
        this.state = ({
            peopleList: []
        });
        this.cartBtns = [];
        for(let i = props.numFloors; i > 0; i--) {
            this.cartBtns.push(<CartButton floorNumber={i} key={i}/>);
        }
    }

    render() {
        return (
            <div id="inside-elevator-container">
                <div id="elevator-passenger-list"></div>
                <div id="elevator-btn-container">
                    {this.cartBtns}
                </div>
            </div>
        )
    }
}
