import voetR from '../assets/img/keypoints/voetR.png'
import voetL from '../assets/img/keypoints/voetL.png'
import hart1 from '../assets/img/game/sprites/hart1.png'

export class Tutorial2_goal extends Phaser.Scene{
  constructor(config){
    super(config);
  }
  // $webcam = document.querySelector('#webcam');

  // om de input van de webcam om te draaien
  // flipPoseHorizontal = true;

  // beginHeight = 300; 
  // beginWidth = 600; 
  // endHeight = window.innerHeight - 300;
  // endWidth = window.innerWidth - 600;
  // margeWidth =  this.endWidth - this.beginWidth; 
  // margeHeight = this.endHeight - this.beginHeight; 

  // poseNet = undefined; 
  // poses = [];
  restart; 
  restartNext; 

  init = async (data) => {
    // console.log(data);
    // this.$webcam = data.webcamObj;
    // this.poseNet = data.poseNet;

    console.log(`TutorialScene 2 INIT`);
    // console.log(this.$webcam, this.poseNet);

    // this.$webcam.width = window.innerWidth;
    // this.$webcam.height = window.innerHeight;
    this.restart = data.restart;
    this.restartNext = data.restart;

    this.skeleton = {
      "leftWrist": {part: "leftWrist", x: 400, y: 500},
      "rightWrist": {part: "rightWrist", x: 600, y: 500},
      "leftKnee": {part: "leftKnee", x: 600, y: 500},
      "rightKnee": {part: "rightKnee", x: 600, y: 500}
    };


    if(this.restart === true){
      console.log('restarting');
      // this.scene.restart({ restart: false, webcamObj: this.$webcam, poseNet: this.poseNet})
      this.scene.restart({ restart: false})
    }

    // this.poseEstimation();
  }

  // poseEstimation = async () => {
  //   // console.log('pose estimatio - tut2 scene');
  //   const pose = await this.poseNet.estimateSinglePose(this.$webcam, {
  //       flipHorizontal: this.flipPoseHorizontal,
  //   });
    
  //   this.poses = this.poses.concat(pose);
  //   this.poses.forEach(({score, keypoints}) => {
  //     // console.log('pose is being detected', score)
  //     if(score > 0.4){
  //       this.drawKeypoints(keypoints);
  //     }
  //   });
  // }

  skeleton = {
    "leftWrist": {part: "leftWrist", x: 400, y: 500},
    "rightWrist": {part: "rightWrist", x: 600, y: 500},
    "leftKnee": {part: "leftKnee", x: 600, y: 500},
    "rightKnee": {part: "rightKnee", x: 600, y: 500}
  };

  // eventueel ook op andere javascript file 
  drawKeypoints = (keypoints, scale = 1) => {
    for (let i = 0; i < keypoints.length; i++) {
        this.handleKeyPoint(keypoints[i], scale);
    }
  }

  handleKeyPoint = (keypoint, scale) => {
    if(!(keypoint.part === "leftKnee" || keypoint.part === "rightKnee" )) {
        return;
    }
    if(keypoint.score <= 0.15){
      console.log('bad keypoint', keypoint.score);
        return;
    }

    let skeletonPart = this.skeleton[keypoint.part];
    const {y, x} = keypoint.position;
    skeletonPart.x += (x - skeletonPart.x) / 10;
    skeletonPart.y += (y - skeletonPart.y) / 10;
  };

  preload(){
    this.load.spritesheet('hart1', hart1, { frameWidth: 337, frameHeight: 409 });
    this.load.image('voetR', voetR);
    this.load.image('voetL', voetL);
  }


  keypointsGameOjb = {
    leftWrist: undefined,
    rightWrist: undefined, 
    leftKnee: undefined, 
    rightKnee: undefined, 
  }


  footLeft = undefined; 
  footRight = undefined; 

  posenetplugin;
  create(){
    this.posenetplugin = this.plugins.get('PoseNetPlugin');

    this.keypointsGameOjb.leftKnee = this.add.image(this.skeleton.leftKnee.x, this.skeleton.leftKnee.y, 'voetL').setScale(0.5);
    this.footLeft = this.physics.add.existing(this.keypointsGameOjb.leftKnee);
    this.keypointsGameOjb.rightKnee = this.add.image(this.skeleton.rightKnee.x,this.skeleton.rightKnee.y, 'voetR').setScale(0.5);
    this.footRight = this.physics.add.existing(this.keypointsGameOjb.rightKnee);

    this.targetGroup = this.physics.add.group(); 

    this.physics.add.overlap(this.footLeft, this.targetGroup, this.handleHit, null, this);
    this.physics.add.overlap(this.footRight, this.targetGroup, this.handleHit, null, this);

    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    
  }

  handleHit (hand, goal){
    console.log('hit')
    goal.destroy();
    this.scene.start('gameBegin', {restart: this.restartNext});    
  }

    t = 0;
    onEvent(){
      this.t++
      if(this.t === 2){
        // console.log('time event', this.t);
        let target1 = this.add.sprite(350, 1000, 'hart1', 17).setScale(0.5);
        this.anims.create({
          key: 'beweeg',
          frames: this.anims.generateFrameNumbers('hart1', { start: 17, end: 18 }),
          frameRate: 3,
          repeat: -1
        });
        target1.anims.play('beweeg');
        this.targetGroup.add(target1, false);
      }
    }

  // PLUGIN
  handlePoses(poses){
    poses.forEach(({score, keypoints}) => {
      if(score >= 0.4){
        this.drawKeypoints(keypoints);
        return; 
      }
    })
  }

  fetchPoses = async () => {
    let poses = await this.posenetplugin.poseEstimation();
    this.handlePoses(poses);
  }

  update(){
    this.fetchPoses();

    this.keypointsGameOjb.leftKnee.x = this.skeleton.leftKnee.x;
    this.keypointsGameOjb.leftKnee.y = this.skeleton.leftKnee.y;

    this.keypointsGameOjb.rightKnee.x = this.skeleton.rightKnee.x;
    this.keypointsGameOjb.rightKnee.y = this.skeleton.rightKnee.y;
  }
}