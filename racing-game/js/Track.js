const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYERSTART = 2;
const TRACK_GOAL = 3;
const TRACK_TREE = 4;
const TRACK_FLAG = 5;

const TRACK_W = 40;
const TRACK_H = 40;
const TRACK_GAP = 2;
const TRACK_COLS = 20;
const TRACK_ROWS = 15;

var trackGrid = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
    1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1,
    1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 5, 0, 0, 0, 1,
    1, 0, 0, 1, 1, 4, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 1, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
    1, 0, 2, 0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0, 1, 1, 4,
    1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 4,
    1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1,
    1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 1,
    1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 0, 0, 3, 0, 0, 0, 0, 1, 1, 4, 1, 1, 0, 0, 0, 0, 1, 1,
    1, 1, 1, 0, 3, 0, 0, 0, 1, 1, 4, 4, 4, 1, 1, 0, 0, 1, 1, 4,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 1, 1, 1, 1, 4, 4,
];

function isObstacleAtColRow(col, row) {
    if (col >= 0 && col < TRACK_COLS &&
        row >= 0 && row < TRACK_ROWS) {
        var trackIndexUnderCoord = colRowToArrayIndex(col, row)
        return trackGrid[trackIndexUnderCoord] != TRACK_ROAD
    } else {
        return false
    }
}

function carTrackHandling() {
    var carTrackCol = Math.floor(carX / TRACK_W);
    var carTrackRow = Math.floor(carY / TRACK_H);
    
    if (carTrackCol >= 0 && carTrackCol < TRACK_COLS &&
        carTrackRow >= 0 && carTrackRow < TRACK_ROWS) {
        if (isObstacleAtColRow(carTrackCol, carTrackRow)) {
            carX -= Math.cos(carAng) * carSpeed;
            carY -= Math.sin(carAng) * carSpeed;
            carSpeed *= -0.5;
        }
    }
}

function colRowToArrayIndex(col, row) {
    return col + TRACK_COLS * row
}

function drawTracks() {
    var trackIndex = 0;
    var drawTileX = 0;
    var drawTileY = 0;
    for (var eachRow = 0; eachRow < TRACK_ROWS; eachRow++) {
        for (var eachCol = 0; eachCol < TRACK_COLS; eachCol++) {
            var tileKindHere = trackGrid[trackIndex];
            var useImg = trackPics[tileKindHere];
            canvasContext.drawImage(useImg, drawTileX, drawTileY)
            drawTileX += TRACK_W
            trackIndex++
        }
        drawTileY += TRACK_H
        drawTileX = 0;
    }
}
