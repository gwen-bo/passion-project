// uitleg over handen strekken en bolletje dat handen voorstelt 
import voetR from '../assets/img/keypoints/voetR.png'
import voetL from '../assets/img/keypoints/voetL.png'
import handR from '../assets/img/keypoints/handR.png'
import handL from '../assets/img/keypoints/handL.png'

export class GameBegin extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  // om de input van de webcam om te draaien
  // flipPoseHorizontal = true;

  // poseNet = undefined; 
  // poses = [];
  restart = false; 
  restartNext; 

  init = async (data) => {
    // console.log(data);
    // this.$webcam = data.webcamObj;
    // this.poseNet = data.poseNet;
    this.t = 0; 

    console.log(`GameBegin INIT`);

    // this.$webcam.width = window.innerWidth;
    // this.$webcam.height = window.innerHeight;

    this.restart = data.restart;
    this.restartNext = data.restart;

    this.skeleton = {
      "leftWrist": {part: "leftWrist", x: 500, y: 500},
      "rightWrist": {part: "rightWrist", x: 500, y: 500},
      "rightKnee": {part: "rightKnee", x: 500, y: 500},
      "leftKnee": {part: "leftKnee", x: 500, y: 500}
    };

    if(this.restart === true){
      console.log(this.restart);
      // this.scene.restart({ restart: false, webcamObj: this.$webcam, poseNet: this.poseNet})
      this.scene.restart({ restart: false})
    }

    // this.poseEstimation();
  }

  // poseEstimation = async () => {
  //   // console.log('pose estimation - tut1 scene');
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

  // eventueel ook op andere javascript file 
  drawKeypoints = (keypoints, scale = 1) => {
    for (let i = 0; i < keypoints.length; i++) {
        this.handleKeyPoint(keypoints[i], scale);
    }
}

  skeleton;

  handleKeyPoint = (keypoint, scale) => {
    if(!(keypoint.part === "leftWrist" || keypoint.part === "rightWrist" || keypoint.part === "leftKnee" || keypoint.part === "rightKnee")) {
        return;
    }
    if(keypoint.score <= 0.25){
        return;
    }

    let skeletonPart = this.skeleton[keypoint.part];
    const {y, x} = keypoint.position;
    skeletonPart.x += (x - skeletonPart.x) / 10;
    skeletonPart.y += (y - skeletonPart.y) / 10;
  };


  preload(){
    this.load.image('handR', handR);
    this.load.image('handL', handL);
    this.load.image('voetR', voetR)
    this.load.image('voetL', voetL)
  }


  keypointsGameOjb = {
    leftWrist: undefined,
    rightWrist: undefined, 
    leftKnee: undefined, 
    rightKnee: undefined, 
  }


  handLeft = undefined; 
  handRight = undefined; 
  kneeLeft = undefined; 
  kneeRight = undefined; 
  create(){
    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.5);
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.5);
    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);
    this.keypointsGameOjb.leftKnee = this.add.image(this.skeleton.leftKnee.x, this.skeleton.leftKnee.y, 'voetL').setScale(0.5);
    this.kneeLeft = this.physics.add.existing(this.keypointsGameOjb.leftKnee);
    this.keypointsGameOjb.rightKnee = this.add.image(this.skeleton.rightKnee.x, this.skeleton.rightKnee.y, 'voetR').setScale(0.5);
    this.kneeRight = this.physics.add.existing(this.keypointsGameOjb.rightKnee);

    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    
  }

  t = 0; 
  onEvent(){
    this.t++
    if(this.t === 3){
      console.log('time event', this.t);
      // this.scene.start('gameplay', { restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet, skeletonObj: this.skeleton});    
      this.scene.start('gameplay', { restart: this.restartNext, skeletonObj: this.skeleton});    
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
  

  update(){
    // callback function
    this.posenet.poseEstimation();
    this.events.on('poses', this.handlePoses, this);

    this.keypointsGameOjb.leftWrist.x = this.skeleton.leftWrist.x;
    this.keypointsGameOjb.leftWrist.y = this.skeleton.leftWrist.y;

    this.keypointsGameOjb.leftKnee.x = this.skeleton.leftKnee.x;
    this.keypointsGameOjb.leftKnee.y = this.skeleton.leftKnee.y;

    this.keypointsGameOjb.rightKnee.x = this.skeleton.rightKnee.x;
    this.keypointsGameOjb.rightKnee.y = this.skeleton.rightKnee.y;

    this.keypointsGameOjb.rightWrist.x = this.skeleton.rightWrist.x;
    this.keypointsGameOjb.rightWrist.y = this.skeleton.rightWrist.y;

  }
}