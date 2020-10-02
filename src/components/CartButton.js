import React, { Component } from 'react'

export default class CartButton extends Component {
    constructor(props) {
        super();
    }

    render() {
        return (
                <button className="cart-button" floor-number={this.props.floorNumber}>{this.props.floorNumber}</button>
        )
    }
}
