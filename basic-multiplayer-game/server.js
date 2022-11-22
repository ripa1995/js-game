var express = require('express');
var app = express();
var server = require('http').Server(app);

const players = new Map();

var star = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50
};

var scores = {
    blue: 0,
    red: 0
};

var teamMembersCounter = {
    blue: 0,
    red: 0
}

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);
    const team = chooseTeam();
    // create a new player and add it to our players object
    players.set(socket.id, createNewPlayer(socket.id, team));
    // send the players object to the new player
    const serializedMap = [...players.entries()];
    socket.emit('currentPlayers', serializedMap);
    // send the star object to the new player
    socket.emit('starLocation', star);
    // send the current scores
    socket.emit('scoreUpdate', scores);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players.get(socket.id));
    // handle socket disconnection
    socket.on('disconnect', function () {
        console.log('user disconnected');
        increaseTeamMembersCounter(players.get(socket.id).team, -1);
        // remove this player from our players object
        players.delete(socket.id);
        // emit a message to all players to remove this player
        io.emit('playerDisconnect', socket.id);
    });
    // when a player moves, update the player data
    socket.on('playerMovement', function (movementData) {
        updatePlayerMovement(socket.id, movementData)
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players.get(socket.id));
    });
    // when a star is collected, update score
    socket.on('starCollected', function () {
        // check player team 
        increaseScore(players.get(socket.id).team);
        changeStarPosition();
        // send new star position
        io.emit('starLocation', star);
        // send updated score
        io.emit('scoreUpdate', scores);
    });
});

server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});

function increaseScore(team) {
    if (!team) {return;}
    if (team === 'red') {
        scores.red += 10;
    } else {
        scores.blue += 10;
    }
}

function increaseTeamMembersCounter(team, amount) {
    if (!team) {return;}
    if (team === 'blue') {
        teamMembersCounter.blue += amount;
    } else {
        teamMembersCounter.red += amount;
    }
}

function chooseTeam() {
    const team = teamMembersCounter.blue <= teamMembersCounter.red ? 'blue' : 'red';
    increaseTeamMembersCounter(team, 1);
    return team;
}

function createNewPlayer(playerId, team) {
    return {
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId,
        team
    }
}

function changeStarPosition() {
    star.x = Math.floor(Math.random() * 700) + 50;
    star.y = Math.floor(Math.random() * 500) + 50;
}

function updatePlayerMovement(playerId, movementData) {
    players.get(playerId).x = movementData.x;
    players.get(playerId).y = movementData.y;
    players.get(playerId).rotation = movementData.rotation;
}