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
            currentFloor: props.numFloors,
            destinationFloor: props.numFloors,
            names: new Set(),
            upQueue: new FastPriorityQueue((a, b) => { return a > b; }),
            downQueue: new FastPriorityQueue((a, b) => { return a > b; })
        });
        let numOfFloors = props.numFloors;
        this.refsArray = [];
        this.insideElevatorRef = React.createRef();
        this.height = 0;

        if (numOfFloors < 2) throw new RangeError("numFloors must be at least 2");

        // Add all of the floors
        for (let i = parseInt(numOfFloors); i > 0; i--) {
            this.state.floorMap.set(i, []);
            this.state.floors.push(i);
        }
    }

    componentDidMount() {
        let elevatorHeight = document.getElementById('elevator-frame').clientHeight;
        let leftDoor = document.getElementById('left-door');
        let rightDoor = document.getElementById('right-door');
        let topOffset = 0.21 * Math.floor(elevatorHeight);
        let calculatedHeight = elevatorHeight - topOffset;
        // Position the doors
        leftDoor.style.height = `${calculatedHeight}px`;
        leftDoor.style.top = `${topOffset}px`;
        rightDoor.style.height = `${calculatedHeight}px`;
        rightDoor.style.top = `${topOffset}px`;
        let doorWidth = leftDoor.clientWidth;
        let sideOffset = doorWidth / 2;
        leftDoor.style.left = '50%';
        rightDoor.style.right = '50%';
        leftDoor.style.transform = `translateX(-50%) translateX(-${sideOffset}px)`;
        rightDoor.style.transform = `translateX(50%) translateX(${sideOffset}px)`;
        // Set the height of all the floors
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
                <InsideElevator ref={this.insideElevatorRef} numFloors={this.props.numFloors} elevator={this} />
                <div id="elevator-display-container">
                    <div id="elevator-display">
                        {this.state.floors.map((floor, i) => (
                            <Floor ref={ ref => {
                                this.refsArray[this.props.numFloors - i - 1] = ref;
                            }}
                            peopleList={[]} key={this.props.numFloors - i - 1}/>
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
            if (this.state.upQueue.isEmpty() && this.state.downQueue.isEmpty()) {
                let direction = elevatorCall.direction;
                if (direction === CallDirection.UP) {
                    let newQueue = this.state.upQueue;
                    newQueue.add(elevatorCall);
                    this.setState({
                        upQueue: newQueue
                    });
                }
                else {
                    let newQueue = this.state.downQueue;
                    newQueue.add(elevatorCall);
                    this.setState({
                        downQueue: newQueue
                    });
                }
                this.move(elevatorCall);
            }
        }
        else if(elevatorCall instanceof CartCall) {

        }
        else {
            throw new TypeError("Invalid type for elevatorCall");
        }
    }

    // Move the elevator
    move = async(elevatorCall) => {
        if (elevatorCall instanceof LandingCall) {
            this.state.destinationFloor = elevatorCall.person.props.currentFloorNum;
            let diff = this.state.destinationFloor - this.state.currentFloor;
            // Destination is current floor
            if (diff === 0) {
                await this.land();
            }
            // Destination is below current floor
            else if (diff < 0) {
                this.state.downQueue.poll();
                await this.animateDown(Math.abs(diff));
                await this.land();
            }
            // Destination is above current floor
            else {
                this.state.upQueue.poll();
                await this.animateUp(diff);
                await this.land();
            }
        } else if (elevatorCall instanceof CartCall) {

        } else {
            throw new TypeError("Invalid type for elevatorCall");
        }
    }

    land = async() => {
        await this.openDoors();
        await this.closeDoors();
        this.setState({
            currentFloor: this.state.destinationFloor
        });
    }

    // Fix.... it goes from the original position not current position
    animateUp = (distance) => {
        return anime({
            targets: '#elevator',
            translateY: -(distance * this.height + (distance * 10)),
            duration: distance * 1000,
            easing: 'linear'
        }).finished;
    }

    animateDown = (distance) => {
        return anime({
            targets: '#elevator',
            translateY: (distance * this.height + (distance * 10)),
            duration: distance * 1000,
            easing: 'linear'
        }).finished;
    }

    openDoors = async() => {
        const leftDoorAnimation = anime({
            targets: '#left-door',
            left: '35%',
            duration: 2000,
            easing: 'linear'
        }).finished;
        
        const rightDoorAnimation = anime({
            targets: '#right-door',
            right: '35%',
            duration: 2000,
            easing: 'linear'
        }).finished;

        return Promise.all([leftDoorAnimation, rightDoorAnimation]);
    }

    closeDoors = async() => {
        const leftDoorAnimation = anime({
            targets: '#left-door',
            left: '50%',
            delay: 1000,
            duration: 2000,
            easing: 'linear'
        }).finished;

        const rightDoorAnimation = anime({
            targets: '#right-door',
            right: '50%',
            delay: 1000,
            duration: 2000,
            easing: 'linear'
        }).finished;

        return Promise.all([leftDoorAnimation, rightDoorAnimation]);
    }

    // Stop the elevator
    stop() {

    }
}
