import Phaser from "phaser";
import collidable from "../mixins/collidable";
import anims from "../mixins/anims";

class Enemy extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x,y, key) {
        super(scene, x,y, key)
        scene.physics.add.existing(this);
        scene.add.existing(this);

        this.config = scene.config;

        //Copy the values of all of the enumerable own properties from one or more source objects to a target object. Returns the target object
        Object.assign(this, collidable);
        Object.assign(this, anims);

        this.init();
        this.initEvents();
    }

    init() {
        this.gravity = 500;
        this.speed = 50;
        this.timeFromLastTurn = 0;
        this.maxPatrolDistance = 200;
        this.currentPatrolDistance = 0;

        this.platformCollidersLayer = null;
        if (this.config.debug) {
            this.rayGraphics = this.scene.add.graphics({lineStyle: {width: 2, color: 0xaa00aa}});
        }
        this.body.setGravityY(this.gravity);
        this.setSize(20,45);
        this.setOffset(7,20);
        this.setImmovable(true);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1); 
        this.setVelocityX(this.speed);

        this.damage = 20;
        this.health = 40;
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(time) {
        if (this.getBounds().bottom > this.config.height) {
            this.scene.events.removeListener(Phaser.Scenes.Events.UPDATE, this.update, this);
            this.setActive(false);
            if (this.config.debug) {
                this.rayGraphics.clear();
            }
            this.destroy();
            return;
        }
        
        this.patrol(time)
    }

    patrol(time) {
        if (!this.body || !this.body.onFloor()) {
            return ;
        }

        this.currentPatrolDistance += this.body.deltaAbsX();

        const { ray, hasHit } = this.raycast(this.body, this.platformCollidersLayer, {precision: 1, steepnes: 0.2});

        if ((!hasHit || this.currentPatrolDistance >= this.maxPatrolDistance) 
                && this.timeFromLastTurn + 100 < time) {
            this.setFlipX(!this.flipX);
            this.setVelocityX(this.speed = -this.speed);
            this.timeFromLastTurn = time;
            this.currentPatrolDistance = 0;
        }

        if (this.config.debug && ray) {
            this.rayGraphics.clear();
            this.rayGraphics.strokeLineShape(ray);
        }
    }

    setPlatformColliders(platformCollidersLayer) {
        this.platformCollidersLayer = platformCollidersLayer;
    }

    takesHit(source) {
        source.deliversHit(this);

        this.health -= source.damage;
        if (this.health <= 0) {
            this.setTint(0xff0000);
            this.setVelocity(0,-200);
            this.body.checkCollision.none = true;
            this.setCollideWorldBounds(false);
        }
    }
}

export default Enemy;