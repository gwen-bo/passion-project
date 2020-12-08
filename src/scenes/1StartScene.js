// import PoseNetPlugin from "../index";
import eye from '../assets/img/start/eye.png'
import AlignGrid from '../js/utilities/alignGrid'

export class StartScene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  // om de input van de webcam om te draaien
  // flipPoseHorizontal = true;

  // game settings
  // poseNet = undefined; 
  // poses = [];
  state; 
  restart; 
  restartNext; 

  t = 0; 

  // init = (data) => {
    init = (data) => {

    console.log(`StartScene INIT`);
    this.state = "STAND_BY";
    this.t = 0; 

    // this.$webcam = data.webcamObj;
    // this.poseNet = data.poseNet;
    this.restart = data.restart;
    this.restartNext = data.restart;
      console.log(this.restart);
    if(this.restart === true){
      console.log('restarting');
      this.scene.restart({ restart: false})
    }
    // this.$webcam.width = window.innerWidth;
    // this.$webcam.height = window.innerHeight;
  }


  eyeObj; 
  posenetplugin;
  preload(){
    this.load.spritesheet('eye', eye, { frameWidth: 800, frameHeight: 598 });
  }
  
  create(){
    // console.log(`StartScene CREATE`);
    this.posenetplugin = this.plugins.get('PoseNetPlugin');
    this.state = "STAND_BY";
    this.eyeObj = this.add.sprite(0, 0, 'eye', 0);
    this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 11, height: 1710, width: 1030})
    // this.aGrid.showNumbers();
    this.anims.create({
      key: 'opening',
      frames: this.anims.generateFrameNumbers('eye', { start: 0, end: 7 }),
      frameRate: 15,
      repeat: 0,
    });
    this.anims.create({
      key: 'closed',
      frames: this.anims.generateFrameNumbers('eye', { start: 0, end: 0 }),
      frameRate: 3,
      repeat: -1
    }); 
    this.eyeObj.anims.play('closed');
    this.aGrid.placeAtIndex(126, this.eyeObj);
  }

  onEvent(){
    this.t++
    if(this.t === 3){
      console.log('time event', this.t);
      this.state = "READY";
      // this.scene.start('welcome', {restart: this.restartNext});    
     }
  }

  timedEvent = undefined; 
  timerActivated = false; 

  // PLUGIN
  handlePoses(poses){
    if(poses === false){
        return; 
    }
    poses.forEach(({score}) => {
      if(score >= 0.4){
        if(this.state === "STAND_BY"){
          this.switchState("PRESENT");
        }
        return; 
      }else if (score <= 0.05 ){
        this.switchState("STAND_BY");
      }
    })
  }

  fetchPoses = async () => {
    let poses = await this.posenetplugin.poseEstimation();
    this.handlePoses(poses);
  }

  switchState(value){
    this.state = value; 
  }
 
  update(){
    console.log(this.state, 'timer:', this.timerActivated);
    this.fetchPoses();

    switch(this.state){
      case "PRESENT": 
        this.eyeObj.anims.play('opening');
        this.state = "VERIFYING";
      break;
      case "VERIFYING":
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });    
        this.timerActivated = true;
      break;
      case "READY": 
        this.scene.start('welcome', {restart: this.restartNext});    
      break; 
      case "STAND_BY":     
        this.eyeObj.anims.play('closed');
        if(this.timerActivated === true){
          this.timerActivated = false; 
          this.timedEvent.remove();
        }
      break; 
    }


  }

}