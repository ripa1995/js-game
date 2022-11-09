var mouseX, mouseY;

const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

function keySet(keyEvent, whichWarrior, setTo) {
    switch (keyEvent.keyCode) {
        case whichWarrior.controlKeyLeft:
            whichWarrior.keyHeld_Left = setTo;
            break;
        case whichWarrior.controlKeyRight:
            whichWarrior.keyHeld_Right = setTo;
            break;
        case whichWarrior.controlKeyUp:
            whichWarrior.keyHeld_Up = setTo;
            break;
        case whichWarrior.controlKeyDown:
            whichWarrior.keyHeld_Down = setTo;
            break;
    }
}

function keyPressed(evt) {
    //console.log("keyPressed: "+ evt.keyCode);
    keySet(evt,blueWarrior,true)
}

function keyReleased(evt) {
    //console.log("keyReleased "+ evt.keyCode);
    keySet(evt,blueWarrior,false)
}