import BaseScene from './baseScene';

class ScoreScene extends BaseScene {

    constructor(config) {
        super("score-scene", {...config, canGoBack: true});
    }

    //https://photonstorm.github.io/phaser3-docs/Phaser.Types.Scenes.html#.SceneCreateCallback
    create() {
        super.create();

        this.createScoreText()
    
    }

    createScoreText() {
        const BEST_SCORE = localStorage.getItem("bestScore");
        this.add.text(...this.screenCenter, `Best Score: ${BEST_SCORE || 0}`, this.fontOptions)
            .setOrigin(0.5);
    }


}

export default ScoreScene;