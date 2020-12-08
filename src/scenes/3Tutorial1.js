// uitleg over handen strekken en bolletje dat handen voorstelt 
import handR from '../assets/img/keypoints/handR.png'
import handL from '../assets/img/keypoints/handL.png'
import uitlegHanden from '../assets/img/tutorial/Handen-tut.png'

import AlignGrid from '../js/utilities/alignGrid'

export class Tutorial1Scene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  // om de input van de webcam om te draaien
  // flipPoseHorizontal = true;

  // videoHeight = window.innerHeight;
  // videoWidth = window.innerWidth;
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
    this.t = 0; 

    console.log(`TutorialScene-1 INIT`);

    // this.$webcam.width = window.innerWidth;
    // this.$webcam.height = window.innerHeight;

    this.restart = data.restart;
    this.restartNext = data.restart;

    this.skeleton = {
      "leftWrist": {part: "leftWrist", x: 400, y: 500},
      "rightWrist": {part: "rightWrist", x: 600, y: 500}
    };

    if(this.restart === true){
      console.log('restarting');
      // this.scene.restart({ restart: false, webcamObj: this.$webcam, poseNet: this.poseNet});
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
    if(!(keypoint.part === "leftWrist" || keypoint.part === "rightWrist" )) {
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
    this.load.image('uitlegHanden', uitlegHanden);
    // this.load.image('voetR', './assets/keypoints/voetR.png')
    // this.load.image('voetL', './assets/keypoints/voetL.png')
  }


  keypointsGameOjb = {
    leftWrist: undefined,
    rightWrist: undefined, 
    leftAnkle: undefined, 
    rightAnkle: undefined, 
  }


  handLeft = undefined; 
  handRight = undefined; 
  posenetplugin;

  create(){
    this.posenetplugin = this.plugins.get('PoseNetPlugin');

    let title = this.add.image(0, 0, 'uitlegHanden');
    this.aGrid = new AlignGrid({scene: this.scene, rows:40, cols: 11, height: 1710, width: 1030})
    // this.aGrid.showNumbers();
    this.aGrid.placeAtIndex(49, title); // 60

    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.5);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.5);

    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);

    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    
  }

  t = 0; 
  onEvent(){
    this.t++
    if(this.t === 3){
      console.log('time event', this.t);
      // this.scene.start('tutorial1_goal', {restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet });    
      this.scene.start('tutorial1_goal', {restart: this.restartNext});    
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
   
    this.keypointsGameOjb.leftWrist.x = this.skeleton.leftWrist.x;
    this.keypointsGameOjb.leftWrist.y = this.skeleton.leftWrist.y;

    this.keypointsGameOjb.rightWrist.x = this.skeleton.rightWrist.x;
    this.keypointsGameOjb.rightWrist.y = this.skeleton.rightWrist.y;

  }
}