const PLAYER_SPEED = 1;

class Warrior {
    constructor() {

        this.x = 75;
        this.y = 75;
        this.myWarriorPic;
        this.name = "untitled";

        this.keyHeld_Up = false;
        this.keyHeld_Down = false;
        this.keyHeld_Left = false;
        this.keyHeld_Right = false;

        this.controlKeyUp;
        this.controlKeyRight;
        this.controlKeyDown;
        this.controlKeyLeft;

        this.setupInput = function (upKey, rightKey, downKey, leftKey) {
            this.controlKeyUp = upKey;
            this.controlKeyRight = rightKey;
            this.controlKeyDown = downKey;
            this.controlKeyLeft = leftKey;
        };

        this.reset = function (whichImage, warriorName) {
            this.myWarriorPic = whichImage;
            this.name = warriorName;
            for (var eachRow = 0; eachRow < WORLD_ROWS; eachRow++) {
                for (var eachCol = 0; eachCol < WORLD_COLS; eachCol++) {
                    var arrayIndex = colRowToArrayIndex(eachCol, eachRow);
                    if (worldGrid[arrayIndex] == WORLD_PLAYERSTART) {
                        worldGrid[arrayIndex] = WORLD_GROUND;
                        this.x = eachCol * WORLD_W + WORLD_W / 2;
                        this.y = eachRow * WORLD_H + WORLD_H / 2;
                        return;
                    }
                }
            }
            console.log("No player start found");
        };

        this.move = function () {
            var yMov = 0;
            var xMov = 0;
            if (this.keyHeld_Up) {
                this.y -= PLAYER_SPEED;
                yMov -= PLAYER_SPEED;
            }
            if (this.keyHeld_Down) {
                this.y += PLAYER_SPEED;
                yMov += PLAYER_SPEED;
            }
            if (this.keyHeld_Left) {
                this.x -= PLAYER_SPEED;
                xMov -= PLAYER_SPEED;
            }
            if (this.keyHeld_Right) {
                this.x += PLAYER_SPEED;
                xMov += PLAYER_SPEED;
            }

            warriorWorldHandling(this, xMov, yMov);
        };

        this.draw = function () {
            drawBitmapCenteredWithRotation(this.myWarriorPic, this.x, this.y, this.ang);
        };
    }
}