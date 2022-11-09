import Phaser from 'phaser';
import MenuScene from './scenes/menuScene';
import PlayScene from './scenes/playScene';
import PreloadScene from './scenes/preloadScene';
import ScoreScene from './scenes/scoreScene';

const WIDTH = 800;
const HEIGHT = 600;

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT
}

const SCENES = [PreloadScene, MenuScene, PlayScene, ScoreScene];
const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => SCENES.map(createScene);

//https://photonstorm.github.io/phaser3-docs/Phaser.Types.Core.html#.GameConfig
const CONFIG = {
  //WebGL (Web graphics library) JS Api for rendering 2D/3D graphics
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
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