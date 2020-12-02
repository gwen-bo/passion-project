export default class GamePlayScene extends Phaser.Scene{
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
  paused = false; 
  score; 
  restart = false; 
  restartNext; 

  init = async (data) => {
    this.$webcam = data.webcamObj;
    this.poseNet = data.poseNet;
    this.skeleton = data.skeletonObj;

    console.log(`Gameplay scene INIT`);
    
    this.score = -1;

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
    // console.log('poseEstimation');
    const pose = await this.poseNet.estimateSinglePose(this.$webcam, {
        flipHorizontal: this.flipPoseHorizontal,
    });
    
    this.poses = this.poses.concat(pose);
    this.poses.forEach(({score, keypoints}) => {
      if(score > 0.4){
        if(this.paused === true){
          this.paused = false; 
        }
        this.drawKeypoints(keypoints);
      } else if (score <= 0.05 ){
        this.paused = true; 
      }
    });
  }

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
    this.load.image('handR', './assets/keypoints/handR.png');
    this.load.image('handL', './assets/keypoints/handL.png');
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
  targetGroup = undefined; 

  create(){
    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL');
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR');
    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);

    this.targetGroup = this.physics.add.group(); 

    let x = Phaser.Math.Between(200, 1000);
    let y = Phaser.Math.Between(200, 600);

    this.physics.add.overlap(this.handLeft, this.targetGroup, this.handleHit, null, this);
    this.physics.add.overlap(this.handRight, this.targetGroup, this.handleHit, null, this);
    
    var timer = this.time.addEvent({
      delay: 2000,                // ms
      callback: this.drawGoal(),
      //args: [],
      callbackScope: this,
      loop: false
  });
  }

  handleHit (hand, goal){
    // animeren on hit
      // var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
      // animation.killOnComplete = true;

      console.log('hit');
      this.score++

      goal.destroy();
      this.drawGoal();
  }
  
  drawGoal(){
    console.log('drawGoal activated');
    let x = Phaser.Math.Between(200, 1000);
    let y = Phaser.Math.Between(200, 600);

    let newTarget = this.add.rectangle(x, y, 100, 100, "red");
    this.targetGroup.add(newTarget, false);
  }

  update(){
    // callback function
    this.poseEstimation();

    this.keypointsGameOjb.leftWrist.x = this.skeleton.leftWrist.x;
    this.keypointsGameOjb.leftWrist.y = this.skeleton.leftWrist.y;

    this.keypointsGameOjb.rightWrist.x = this.skeleton.rightWrist.x;
    this.keypointsGameOjb.rightWrist.y = this.skeleton.rightWrist.y;

    if(this.score >= 10){
      console.log('score hit!');
      this.scene.start('ending', { webcamObj: this.$webcam, poseNet: this.poseNet});    
    }

    if(this.paused === true){
      this.scene.launch('timeOut', {currentScene: 'gameplay'});  
    }else if(this.paused === false){
      this.scene.stop('timeOut');
    }

  }
}