import BaseScene from './baseScene';

class CreditScene extends BaseScene {

    constructor(config) {
        super("credit-scene", {...config, canGoBack: true});
        this.menu = [
            {
                scene: null,
                text: 'Thank you for playing!'
            }
        ];
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
    create() {
        super.create();

        this.createMenu(this.menu, () => {});
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
    //default: 60fps i.e. update executed 60 times per second
    update(time /* ms time since first update */, delta /* ms delta time since last update*/) {
        //this.scene.start('play-scene')
    }
}

export default CreditScene;