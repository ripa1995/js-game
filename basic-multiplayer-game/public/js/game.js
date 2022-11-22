var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('ship', './assets/spaceShips_001.png');
    this.load.image('otherPlayer', 'assets/enemyBlack5.png');
    this.load.image('star', 'assets/star_gold.png');
}

function create() {
    this.socket = io();
    this.otherPlayers = this.physics.add.group();
    this.socket.on('currentPlayers', (players) => {
        players.forEach((val) => {
            if (val[0] === this.socket.id) {
                addPlayer(this, val[1]);
            } else {
                addOtherPlayers(this, val[1]);
            }
        })
    });
    this.socket.on('newPlayer', function (playerInfo) {
        addOtherPlayers(this, playerInfo);
    });
    this.socket.on('playerDisconnect', function (playerId) {
        this.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
            }
        });
    });
    this.socket.on('playerMoved', (playerInfo) => {
        this.otherPlayers.getChildren().forEach((otherPlayer) => {
            if (playerInfo.playerId === otherPlayer.playerId) {
                otherPlayer.setRotation(playerInfo.rotation);
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            }
        });
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
    this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });

    this.socket.on('scoreUpdate', (scores) => {
        this.blueScoreText.setText('Blue: ' + scores.blue);
        this.redScoreText.setText('Red: ' + scores.red);
    });

    this.socket.on('starLocation', (starLocation) => {
        handleStarMessage(this, starLocation);
    });
}

function update() {
    if (this.ship) {
        handleMovement(this);
        // emit player movement
        sendMovementInformations(this)
        // save old position data
        this.ship.oldPosition = {
            x: this.ship.x,
            y: this.ship.y,
            rotation: this.ship.rotation
        };

        this.physics.world.wrap(this.ship, 5);
    }
}

function handleStarMessage(self, starLocation) {
    if (self.star) self.star.destroy();
    self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
    self.physics.add.overlap(self.ship, self.star, function () {
        self.socket.emit('starCollected');
    }, null, self);
}

function sendMovementInformations(self) {
    var x = self.ship.x;
    var y = self.ship.y;
    var r = self.ship.rotation;
    if (self.ship.oldPosition && (x !== self.ship.oldPosition.x || y !== self.ship.oldPosition.y || r !== self.ship.oldPosition.rotation)) {
        self.socket.emit('playerMovement', { x: self.ship.x, y: self.ship.y, rotation: self.ship.rotation });
    }
}

function handleMovement(self) {
    if (self.cursors.left.isDown) {
        self.ship.setAngularVelocity(-150);
    } else if (self.cursors.right.isDown) {
        self.ship.setAngularVelocity(150);
    } else {
        self.ship.setAngularVelocity(0);
    }

    if (self.cursors.up.isDown) {
        self.physics.velocityFromRotation(self.ship.rotation + 1.5, 100, self.ship.body.acceleration);
    } else {
        self.ship.setAcceleration(0);
    }
}

function addPlayer(self, playerInfo) {
    self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    setColorByTeam(self.ship, playerInfo.team);
    self.ship.setDrag(100);
    self.ship.setAngularDrag(100);
    self.ship.setMaxVelocity(200);
}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    setColorByTeam(otherPlayer, otherPlayer.team);
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
}

function setColorByTeam(gameObject, team) {
    if (team === 'blue') {
        gameObject.setTint(0x0000ff);
    } else {
        gameObject.setTint(0xff0000);
    }
}