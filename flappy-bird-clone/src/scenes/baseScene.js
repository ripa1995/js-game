import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

    constructor(key, config) {
        super(key)
        this.config = config;
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
    create() {
        this.createBackground();
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

export default BaseScene;