export default class WelcomeScene extends Phaser.Scene{
    constructor(config){
      super(config);
    }
  
    $video_wrapper = document.querySelector('#video');
  
    // om de input van de webcam om te draaien
    flipPoseHorizontal = true;

  
    // game settings
    poseNet = undefined; 
    poses = [];
    restart = false; 
    restartNext; 
  
    t = 0; 
  
    init = (data) => {
      console.log(`WelcomeScene INIT`);
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
      this.poses.forEach(({score}) => {
        if(score > 0.4){
            this.$video_closed.style.display = "none";
            this.$video_overgang.style.display = "none";
            this.$video_open.style.display = "inline";          
        }else if (score <= 0.05 ){
            this.$video_closed.style.display = "inline";
            this.$video_overgang.style.display = "none";    
            this.$video_open.style.display = "none";         
        }
      });
    }
  
    $video_closed; 
    $video_overgang;
    $video_open;
  
    create(){  
      this.$video_closed = document.querySelector(`#closed`);
      this.$video_overgang = document.querySelector(`#overgang`);
      this.$video_open = document.querySelector(`#open`);

      this.$video_closed.style.display = "none";
      this.$video_overgang.style.display = "inline";
      this.$video_open.style.display = "none";

      this.add.text(300, 100, 'Hey! Ben je er klaar voor? Laten we beginnen');
      this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    
    }
  
    begroeting; 
    preload(){
      // this.begroeting = this.load.audio('begroeting', 'assets/audio/SoundEffects/explosion.mp3');
    }

    t = 0; 
    onEvent(){
      this.t++
      if(this.t === 3){
        console.log('time event', this.t);
        this.$video_wrapper.style.display = "none";
        this.scene.start('tutorial1', {restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet });    
      }
    }

    
    update(){
      this.poseEstimation();
      // this.begroeting.once('complete', function(music){
      //   this.$video_wrapper.style.display = "none";
      //   this.scene.start('tutorial1', {restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet });    
      // });
    }
  
  }