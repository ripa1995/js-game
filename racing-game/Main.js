var canvas, canvasContext;

function updateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    //Cheat to control the car with mouse
    // carX = mouseX
    // carY = mouseY
}

function setUpInput() {
    canvas.addEventListener("mousemove", updateMousePos)

    document.addEventListener("keydown", keyPressed)
    document.addEventListener("keyup", keyReleased)
}

window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    var framesPerSecond = 30;
    setInterval(updateAll, 1000 / framesPerSecond);

    setUpInput()

    trackLoadImages()
    carImageLoad()

    carReset()
}

function updateAll() {
    moveAll();
    drawAll();
}

function moveAll() {
    carMove()

    carTrackHandling()
}

function drawAll() {
    drawTracks()
    drawCar()

}