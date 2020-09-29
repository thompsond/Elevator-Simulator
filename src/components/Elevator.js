import React, { Component } from 'react'
import Floor from './Floor'
import { FastPriorityQueue } from './FastPriorityQueue'

export default class Elevator extends Component {
    floors;
    upQueue;
    downQueue;
    currentFloor;
    destinationFloor;
    names;

    constructor(props) {
        super();
        this.currentFloor = 1;
        this.destinationFloor = 1;
        this.floors = [];
        this.names = new Set();
        this.animateUp = this.animateUp.bind(this);
        this.animateDown = this.animateDown.bind(this);
        let numOfFloors = props.numFloors;

        /******************
         * Fix all of the object stuff
         *  
         * 
         ******************/
        if (numOfFloors < 2) throw new RangeError("numFloors must be at least 2");
        // Add top floor
        this.floors.push(<Floor hasUp="false" hasDown="true" key={(numOfFloors).toString()} />);
        // Add all of the other floors in between
        for (let i = numOfFloors-1; i > 1; i--) {
            this.floors.push(<Floor hasUp="true" hasDown="true" key={i.toString()}/>);
        }
        // Add first floor
        this.floors.push(<Floor hasUp="true" hasDown="false" key="1" />);

        this.upQueue = new FastPriorityQueue((a, b) => { return a > b; });
        this.downQueue = new FastPriorityQueue((a, b) => { return a > b; });
        // document.getElementById('add-person-btn').addEventListener('click', function (event) {
        //     event.preventDefault();
        //     let name = $('#name-field').val().trim();
        //     let floor = parseInt($('#person-floor-select').val());
        //     if (name === "") {
        //         alert('A name is required');
        //         return;
        //     }
        //     let prevSize = this.names.size;
        //     this.names.add(name);
        //     let newSize = this.names.size;
        //     if (prevSize === newSize) {
        //         alert(`${name} already exists`);
        //         return;
        //     }
        //     let person = new Person(name, floor, this);
        //     this.floors[floor - 1].addPerson(person);
        //     $('form')[0].reset();

        // }.bind(this));
    }

    // Put the elevator images in here
    render() {
        return (
            <div>
                {this.floors}
            </div>
        )
    }

    add() {
        alert('Hello');
    }

    // Move the elevator
    move(elevatorCall) {

    }

    animateUp(floorNumber) {

    }

    animateDown(floorNumber) {

    }

    // Stop the elevator
    stop() {

    }
}
