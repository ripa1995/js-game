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
  //x,y will be canvas coordinates, hence giving 0,0 will print only right bottom quarter of the image, since origin coordinates of the image default to its center.
  //with .setOrigin we change the origin of the image. where 0,0 is top left corner of the image, 1,1 is bottom right
  //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#image__anchor
  //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Image.html#setOrigin__anchor
  this.add.image(0,0, 'sky').setOrigin(0,0);
}

new Phaser.Game(CONFIG);