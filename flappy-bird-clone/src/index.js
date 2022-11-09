import Phaser from 'phaser';

//https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
const CONFIG = {
  //WebGL (Web graphics library) JS Api for rendering 2D/3D graphics
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //Arcade physics plugin, manages physics simulation
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: {
        y: 200 //apply gravity to all objects in the scene
      }
    }
  },
  //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html
  scene: {
    preload, //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.ScenePreloadCallback
    create, //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
    update //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
  }
}

const X_VELOCITY = 200;
const DEFAULT_Y_VELOCITY = 0;
const DEFAULT_X_POS = CONFIG.width / 10;
const DEFAULT_Y_POS = CONFIG.height / 2;

let bird = null;
let totalDelta = null;
let flapVelocity = 250;

//Loading assets, such as images, music, animations, ...
function preload() {
  //this context -- scene
  //contains functions and properties we can use
  this.load.image('sky', './assets/sky.png')
  this.load.image('bird', './assets/bird.png')
}

//Initialising the app
function create() {
  //x,y,key of the image
  //x,y will be canvas coordinates, hence giving 0,0 will print only right bottom quarter of the image, since origin coordinates of the image default to its center.
  //with .setOrigin we change the origin of the image. where 0,0 is top left corner of the image, 1,1 is bottom right
  //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#image__anchor
  //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Image.html#setOrigin__anchor
  this.add.image(0, 0, 'sky').setOrigin(0, 0);
  //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#sprite__anchor
  //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Sprite.html
  bird = this.physics.add.sprite(DEFAULT_X_POS, DEFAULT_Y_POS, 'bird').setOrigin(0); //if y is missing defaults to X
  //add gravity, it increases body velocity
  //Acceleration due to gravity (specific to this Body), in pixels per second squared. Total gravity is the sum of this vector and the simulation's gravity.
  //https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Body.html#gravity
  //bird.body.gravity.y = 200; //px per seconds of accelleration. Sums up to scene gravity, does not replace it.

  //add velocity -- affected by gravity as well
  //The Body's velocity, in pixels per second
  //https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Body.html#velocity
  bird.body.velocity.x = X_VELOCITY;

  //add listener on mouse and space click
  //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#input__anchor
  this.input.on('pointerdown', flap)
  this.input.keyboard.on('keydown_SPACE', flap)
}

//default: 60fps i.e. update executed 60 times per second
function update(time /* ms time since first update */, delta /* ms delta time since last update*/) {
  if (bird.y < 0 || bird.y > CONFIG.height) {
    resetBird();
  }
  if (bird.x <= 0) {
    bird.body.velocity.x = X_VELOCITY;
  }
  if (bird.x >= CONFIG.width - bird.width) {
    bird.body.velocity.x = -X_VELOCITY;
  }

}

function resetBird() {
  bird.y = DEFAULT_Y_POS;
  bird.x = DEFAULT_X_POS;
  bird.body.velocity.x = X_VELOCITY;
  bird.body.velocity.y = DEFAULT_Y_VELOCITY;
}

function flap() {
  bird.body.velocity.y -= flapVelocity;
}


new Phaser.Game(CONFIG);