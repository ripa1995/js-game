import Phaser from 'phaser';

import PlayScene from './scenes/playScene';
import PreloadScene from './scenes/preloadScene';

const MAP_WIDTH = 1600;

const WIDTH = document.body.offsetWidth;
const HEIGHT = 600;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  zoomFactor: 1.5
}

const SCENES = [PreloadScene, PlayScene];
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
      debug: true,
      // gravity: {
      //   y: 200 //apply gravity to all objects in the scene
      // }
    }
  },
  //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html
  scene: initScenes()
}

new Phaser.Game(CONFIG);