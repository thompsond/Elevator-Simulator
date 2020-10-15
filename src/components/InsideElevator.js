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
            <div id="inside-elevator-wrapper">
                <h2 className="description">Inside Elevator</h2>
                <p className="description">Choose a passenger and a destination floor</p>
                <div id="inside-elevator-container">
                    <div id="elevator-passenger-list">
                        {Array.from(this.state.peopleList)}
                    </div>
                    <div id="elevator-btn-container">
                        {this.cartBtns}
                    </div>
                </div>
            </div>
        )
    }

    update = (map) => {
        this.setState({peopleList: Array.from(map, (key, value) => { return key[1]; })});
    }
}
