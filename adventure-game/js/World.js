const WORLD_GROUND = 0;
const WORLD_WALL = 1;
const WORLD_PLAYERSTART = 2;
const WORLD_GOAL = 3;
const WORLD_DOOR = 4;
const WORLD_KEY = 5;

const WORLD_W = 50;
const WORLD_H = 50;
const WORLD_GAP = 2;
const WORLD_COLS = 16;
const WORLD_ROWS = 12;

var levelOne = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1,
    1, 5, 0, 4, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
    1, 0, 0, 1, 5, 1, 5, 0, 1, 1, 1, 1, 0, 1, 1, 1,
    1, 2, 0, 1, 5, 1, 5, 0, 4, 0, 4, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 5, 0, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 3, 0, 4, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

var worldGrid = [];

function returnTileTypeAtColRow(col, row) {
    if (col >= 0 && col < WORLD_COLS &&
        row >= 0 && row < WORLD_ROWS) {
        var worldIndexUnderCoord = colRowToArrayIndex(col, row)
        return worldGrid[worldIndexUnderCoord]
    } else {
        return WORLD_WALL
    }
}

function warriorWorldHandling(whichWarrior, xMov, yMov) {
    var warriorWorldCol = Math.floor(whichWarrior.x / WORLD_W);
    var warriorWorldRow = Math.floor(whichWarrior.y / WORLD_H);

    if (warriorWorldCol >= 0 && warriorWorldCol < WORLD_COLS &&
        warriorWorldRow >= 0 && warriorWorldRow < WORLD_ROWS) {
        var tileHere = returnTileTypeAtColRow(warriorWorldCol, warriorWorldRow)
        switch (tileHere) {
            case WORLD_GOAL:
                console.log(whichWarrior.name + " wins");
                loadLevel(levelOne)
                break;
            case WORLD_KEY:
                whichWarrior.keys++;
                replaceTileWithGround(warriorWorldCol,warriorWorldRow)
                break;
            case WORLD_DOOR:
                if (whichWarrior.keys > 0) {
                    whichWarrior.keys--
                    replaceTileWithGround(warriorWorldCol,warriorWorldRow)
                    break;
                }
            case WORLD_WALL: 
                whichWarrior.x -= xMov;
                whichWarrior.y -= yMov; 
        }
    }
}

function replaceTileWithGround(col,row) {
    var worldIndexUnderCoord = colRowToArrayIndex(col, row)
    worldGrid[worldIndexUnderCoord]=WORLD_GROUND
}

function colRowToArrayIndex(col, row) {
    return col + WORLD_COLS * row
}

function drawWorld() {
    var worldIndex = 0;
    var drawTileX = 0;
    var drawTileY = 0;
    for (var eachRow = 0; eachRow < WORLD_ROWS; eachRow++) {
        for (var eachCol = 0; eachCol < WORLD_COLS; eachCol++) {
            var tileKindHere = worldGrid[worldIndex];
            var useImg = worldPics[tileKindHere];
            if (isTileTransparent(tileKindHere)) {
                canvasContext.drawImage(worldPics[WORLD_GROUND], drawTileX, drawTileY)
            }
            canvasContext.drawImage(useImg, drawTileX, drawTileY)
            drawTileX += WORLD_W
            worldIndex++
        }
        drawTileY += WORLD_H
        drawTileX = 0;
    }
}

function isTileTransparent(tileKindHere) {
    return tileKindHere == WORLD_KEY || tileKindHere == WORLD_DOOR || tileKindHere == WORLD_GOAL;
}

