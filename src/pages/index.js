import React from "react"
import Elevator from "../components/Elevator"
import InsideElevator from "../components/InsideElevator";
import PeopleContainer from "../components/PeopleContainer";

// How do I add the cart button panel?
const elevator = <Elevator numFloors="6" />;
const insideElevator = <InsideElevator />
const peopleContainer = <PeopleContainer elevator={elevator}/>

export default function Home() {
  return (
    <div id="main-container">
      {insideElevator}
      {elevator}
      {peopleContainer}
    </div>
  )
}
