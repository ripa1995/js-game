import Phaser from 'phaser';

import PlayScene from './scenes/playScene';
import PreloadScene from './scenes/preloadScene';
import MenuScene from './scenes/menuScene';

const WIDTH = 800;
const HEIGHT = 600;

const ZOOM_FACTOR = 1;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  zoomFactor: ZOOM_FACTOR,
  debug: false,
  leftTopCorner: {
    x: (WIDTH - (WIDTH/ZOOM_FACTOR)) / 2,
    y: (HEIGHT - (HEIGHT/ZOOM_FACTOR)) / 2
  },
  rightTopCorner: {
    x: (WIDTH/ZOOM_FACTOR) + (WIDTH - (WIDTH/ZOOM_FACTOR)) / 2,
    y: (HEIGHT - (HEIGHT/ZOOM_FACTOR)) / 2
  },
  rightBottomCorner: {
    x: (WIDTH/ZOOM_FACTOR) + (WIDTH - (WIDTH/ZOOM_FACTOR)) / 2,
    y: (HEIGHT/ZOOM_FACTOR) + (HEIGHT - (HEIGHT/ZOOM_FACTOR)) / 2,
  }
}

const SCENES = [PreloadScene, MenuScene, PlayScene];
const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => SCENES.map(createScene);

//https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
const CONFIG = {
  //WebGL (Web graphics library) JS Api for rendering 2D/3D graphics
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    //Arcade physics plugin, manages physics simulation
    default: 'arcade',
    arcade: {
      debug: SHARED_CONFIG.debug,
      // gravity: {
      //   y: 200 //apply gravity to all objects in the scene
      // }
    }
  },
  //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html
  scene: initScenes()
}

new Phaser.Game(CONFIG);