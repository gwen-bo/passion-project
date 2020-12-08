import timeOutScreen from '../assets/img/timeOut/timeOut.png'
import AlignGrid from '../js/utilities/alignGrid'

export class TimeOutScene extends Phaser.Scene{
    constructor(config){
      super(config);
    }

    currentScene = 'gameplay'; 

    init = (data) => {
        console.log(`timeOut scene INIT`);
        this.currentScene = data.currentScene;
    }

    preload(){
        this.load.spritesheet('timeOutScreen', timeOutScreen, { frameWidth: 737, frameHeight: 571 });
    }

    create(){
        let timeOutMessage = this.add.sprite(0, 0, 'timeOutScreen', 0);
        this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 11, height: 1710, width: 1030})
        this.aGrid.placeAtIndex(126, timeOutMessage);
        this.anims.create({
          key: 'paused',
          frames: this.anims.generateFrameNumbers('timeOutScreen', { start: 0, end: 1 }),
          frameRate: 3,
          repeat: -1
        });
        timeOutMessage.anims.play('paused');
    }
    
    update(){
        
    }
  }