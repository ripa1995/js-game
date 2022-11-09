import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {

    constructor(config) {
        super("menu-scene")
        this.config = config;
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
    create() {
        this.createBackground();
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
    //default: 60fps i.e. update executed 60 times per second
    update(time /* ms time since first update */, delta /* ms delta time since last update*/) {
        this.scene.start('play-scene')
    }

    createBackground() {
        //x,y,key of the image
        //x,y will be canvas coordinates, hence giving 0,0 will print only right bottom quarter of the image, since origin coordinates of the image default to its center.
        //with .setOrigin we change the origin of the image. where 0,0 is top left corner of the image, 1,1 is bottom right
        //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#image__anchor
        //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Image.html#setOrigin__anchor
        this.add.image(0, 0, 'sky').setOrigin(0, 0);
    }
}

export default MenuScene;