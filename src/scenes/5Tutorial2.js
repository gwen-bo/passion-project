// uitleg over handen strekken en bolletje dat handen voorstelt 
import voetR from '../assets/img/keypoints/voetR.png'
import voetL from '../assets/img/keypoints/voetL.png'
import uitlegVoeten from '../assets/img/tutorial/Voeten-tut.png'
import AlignGrid from '../js/utilities/alignGrid'

export class Tutorial2Scene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  // om de input van de webcam om te draaien
  flipPoseHorizontal = true;

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
  restart = false; 
  restartNext; 

  init = async (data) => {
    // console.log(data);
    // this.$webcam = data.webcamObj;
    // this.poseNet = data.poseNet;
    this.t = 0; 

    console.log(`TutorialScene-2 INIT`);

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
    if(!(keypoint.part === "leftKnee" || keypoint.part === "rightKnee" )) {
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
    this.load.image('voetR', voetR);
    this.load.image('voetL', voetL);
    this.load.image('uitlegVoeten', uitlegVoeten);

  }


  keypointsGameOjb = {
    leftWrist: undefined,
    rightWrist: undefined, 
    leftKnee: undefined, 
    rightKnee: undefined, 
  }


  footLeft = undefined; 
  footRight = undefined; 

  create(){
    let title = this.add.image(0, 0, 'uitlegVoeten');
    this.aGrid = new AlignGrid({scene: this.scene, rows:40, cols: 11, height: this.cameras.main.worldView.height, width: this.cameras.main.worldView.width})
    // this.aGrid.showNumbers();
    this.aGrid.placeAtIndex(49, title); // 60

    this.keypointsGameOjb.leftKnee = this.add.image(this.skeleton.leftKnee.x, this.skeleton.leftKnee.y, 'voetL').setScale(0.5);
    this.footLeft = this.physics.add.existing(this.keypointsGameOjb.leftKnee);
    this.keypointsGameOjb.rightKnee = this.add.image(this.skeleton.rightKnee.x,this.skeleton.rightKnee.y, 'voetR').setScale(0.5);
    this.footRight = this.physics.add.existing(this.keypointsGameOjb.rightKnee);

    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    
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
  

  t = 0; 
  onEvent(){
    this.t++
    if(this.t === 3){
      console.log('time event', this.t);
      // this.scene.start('tutorial2_goal', {restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet });    
      this.scene.start('tutorial2_goal', {restart: this.restartNext});    
    }
  }

  update(){
    // callback function
    this.posenet.poseEstimation();
    this.events.on('poses', this.handlePoses, this);

    this.keypointsGameOjb.leftKnee.x = this.skeleton.leftKnee.x;
    this.keypointsGameOjb.leftKnee.y = this.skeleton.leftKnee.y;

    this.keypointsGameOjb.rightKnee.x = this.skeleton.rightKnee.x;
    this.keypointsGameOjb.rightKnee.y = this.skeleton.rightKnee.y;

  }
}