import React, { Component } from 'react'
import Elevator from './Elevator';
import Passenger from './Passenger';

export default class Floor extends Component {
    constructor(props) {
        super();
        this.state = ({peopleList: props.peopleList});
    }

    update = (newPeopleList) => {
        this.setState({peopleList: newPeopleList});
    }

    render() {
        return (
            <div className="elevator-display-passenger-list">
                {this.state.peopleList.map((person, i) => {
                    return (
                        <Passenger key={i}/>
                    )
                })}
            </div>
        )
    }
}
