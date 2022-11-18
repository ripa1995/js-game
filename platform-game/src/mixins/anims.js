export default {
    isPlayingAnims(animsKeys) {
       return this.anims.isPlaying && this.anims.getCurrentKey() === animsKeys
    }
}