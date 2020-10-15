import React, { Component } from 'react'
import Floor from './Floor'
import { FastPriorityQueue } from './FastPriorityQueue'
import { LandingCall } from './LandingCall'
import { CallDirection, ElevatorStatus } from './includes'
import { CartCall } from '../../../Elevator Simulator/js/CartCall'
import PeopleContainer from './PeopleContainer'
import InsideElevator from './InsideElevator'
import door_left from '../images/door_left.svg'
import door_right from '../images/door_right.svg'
import elevator_frame from '../images/elevator_frame.svg'
import {anime} from './anime'
import Person from './Person'
import InsideElevatorPerson from './InsideElevatorPerson'

export default class Elevator extends Component {
    constructor(props) {
        super();
        this.state = ({
            floors: [],
            floorMap: new Map()
        });
        let numOfFloors = props.numFloors;
        this.refsArray = [];
        this.insideElevatorMap = new Map();
        this.peopleContainerMap = new Map();
        this.insideElevatorRef = React.createRef();
        this.peopleContainerRef = React.createRef();
        this.height = 0;
        this.currentFloor = props.numFloors;
        this.destinationFloor = props.numFloors;
        this.elevatorStatus = ElevatorStatus.IDLE;
        this.baseDuration = 1500;
        this.isMoving = false;

        if (numOfFloors < 2) throw new RangeError("numFloors must be at least 2");

        // Add all of the floors
        for (let i = parseInt(numOfFloors); i > 0; i--) {
            this.state.floorMap.set(i, []);
            this.state.floors.push(i);
        }

        let compare = (a, b) => { return a > b; }
        this.upQueue = new FastPriorityQueue(compare);
        this.downQueue = new FastPriorityQueue(compare);

        this.upQueueProxyAdd = new Proxy(this.upQueue.add, {
            apply: (target, thisArg, args) => {
                target = target.bind(this.upQueue);
                target(args[0]);
                this.move();
            }
        });
        
        this.downQueueProxyAdd = new Proxy(this.downQueue.add, {
            apply: (target, thisArg, args) => {
                target = target.bind(this.downQueue);
                target(args[0]);
                this.move();
            }
        });
        setInterval(() => { if (!this.isMoving) this.move(); }, 5000);
    }


    componentDidMount() {
        let elevatorHeight = document.getElementById('elevator-frame').clientHeight;
        let leftDoor = document.getElementById('left-door');
        let rightDoor = document.getElementById('right-door');
        let topOffset = 0.21 * elevatorHeight;
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
                <PeopleContainer ref={this.peopleContainerRef} elevator={this}/>
            </div>
        )
    }

    // Add Person to their respective floor
    addPerson = (name, floor) => {
        let person = <Person name={name} currentFloorNum={floor} key={name} elevator={this} />;
        let floorNumber = parseInt(person.props.currentFloorNum.toString());
        let newPeopleMap = this.state.floorMap;
        newPeopleMap.get(floorNumber).push(person);
        let floorArray = newPeopleMap.get(floorNumber);
        this.setState({floorMap: newPeopleMap});
        this.refsArray[floorNumber-1].update(floorArray);
        this.peopleContainerMap.set(person.props.name, person);
        this.peopleContainerRef.current.update(this.peopleContainerMap);
    }

    // Remove person from floorMap and peopleContainer
    removePerson = (person) => {
        let floorNumber = parseInt(person.props.currentFloorNum.toString());
        let newPeopleMap = this.state.floorMap;
        let floorArray = newPeopleMap.get(floorNumber);
        let position = 0;
        floorArray.forEach((element, index) => {
            if (element.props.name === person.props.name) {
                position = index;
                return;
            }
        });
        // Take the person off the floor
        floorArray.splice(position, 1);
        this.setState({floorMap: newPeopleMap});
        this.refsArray[floorNumber-1].update(floorArray);
        // Remove person from people container
        this.peopleContainerMap.delete(person.props.name);
        this.peopleContainerRef.current.update(this.peopleContainerMap);
        // Put the person in the elevator
        let personComponent = <InsideElevatorPerson name={person.props.name} currentFloorNum={person.props.currentFloorNum} key={person.props.name}/>
        this.insideElevatorMap.set(person.props.name, personComponent);
        this.insideElevatorRef.current.update(this.insideElevatorMap);
    }

    addCall = (elevatorCall) => {
        if (elevatorCall.direction === CallDirection.UP) {
            this.elevatorStatus = ElevatorStatus.UP;
            this.upQueueProxyAdd(elevatorCall);
        }
        else {
            this.elevatorStatus = ElevatorStatus.DOWN;
            this.downQueueProxyAdd(elevatorCall);
        }
    }

    // Move the elevator
    move = async() => {
        if(this.upQueue.isEmpty() && this.downQueue.isEmpty()) {
            this.elevatorStatus = ElevatorStatus.IDLE;
            return;
        }
        let currentQueue = this.elevatorStatus === ElevatorStatus.UP ? this.upQueue : this.downQueue;
        let elevatorCall = currentQueue.poll();
        this.destinationFloor = parseInt(elevatorCall.person.props.currentFloorNum);
        let diff = this.destinationFloor - this.currentFloor;
        
        this.isMoving = true;
        // Destination is below current floor
        if (diff < 0) {
            await this.animateDown(Math.abs(diff));
        }
        // Destination is above current floor
        if (diff > 0) {
            await this.animateUp(diff);
        }
        await this.land();
        this.removePerson(elevatorCall.person);
        this.isMoving = false;
    }

    land = async() => {
        await this.openDoors();
        await this.closeDoors();
        this.currentFloor = this.destinationFloor;
    }

    // Fix.... it goes from the original position not current position
    animateUp = (distance) => {
        let currentPos = document.getElementById('elevator').getBoundingClientRect().top;
        let offset = document.getElementById('elevator').offsetTop;
        return anime({
            targets: '#elevator',
            translateY: (currentPos - offset) - (distance * this.height + (distance * 10)),
            duration: distance * this.baseDuration,
            easing: 'linear'
        }).finished;
    }

    animateDown = (distance) => {
        let currentPos = document.getElementById('elevator').getBoundingClientRect().top;
        let offset = document.getElementById('elevator').offsetTop;
        return anime({
            targets: '#elevator',
            translateY: (currentPos - offset) + (distance * this.height + (distance * 10)),
            duration: distance * this.baseDuration,
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
}
