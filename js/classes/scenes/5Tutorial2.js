// uitleg over handen strekken en bolletje dat handen voorstelt 

export default class Tutorial2Scene extends Phaser.Scene{
  constructor(config, utilities){
    super(config, utilities);
  }

  // om de input van de webcam om te draaien
  flipPoseHorizontal = true;

  videoHeight = window.innerHeight;
  videoWidth = window.innerWidth;
  beginHeight = 300; 
  beginWidth = 600; 
  endHeight = window.innerHeight - 300;
  endWidth = window.innerWidth - 600;
  margeWidth =  this.endWidth - this.beginWidth; 
  margeHeight = this.endHeight - this.beginHeight; 

  poseNet = undefined; 
  poses = [];
  restart = false; 
  restartNext; 

  init = async (data) => {
    // console.log(data);
    this.$webcam = data.webcamObj;
    this.poseNet = data.poseNet;
    this.t = 0; 

    console.log(`TutorialScene-2 INIT`);

    this.$webcam.width = window.innerWidth;
    this.$webcam.height = window.innerHeight;

    this.restart = data.restart;
    this.restartNext = data.restart;

    this.skeleton = {
      "leftWrist": {part: "leftWrist", x: 400, y: 500},
      "rightWrist": {part: "rightWrist", x: 600, y: 500}
    };

    if(this.restart === true){
      console.log(this.restart);
      this.scene.restart({ restart: false, webcamObj: this.$webcam, poseNet: this.poseNet})
    }

    this.poseEstimation();
  }

  poseEstimation = async () => {
    // console.log('pose estimation - tut1 scene');
    const pose = await this.poseNet.estimateSinglePose(this.$webcam, {
        flipHorizontal: this.flipPoseHorizontal,
    });
    
    this.poses = this.poses.concat(pose);
    this.poses.forEach(({score, keypoints}) => {
      // console.log('pose is being detected', score)
      if(score > 0.4){
        this.drawKeypoints(keypoints);
      }
    });
  }

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

    this.load.image('voetR', './assets/keypoints/voetR.png')
    this.load.image('voetL', './assets/keypoints/voetL.png')
  }


  keypointsGameOjb = {
    leftWrist: undefined,
    rightWrist: undefined, 
    leftAnkle: undefined, 
    rightAnkle: undefined, 
  }


  handLeft = undefined; 
  handRight = undefined; 

  create(){
    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'voetL');
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'voetR');
    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);

    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    
  }

  t = 0; 
  onEvent(){
    this.t++
    if(this.t === 3){
      console.log('time event', this.t);
      this.scene.start('tutorial2_goal', {restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet });    
    }
  }

  update(){
    // callback function
    this.poseEstimation();

    this.keypointsGameOjb.leftWrist.x = this.skeleton.leftWrist.x;
    this.keypointsGameOjb.leftWrist.y = this.skeleton.leftWrist.y;

    this.keypointsGameOjb.rightWrist.x = this.skeleton.rightWrist.x;
    this.keypointsGameOjb.rightWrist.y = this.skeleton.rightWrist.y;

  }
}