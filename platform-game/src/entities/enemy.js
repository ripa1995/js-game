import Phaser from "phaser";
import collidable from "../mixins/collidable";

class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x,y, key) {
        super(scene, x,y, key)
        scene.physics.add.existing(this);
        scene.add.existing(this);

        //Copy the values of all of the enumerable own properties from one or more source objects to a target object. Returns the target object
        Object.assign(this, collidable);

        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 500;
        this.speed = 150;

        this.body.setGravityY(this.gravity);
        this.setSize(20,45);
        this.setOffset(7,20);
        this.setImmovable(true);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1); 
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time, delta) {
        this.setVelocityX(20);
    }
}

export default Enemy;