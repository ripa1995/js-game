import Phaser from "phaser";
import initAnimations from "../anims/player"
import collidable from "../mixins/collidable";

class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x,y) {
        super(scene, x,y, 'player')
        scene.physics.add.existing(this);
        scene.add.existing(this);

        //Copy the values of all of the enumerable own properties from one or more source objects to a target object. Returns the target object
        Object.assign(this, collidable);

        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 500;
        this.playerSpeed = 200;
        this.jumpCount = 0;
        this.consecutiveJumps = 1;
        //https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.KeyboardPlugin.html#createCursorKeys__anchor
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.body.setSize(25, 35)
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);

        initAnimations(this.scene.anims); 
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update() {
        const {left , right, space} = this.cursors;
        //The justDown value allows you to test if this Key has just been pressed down or not.
        //When you check this value it will return true if the Key is down, otherwise false.
        //https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.JustDown__anchor
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
        //https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Body.html#onFloor__anchor
        const onFloor = this.body.onFloor();

        if (left.isDown) {
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
        } else if (right.isDown) {
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        if (isSpaceJustDown&& (onFloor || this.jumpCount < this.consecutiveJumps)) {
            this.jumpCount++;
            this.setVelocityY(-this.playerSpeed * 1.5);
        }

        if (onFloor) {
            this.jumpCount = 0;
        }

        onFloor ? 
            //https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Sprite.html#play__anchor
            this.body.velocity.x !== 0 ? 
                this.play('run',true) 
                : 
                this.play('idle',true)
            :
            this.play('jump', true);

    }
}

export default Player;