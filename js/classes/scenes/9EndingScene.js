export default class EndingScene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  init = async(data) => {
    this.t = 0; 
    console.log(`EndingScene INIT`);
    this.$webcam = data.webcamObj;
    this.poseNet = data.poseNet;
  }


  create(){
    let txt = this.add.text(500, 500, 'Goed gedaan! We zitten weer vol energie!');
    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    

  }

  t = 0; 
  onEvent(){
    console.log('time event started');
    this.t++
    if(this.t === 3){
      console.log('time event', this.t);
      // this.scene.stop();
      this.scene.start('start', { restart: true, webcamObj: this.$webcam, poseNet: this.poseNet});    
    }
  }
  
  
  update(){
  }

}