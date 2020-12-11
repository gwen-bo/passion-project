import timeOutScreen from '../assets/img/timeOut/timeOut.png'
import AlignGrid from '../js/utilities/alignGrid'
import AudioCue from '../assets/audio/Hé-ben-je-er-nog.mp3'

export class TimeOutScene extends Phaser.Scene{
    constructor(config){
      super(config);
    }

    init = (data) => {
        console.log(`timeOut scene INIT`);
    }

    preload(){
      this.load.spritesheet('timeOutScreen', timeOutScreen, { frameWidth: 737, frameHeight: 571 });
      this.load.audio('AudioCue', AudioCue);
  }

    create(){
      let timeOutMessage = this.add.sprite(0, 0, 'timeOutScreen', 0);
      this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 11, height: window.innerHeight, width: window.innerWidth})
      this.aGrid.placeAtIndex(126, timeOutMessage);
      this.anims.create({
        key: 'paused',
        frames: this.anims.generateFrameNumbers('timeOutScreen', { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
      });
      timeOutMessage.anims.play('paused');
      this.audio = this.sound.add('AudioCue', {loop: false});
      this.audio.play();
  }

    update(){
      
    }
}