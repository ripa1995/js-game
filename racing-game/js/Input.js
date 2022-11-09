var mouseX, mouseY;

const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

function keySet(keyEvent, whichCar, setTo) {
    switch (keyEvent.keyCode) {
        case whichCar.controlKeyLeft:
            whichCar.keyHeld_TurnLeft = setTo;
            break;
        case whichCar.controlKeyRight:
            whichCar.keyHeld_TurnRight = setTo;
            break;
        case whichCar.controlKeyUp:
            whichCar.keyHeld_Gas = setTo;
            break;
        case whichCar.controlKeyDown:
            whichCar.keyHeld_Reverse = setTo;
            break;
    }
}

function keyPressed(evt) {
    //console.log("keyPressed: "+ evt.keyCode);
    keySet(evt,blueCar,true)
    keySet(evt,greenCar,true)
}

function keyReleased(evt) {
    //console.log("keyReleased "+ evt.keyCode);
    keySet(evt,blueCar,false)
    keySet(evt,greenCar,false)
}