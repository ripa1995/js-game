import BaseScene from './baseScene';

class MenuScene extends BaseScene {

    constructor(config) {
        super("menu-scene", config);
        this.menu = [
            {
                scene: 'play-scene',
                text: 'Play'
            },
            {
                scene: 'level-scene',
                text: 'Levels'
            },
            {
                scene: null,
                text: 'Exit'
            }
        ];
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
    create() {
        super.create();

        this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html#update
    //default: 60fps i.e. update executed 60 times per second
    update(time /* ms time since first update */, delta /* ms delta time since last update*/) {
        //this.scene.start('play-scene')
    }

    setupMenuEvents(menuItem) {
        const textGameObject = menuItem.textGameObject;
        textGameObject.setInteractive();
        textGameObject.on('pointerover', () => {
            textGameObject.setStyle({fill: 'yellow'});
        })
        textGameObject.on('pointerout', () => {
            textGameObject.setStyle({fill: '#713E01'});
        })
        textGameObject.on('pointerup', () => {
            menuItem.scene && this.scene.start(menuItem.scene);
            if (menuItem.text === 'Exit') {
                this.game.destroy(true);
            }
        })
    }
}

export default MenuScene;