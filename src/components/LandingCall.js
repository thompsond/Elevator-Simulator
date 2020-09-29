import { ElevatorCall } from './ElevatorCall.js';

export class LandingCall extends ElevatorCall {
    direction;

    constructor(person, direction) {
        super(person);
        this.direction = direction;
    }
}