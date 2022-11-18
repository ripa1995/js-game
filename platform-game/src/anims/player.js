export default anims => {
    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('player', {start: 0, end: 8}),
        frameRate: 8,
        repeat: -1
    })
    //https://photonstorm.github.io/phaser3-docs/Phaser.Animations.AnimationState.html#create__anchor
    anims.create({
        key: 'run',
        //https://photonstorm.github.io/phaser3-docs/Phaser.Animations.AnimationState.html#generateFrameNumbers__anchor
        frames: anims.generateFrameNumbers('player', {start: 11, end: 16}),
        frameRate: 8,
        repeat: -1
    })
    anims.create({
        key: 'jump',
        frames: anims.generateFrameNumbers('player', {start: 17, end: 23}),
        frameRate: 4,
        repeat: 0
    })
    anims.create({
        key: 'throw',
        frames: anims.generateFrameNumbers('player-throw', {start: 0, end: 7}),
        frameRate: 14,
        repeat: 0
    })
}