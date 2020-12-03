export default class Tutorial2_goal extends Phaser.Scene{
  constructor(config, utilities){
    super(config, utilities);
  }
  // $webcam = document.querySelector('#webcam');

  // om de input van de webcam om te draaien
  flipPoseHorizontal = true;

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

    console.log(`TutorialScene 2 INIT`);
    console.log(this.$webcam, this.poseNet);

    this.$webcam.width = window.innerWidth;
    this.$webcam.height = window.innerHeight;
    this.restart = data.restart;
    this.restartNext = data.restart;

    if(this.restart === true){
      console.log(this.restart);
      this.scene.restart({ restart: false, webcamObj: this.$webcam, poseNet: this.poseNet})
    }

    this.poseEstimation();
  }

  poseEstimation = async () => {
    // console.log('pose estimatio - tut2 scene');
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

  skeleton = {
    "leftWrist": {part: "leftWrist", x: 500, y: 500},
    "rightWrist": {part: "rightWrist", x: 500, y: 500}
  };

  // eventueel ook op andere javascript file 
  drawKeypoints = (keypoints, scale = 1) => {
    for (let i = 0; i < keypoints.length; i++) {
        this.handleKeyPoint(keypoints[i], scale);
    }
  }

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
    this.load.multiatlas('batterij-tut2', './assets/spritesheets/batterij/blauw/blauw.json', './assets/spritesheets/batterij/blauw/batterij');  

    // this.load.image('handR', './assets/keypoints/handR.png');
    // this.load.image('handL', './assets/keypoints/handL.png');
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

    this.targetGroup = this.physics.add.group(); 

    this.physics.add.overlap(this.handLeft, this.targetGroup, this.handleHit, null, this);
    this.physics.add.overlap(this.handRight, this.targetGroup, this.handleHit, null, this);

    let batterijObj = this.add.sprite(900,700, 'batterij-tut2', 'blauw-0.png');
    batterijObj.setScale(0.2, 0.2);

    var frameNames = this.anims.generateFrameNames('batterij-tut2', {
      start: 0, end: 58,
      suffix: '.png', zeroPad: 0,
    });
    this.anims.create({ key: 'walk', frames: frameNames, frameRate: 25, repeat: -1 });
    batterijObj.anims.play('walk');
    this.targetGroup.add(batterijObj, false);

  }

    // welke functie er opgeropen wordt bij de overlap tussen de speler 
    handleHit (hand, goal){
      console.log('hit')
      goal.destroy();
      // this.scene.stop('tutorial2_goal');
      this.scene.start('gameBegin', { restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet, skeletonObj: this.skeleton});    
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