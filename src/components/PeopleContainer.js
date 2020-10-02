import React, { Component } from 'react'
import Person from './Person';

export default class PeopleContainer extends Component {
    constructor(props) {
        super();
        this.addPersonButtonListener = this.addPersonButtonListener.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleFloorChange = this.handleFloorChange.bind(this);
        this.state = ({
            peopleList: new Set(),
            name: "",
            floor: props.elevator.props.numFloors
        });
    }

    render() {
        let elevator = this.props.elevator;
        let floorList = [];
        for (let i = parseInt(elevator.props.numFloors); i > 0; i--) {
            floorList.push(<option value={i} key={i}>{i}</option>);
        }
        return (
            <div id="people-container">
                <div id="add-person-container">
                    <form id="add-person-form">
                        <div id="person-name-container" className="input-container">
                            <span className="input-title">Name</span>
                            <input type="text" id="name-field" className="input-field" autoComplete="off" onChange={this.handleNameChange}/>
                        </div>
                            <div id="select-container">
                            <span className="input-title">Floor</span>
                                <select name="person-floor-select" id="person-floor-select" onChange={this.handleFloorChange}>
                                    {floorList}
                                </select>
                            </div>
                            <input type="submit" value="Add" id="add-person-btn" onClick={this.addPersonButtonListener}/>
                </form>
                        </div>
                        <div id="people-list">{this.state.peopleList}</div>
        </div>
        )
    }

    handleNameChange(event) {
        this.setState({name: event.target.value});
    }

    handleFloorChange(event) {
        this.setState({floor: event.target.value});
    }

    addPersonButtonListener(event) {
        event.preventDefault();
        let name = this.state.name.trim();
        if(name === "")  {
            alert("A name is required");
            return;
        }
        let elevator = this.props.elevator;
        let person = <Person name={name} currentFloorNum={this.state.floor} key={this.state.name} elevator={elevator}/>;
        this.setState((state, props) => {
            const list = state.peopleList.add(person);
            // Reset the state name and floor
            return { peopleList: list, name: '', floor: elevator.props.numFloors };
        });
        elevator.addPerson(person);
        document.getElementById('add-person-form').reset();
    }
}
