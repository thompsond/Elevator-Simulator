import React, { Component } from 'react'

export default class InsideElevatorPerson extends Component {
    render() {
        return (
            <div className="elevator-passenger">
                <span className="person-info" onClick={this.clickListener} name={this.props.name}>{this.props.name}</span>
            </div>
        )
    }

    clickListener = (event) => {
        event.target.parentElement.classList.add('selected');
    }
}
