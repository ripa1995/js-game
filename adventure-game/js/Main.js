var canvas, canvasContext;

var blueWarrior = new Warrior();

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    //Cheat to control the warrior with mouse
    // warriorX = mouseX
    // warriorY = mouseY
}

function setUpInput() {
    canvas.addEventListener("mousemove", updateMousePos)

    document.addEventListener("keydown", keyPressed)
    document.addEventListener("keyup", keyReleased)

    blueWarrior.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW);
}

window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    colorRect(0, 0, canvas.width, canvas.height, "black");
    colorText("LOADING IMAGES", canvas.width / 2, canvas.height / 2, "white")

    loadImages()
}

function imageLoadingDoneSoStartGame() {

    var framesPerSecond = 30;
    setInterval(updateAll, 1000 / framesPerSecond);

    setUpInput()
    loadLevel(levelOne)
}

function loadLevel(whichLevel) {
    worldGrid = whichLevel.slice();
    blueWarrior.reset(warriorPic, "blue")
}

function updateAll() {
    moveAll();
    drawAll();
}

function moveAll() {
    blueWarrior.move()
}

function drawAll() {
    drawWorlds()
    blueWarrior.draw()
}