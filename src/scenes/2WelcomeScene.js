// import title1 from '../assets/img/titlescreen/title.png'
// import title2 from '../assets/img/titlescreen/title2.png'
import titlescreen from '../assets/img/titlescreen/titlescreen.png'
import welcomeSound from '../assets/audio/welcome.mp3'

import AlignGrid from '../js/utilities/alignGrid'

export class WelcomeScene extends Phaser.Scene{
    constructor(config){
      super(config);
    }
    
    // om de input van de webcam om te draaien
    flipPoseHorizontal = true;

  
    // game settings
    // poseNet = undefined; 
    // poses = [];
    restart = false; 
    restartNext; 
  
    t = 0; 
  
      init = (data) => {

      console.log(`WelcomeScene INIT`);
      this.t = 0; 
      // this.$video_wrapper.style.display = "flex";
  
      // this.$webcam = data.webcamObj;
      // this.poseNet = data.poseNet;
      this.restart = data.restart;
      this.restartNext = data.restart;
  
      if(this.restart === true){
        // this.scene.restart({ restart: false, webcamObj: this.$webcam, poseNet: this.poseNet})
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
    //   this.poses.forEach(({score}) => {
    //     if(score > 0.4){
    //         this.$video_closed.style.display = "none";
    //         this.$video_overgang.style.display = "none";
    //         this.$video_open.style.display = "inline";          
    //     }else if (score <= 0.05 ){
    //         this.$video_closed.style.display = "inline";
    //         this.$video_overgang.style.display = "none";    
    //         this.$video_open.style.display = "none";         
    //     }
    //   });
    // }
  
    // $video_closed; 
    // $video_overgang;
    // $video_open;
  
    begroeting; 
    preload(){
      this.load.spritesheet('titlescreen', titlescreen, { frameWidth: 702, frameHeight: 947 });
      this.load.audio('welcomeSound', welcomeSound);

      // this.begroeting = this.load.audio('begroeting', 'assets/audio/SoundEffects/explosion.mp3');
    }
    
    create(){  
      this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    
      let title = this.add.sprite(0, 0, 'titlescreen', 0);
      this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 11, height: this.cameras.main.worldView.height, width: this.cameras.main.worldView.width})
      this.aGrid.placeAtIndex(126, title);
      this.anims.create({
        key: 'welcome',
        frames: this.anims.generateFrameNumbers('titlescreen', { start: 0, end: 1 }),
        frameRate: 3,
        repeat: -1
      });
      title.anims.play('welcome');
      
      this.welcomeSound = this.sound.add('welcomeSound', {loop: false});
      this.welcomeSound.play();

    }

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
  
    

    t = 0; 
    onEvent(){
      this.t++
      if(this.t === 3){
        console.log('time event', this.t);
        // this.scene.start('tutorial1', {restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet });    
        this.scene.start('tutorial1', {restart: this.restartNext});    
      }
    }

    
    update(){
      // this.poseEstimation();
      this.posenet.poseEstimation();
      this.events.on('poses', this.handlePoses, this);
  
      // this.begroeting.once('complete', function(music){
      //   this.scene.start('tutorial1', {restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet });    
      // });
    }
  
  }