import Phaser from "phaser";
import EffectManager from "../effects/effectManager";

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

        this.body.setSize(this.width/2, this.height/2);

        this.effectManager = new EffectManager(this.scene);
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

    fire(x,y, animsKey) {
        this.body.reset(x,y);
        this.activateProjectile(true);
        this.setVelocityX(this.speed);

        animsKey && this.play(animsKey, true);
    }

    deliversHit(target) {
        this.activateProjectile(false);
        const impactPosition = { x: this.x , y: this.y }
        this.body.reset(0,0);
        this.traveledDistance = 0;
        this.effectManager.playEffectOn('hit-effect', target, impactPosition);
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