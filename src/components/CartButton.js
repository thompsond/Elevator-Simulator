import React from 'react'

export default function CartButton(props) {
    return (
        <button className="cart-button" floor-number={props.floorNumber}>{props.floorNumber}</button>
    )
}
