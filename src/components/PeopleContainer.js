import React, { Component } from 'react'
import Person from './Person';

export default class PeopleContainer extends Component {
    constructor(props) {
        super();
        this.addPersonListener = this.addPersonListener.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleFloorChange = this.handleFloorChange.bind(this);
        this.state = ({
            peopleList: new Set(),
            name: "",
            floor: "1"
        });
    }

    render() {
        let elevator = this.props.elevator;
        let floorList = [];
        for (let i = 1; i <= parseInt(elevator.props.numFloors); i++) {
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
                            <input type="submit" value="Add" id="add-person-btn" onClick={this.addPersonListener}/>
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

    addPersonListener(event) {
        event.preventDefault();
        this.setState(state => {
            const list = state.peopleList.add(<Person name={this.state.name} currentFloorNum={this.state.floor}/>);
            return {
                list,
                value: ''
            }
        });
        document.getElementById('add-person-form').reset();
    }
}
