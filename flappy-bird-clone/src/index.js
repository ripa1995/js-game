import Phaser from 'phaser';

//https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
const CONFIG = {
  //WebGL (Web graphics library) JS Api for rendering 2D/3D graphics
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //Arcade physics plugin, manages physics simulation
    default: 'arcade'
  },
  //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html
  scene: {
    preload, //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.ScenePreloadCallback
    create //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
  }
}

//Loading assets, such as images, music, animations, ...
function preload() {
  //this context -- scene
  //contains functions and properties we can use
  this.load.image('sky', './assets/sky.png')
}

//Initialising the app
function create() {
  //x,y,key of the image
  //x,y will be image center coordinates, hence giving 0,0 will print only right bottom quarter of the image.
  this.add.image(CONFIG.width/2,CONFIG.height/2, 'sky');
}

new Phaser.Game(CONFIG);