import Phaser from "phaser";
import SpriteEffect from "../effects/spriteEffect";

class Projectile extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x,y, key) {
        super(scene, x,y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 300;
        this.maxDistance = 200;
        this.traveledDistance = 0;

        this.cooldown = 1000; //ms

        this.damage = 10;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.traveledDistance += this.body.deltaAbsX();
        if (this.isOutOfRange()){
            this.activateProjectile(false);
            this.body.reset(0,0);
            this.traveledDistance = 0;
        }
    }

    fire(x,y) {
        this.body.reset(x,y);
        this.activateProjectile(true);
        this.setVelocityX(this.speed);
    }

    deliversHit(target) {
        this.activateProjectile(false);
        this.body.reset(0,0);
        this.traveledDistance = 0;
        new SpriteEffect(this.scene, 0,0, 'hit-effect').playOn(target);
    }

    activateProjectile(isActive) {
        this.setActive(isActive);
        this.setVisible(isActive);
    }

    isOutOfRange() {
        return this.traveledDistance && this.traveledDistance>=this.maxDistance
    }
}

export default Projectile;