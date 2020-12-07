// import PoseNetPlugin from "../index";
import stand_by from '../assets/img/start/stand_by.png'
import AlignGrid from '../js/utilities/alignGrid'

export class StartScene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  // om de input van de webcam om te draaien
  flipPoseHorizontal = true;

  // game settings
  // poseNet = undefined; 
  // poses = [];
  state; 
  restart = false; 
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

    if(this.restart === true){
      this.scene.restart({ restart: false})
    }
    // this.$webcam.width = window.innerWidth;
    // this.$webcam.height = window.innerHeight;
  }

  // poseEstimation = async () => {
  //   const pose = await this.poseNet.estimateSinglePose(this.$webcam, {
  //       flipHorizontal: this.flipPoseHorizontal,
  //   });
  //   this.poses = this.poses.concat(pose);
  //   this.poses.forEach(({score, keypoints}) => {
  //     if(score > 0.4){
  //       if(this.state === "STAND_BY"){
  //         this.state = "PRESENT";
  //       }
  //       return; 
  //     }else if (score <= 0.05 ){
  //       this.state = "STAND_BY";
  //     }
  //   });
  // }


  eye; 
  preload(){
    this.load.image('stand_by', stand_by);
  }
  create(){
    // console.log(`StartScene CREATE`);
    this.state = "STAND_BY";
    this.eye = this.add.image(0, 0, 'stand_by');
    this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 11, height: this.cameras.main.worldView.height, width: this.cameras.main.worldView.width})
    // this.aGrid.showNumbers();
    this.aGrid.placeAtIndex(126, this.eye);
  }

  onEvent(){
    this.t++
    if(this.t === 3){
      console.log('time event', this.t);
      this.state = "READY";
     }
  }

  timedEvent = undefined; 
  timerActivated = false; 

  // PLUGIN
  handlePoses(poses){

    poses.forEach(({score, keypoints}) => {
      if(score >= 0.4){
          this.switchState("PRESENT");
        return; 
      }else if (score <= 0.05 ){
        this.switchState("STAND_BY");
      }
    })
  }

  switchState(value){
    this.state = value; 
  }

  update(){
    console.log(this.state, 'timer:', this.timerActivated);

    // PROBLEEM MET PLUGIN??
    this.posenet.poseEstimation();
    this.events.on('poses', this.handlePoses, this);

    switch(this.state){
      case "PRESENT": 
        // this.changeSourceActive();

        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });    
        this.state = "VERIFYING";
        this.timerActivated = true;
      break;

      case "READY": 
        this.scene.start('welcome', {restart: this.restartNext});    
      break; 

      case "STAND_BY":     
        if(this.timerActivated === true){
          this.timerActivated = false; 
          this.timedEvent.remove();
        }
      break; 
    }


  }

}