import Phaser from 'phaser';
import BaseScene from './baseScene';


const Y_GRAVITY = 600;
const FLAP_VELOCITY = 350;
const PIPE_Y_DISTANCE_RANGE = [150, 250];
const PIPE_TO_RENDER = 4;
const PIPE_X_DISTANCE_RANGE = [400, 600];

class PlayScene extends BaseScene {

    constructor(config) {
        super("play-scene", config)
        this.bird = null;
        this.pipes = null;
        this.birdPosition = { x: this.config.width / 10, y: this.config.height / 2 };

        this.score = 0;
        this.scoreText = "";
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
    create() {
        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createBackButton();
        this.handleInputs();
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
    //default: 60fps i.e. update executed 60 times per second
    update(time /* ms time since first update */, delta /* ms delta time since last update*/) {
        this.checkGameStatus();
        this.recyclePipes();
    }

    createBird() {
        //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#sprite__anchor
        //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html
        this.bird = this.physics.add.sprite(this.birdPosition.x, this.birdPosition.y, 'bird').setOrigin(0); //if y is missing defaults to X
        //add gravity, it increases body velocity
        //Acceleration due to gravity (specific to this Body), in pixels per second squared. Total gravity is the sum of this vector and the simulation's gravity.
        //https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Body.html#gravity
        this.bird.body.gravity.y = Y_GRAVITY; //px per seconds of accelleration. Sums up to scene gravity, does not replace it.

        //add velocity -- affected by gravity as well
        //The Body's velocity, in pixels per second
        //https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Body.html#velocity
        //bird.body.velocity.x = 100;

        this.bird.setCollideWorldBounds(true);
    }

    createPipes() {
        //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#group__anchor
        this.pipes = this.physics.add.group();

        for (let i = 0; i < PIPE_TO_RENDER; i++) {
            //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Group.html#create__anchor
            const upperPipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true) //immovable property of a body. Whether this Body can be moved by collisions with another Body.
                .setOrigin(0, 1); //draw the image from bottom left corner
            const lowerPipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 0); //draw the image from top left corner  

            this.placePipe(upperPipe, lowerPipe)
        }

        this.pipes.setVelocityX(-200);
    }

    createColliders() {
        //https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Arcade.Factory#collider
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    createScore() {
        this.score = 0;
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: '32px', color: 'black' });
        const BEST_SCORE = localStorage.getItem("bestScore");
        this.add.text(16, 8 + this.scoreText.getBounds().bottom, `Best Score: ${BEST_SCORE || 0}`, { fontSize: '16px', color: 'black' });
    }

    createBackButton() {
        const PAUSE_BUTTON = this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
            .setScale(1.5)
            .setInteractive()
            .setOrigin(1);
        PAUSE_BUTTON.on('pointerdown', () => {
            this.physics.pause();
            this.scene.pause();
        })
    }

    handleInputs() {
        //add listener on mouse and space click
        //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#input__anchor
        this.input.on('pointerdown', this.flap, this)
        this.input.keyboard.on('keydown_SPACE', this.flap, this)
    }

    checkGameStatus() {
        if (this.bird.getBounds().top <= 0 || this.bird.getBounds().bottom >= this.config.height) {
            this.gameOver();
        }
    }

    placePipe(uPipe, lPipe) {
        const rightMostPipeX = this.getRightMostPipe();
        let pipeVerticalDistance = Phaser.Math.Between(...PIPE_Y_DISTANCE_RANGE);
        let pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance)
        let pipeHorizontalDistance = Phaser.Math.Between(...PIPE_X_DISTANCE_RANGE);

        uPipe.x = rightMostPipeX + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;

        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + pipeVerticalDistance;
    }

    recyclePipes() {
        let tempPipes = [];
        this.pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right <= 0) {
                //recycle pipe
                //get upper and lower pipe that are out of the bounds
                tempPipes.push(pipe);
                if (tempPipes.length == 2) {
                    this.placePipe(...tempPipes);
                    this.increaseScore();
                    this.saveBestScore();
                    tempPipes = [];
                }
            }
        })
    }

    getRightMostPipe() {
        let rightMostPipeX = 0;

        this.pipes.getChildren().forEach(pipe => {
            rightMostPipeX = Math.max(pipe.x, rightMostPipeX);
        });

        return rightMostPipeX;
    }

    saveBestScore() {
        const BEST_SCORE_TEXT = localStorage.getItem('bestScore');
        const BEST_SCORE = BEST_SCORE_TEXT && parseInt(BEST_SCORE_TEXT, 10);

        if (!BEST_SCORE || this.score > BEST_SCORE) {
            localStorage.setItem("bestScore", this.score);
        }
    }

    gameOver() {
        //https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Arcade.ArcadePhysics#pause
        //pause the simulation
        this.physics.pause();
        this.bird.setTint(0xff0000);

        this.saveBestScore();

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                //https://newdocs.phaser.io/docs/3.55.2/Phaser.Scene#scene
                //https://newdocs.phaser.io/docs/3.55.2/Phaser.Scenes.ScenePlugin#restart
                //restart this scene
                this.scene.restart();
            },
            loop: false
        })
    }

    flap() {
        this.bird.body.velocity.y -= FLAP_VELOCITY;
    }

    increaseScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
    }

}

export default PlayScene;