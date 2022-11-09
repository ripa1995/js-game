import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {

    constructor() {
        super("preload-scene")
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.ScenePreloadCallback
    //Loading assets, such as images, music, animations, ...
    preload() {
        //this context -- scene
        //contains functions and properties we can use
        this.load.image('sky', './assets/sky.png')
        this.load.image('bird', './assets/bird.png')
        this.load.image('pipe', './assets/pipe.png')
        this.load.image('pause', './assets/pause.png')
    }

    create() {
        this.scene.start('menu-scene')
    }
}

export default PreloadScene;