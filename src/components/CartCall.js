import { ElevatorCall } from './ElevatorCall.js';

export class CartCall extends ElevatorCall {
    destinationFloor; // The destination floor number

    constructor(person, destinationFloor) {
        super(person);
        this.destinationFloor = destinationFloor;
    }
}