import React, { Component } from 'react'
import Floor from './Floor'
import { FastPriorityQueue } from './FastPriorityQueue'
import { LandingCall } from './LandingCall'
import { CallDirection } from './includes'
import { CartCall } from '../../../Elevator Simulator/js/CartCall'
import PeopleContainer from './PeopleContainer'
import InsideElevator from './InsideElevator'
import door_left from '../images/door_left.svg'
import door_right from '../images/door_right.svg'
import elevator_frame from '../images/elevator_frame.svg'
import {anime} from './anime'

export default class Elevator extends Component {
    constructor(props) {
        super();
        this.state = ({
            floors: [],
            floorMap: new Map(),
            currentFloor: 1,
            destinationFloor: 1,
            names: new Set(),
            upQueue: new FastPriorityQueue((a, b) => { return a > b; }),
            downQueue: new FastPriorityQueue((a, b) => { return a > b; })
        });
        let numOfFloors = props.numFloors;
        this.refsArray = [];
        this.height = 0;

        if (numOfFloors < 2) throw new RangeError("numFloors must be at least 2");

        // Add all of the floors
        for (let i = numOfFloors; i > 0; i--) {
            this.state.floorMap.set(i, []);
            this.state.floors.push(i);
        }
    }

    componentDidMount() {
        let elevatorHeight = document.getElementById('elevator-frame').clientHeight;
        let elevatorWidth = document.getElementById('elevator-frame').clientWidth;
        let leftDoor = document.getElementById('left-door');
        let rightDoor = document.getElementById('right-door');
        let topOffset = 0.1866 * elevatorHeight;
        let calculatedHeight = elevatorHeight - topOffset;
        leftDoor.style.height = `${calculatedHeight}px`;
        leftDoor.style.top = `${topOffset}px`;
        leftDoor.style.left = '50%';
        let doorWidth = leftDoor.clientWidth;
        let sideOffset = doorWidth / 2;
        leftDoor.style.transform = `translateX(-50%) translateX(-${sideOffset}px)`;
        rightDoor.style.height = `${calculatedHeight}px`;
        rightDoor.style.top = `${topOffset}px`;
        rightDoor.style.right = '50%';
        rightDoor.style.transform = `translateX(50%) translateX(${sideOffset}px)`;
        let passengerLists = document.getElementsByClassName('elevator-display-passenger-list');
        for(let i = 0; i < passengerLists.length; i++) {
            passengerLists[i].style.height = `${elevatorHeight + 10}px`;
        }
        this.height = elevatorHeight;
    }

    // Put the elevator images in here
    render() {
        return (
            <div id="main-container">
                <InsideElevator />
                <div id="elevator-display-container">
                    <div id="elevator-display">
                        {this.state.floors.map((floor, i) => (
                            <Floor ref={ ref => {
                                this.refsArray[i] = ref;
                            }}
                            peopleList={[]} key={i+1}/>
                        ))}
                    </div>
                    <div id="elevator-wrapper">
                        <div id="elevator">
                            <img src={elevator_frame} alt='elevator frame' id='elevator-frame'/>
                            <img src={door_left} alt='left door' className='door' id='left-door'/>
                            <img src={door_right} alt='right door' className='door' id='right-door'/>
                        </div>
                    </div>
                </div>
                <PeopleContainer elevator={this}/>
            </div>
        )
    }

    // Add Person to their respective floor
    addPerson = (person) => {
        let floorNumber = parseInt(person.props.currentFloorNum.toString());
        let newPeopleMap = this.state.floorMap;
        newPeopleMap.get(floorNumber).push(person);
        let newPeopleList = newPeopleMap.get(floorNumber);
        this.setState({floorMap: newPeopleMap});
        this.refsArray[floorNumber-1].update(newPeopleList);
    }

    addCall = (elevatorCall) => {
        if(elevatorCall instanceof LandingCall) {
            // Add the call to the correct queue
            let direction = elevatorCall.direction;
            if(direction === CallDirection.UP) {
                this.state.upQueue.add(elevatorCall);
                alert('Going up');
            }
            else {
                this.state.downQueue.add(elevatorCall);
                alert('Going down');
            }
        }
        else if(elevatorCall instanceof CartCall) {

        }
        else {
            throw new TypeError("Invalid type for elevatorCall");
        }
    }

    // Move the elevator
    move = (elevatorCall) => {
        if (elevatorCall instanceof LandingCall) {
            if (this.upQueue.isEmpty() && this.downQueue.isEmpty()) {
                this.destinationFloor = elevatorCall.person.currentFloorNum;
                let diff = this.destinationFloor - this.currentFloor;
                // Destination is current floor
                if (diff == 0) {

                }
                // Destination is below current floor
                else if (diff < 0) {
                    this.animateDown(diff);
                }
                // Destination is above current floor
                else {
                    this.animateUp(diff);
                }
            }
        } else if (elevatorCall instanceof CartCall) {

        } else {
            throw new TypeError("Invalid type for elevatorCall");
        }
    }

    animateUp = (distance, height) => {
        anime({
            targets: '#elevator',
            translateY: -(distance * height + (distance * 10)),
            duration: distance * 1000,
            easing: 'linear'
        });
    }

    animateDown = (distance, height) => {
        anime({
            targets: '#elevator',
            translateY: (distance * height + (distance * 10)),
            duration: distance * 1000,
            easing: 'linear'
        });
    }

    // Stop the elevator
    stop() {

    }
}
