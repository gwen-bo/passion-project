import endingscreen from '../assets/img/einde/einde_sprite.png'

import AlignGrid from '../js/utilities/alignGrid'

export class EndingScene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  init = async() => {
    this.t = 0; 
    console.log(`EndingScene INIT`);
  }

  preload(){
    this.load.spritesheet('endingscreen', endingscreen, { frameWidth: 800, frameHeight: 598 });
  }

  create(){
    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    

    let ending = this.add.sprite(0, 0, 'endingscreen', 0);
    this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 11, height: 1710, width: 1030})
    this.aGrid.placeAtIndex(126, ending);
    this.anims.create({
      key: 'ending',
      frames: this.anims.generateFrameNumbers('endingscreen', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
    });
    ending.anims.play('ending');
  }

  t = 0; 
  onEvent(){
    this.t++
    if(this.t >= 10){
      this.scene.start('start', {restart: true});    
    }
  }
  
  update(){
  }

}