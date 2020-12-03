export default class StartScene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

    $video_wrapper = document.querySelector('#video');

  // om de input van de webcam om te draaien
  flipPoseHorizontal = true;

  // game settings
  poseNet = undefined; 
  poses = [];
  state; 
  restart = false; 
  restartNext; 

  t = 0; 

  init = (data) => {
    console.log(`StartScene INIT`);
    this.state = "STAND_BY";
    this.t = 0; 
    this.$video_wrapper.style.display = "flex";

    this.$webcam = data.webcamObj;
    this.poseNet = data.poseNet;
    this.restart = data.restart;
    this.restartNext = data.restart;

    if(this.restart === true){
      this.scene.restart({ restart: false, webcamObj: this.$webcam, poseNet: this.poseNet})
    }
    this.$webcam.width = window.innerWidth;
    this.$webcam.height = window.innerHeight;
  }

  poseEstimation = async () => {
    const pose = await this.poseNet.estimateSinglePose(this.$webcam, {
        flipHorizontal: this.flipPoseHorizontal,
    });
    this.poses = this.poses.concat(pose);
    this.poses.forEach(({score, keypoints}) => {
      if(score > 0.4){
        if(this.state === "STAND_BY"){
          this.state = "PRESENT";
        }
        return; 
      }else if (score <= 0.05 ){
        this.state = "STAND_BY";
      }
    });
  }

  $video_closed; 
  $video_overgang;
  $video_open;

  create(){
    // console.log(`StartScene CREATE`);

    this.$video_closed = document.querySelector(`#closed`);
    this.$video_overgang = document.querySelector(`#overgang`);
    this.$video_open = document.querySelector(`#open`);

    this.$video_closed.style.display = "none";
    this.$video_overgang.style.display = "inline";
    this.$video_open.style.display = "none";
  }

  onEvent(){
    this.t++
    if(this.t === 3){
      console.log('time event', this.t);
      this.state = "READY";
      this.$video_wrapper.style.display = "none";
      this.scene.start('welcome', {restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet });    
    }
  }

  timedEvent = undefined; 
  timerActivated = false; 
  
  update(){
    console.log(this.state, 'timer', this.timerActivated);
    this.poseEstimation();

    switch(this.state){
      case "PRESENT": 
        // this.changeSourceActive();
        this.$video_closed.style.display = "none";
        this.$video_overgang.style.display = "none";
        this.$video_open.style.display = "inline";

        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });    
        this.state = "VERIFYING";
        this.timerActivated = true;
      break;

      case "VERIFYING": 
        this.$video_closed.style.display = "none";
        this.$video_overgang.style.display = "none";
        this.$video_open.style.display = "inline";
      break; 

      case "STAND_BY": 
        this.$video_closed.style.display = "inline";
        this.$video_overgang.style.display = "none";    
        this.$video_open.style.display = "none";        
    
        if(this.timerActivated === true){
          this.timerActivated = false; 
          this.timedEvent.remove();
        }
      break; 
    }
  }

}