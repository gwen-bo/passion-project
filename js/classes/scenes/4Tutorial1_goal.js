export default class Tutorial1_goal extends Phaser.Scene{
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

    console.log(`TutorialScene INIT`);
    console.log(this.$webcam, this.poseNet);

    this.$webcam.width = window.innerWidth;
    this.$webcam.height = window.innerHeight;

    this.restart = data.restart;
    this.restartNext = data.restart;

    this.skeleton = {
      "leftWrist": {part: "leftWrist", x: 500, y: 500},
      "rightWrist": {part: "rightWrist", x: 500, y: 500}
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
    this.load.multiatlas('batterij', './assets/spritesheets/batterij/blauw/blauw.json', './assets/spritesheets/batterij/blauw/batterij');  
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

  create(){
    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL');
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR');
    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);

    this.targetGroup = this.physics.add.group(); 

    this.physics.add.overlap(this.handLeft, this.targetGroup, this.handleHit, null, this);
    this.physics.add.overlap(this.handRight, this.targetGroup, this.handleHit, null, this);

    // let batterijObj = this.add.sprite(500,500, 'batterij', 'blauw-0.png');
    // batterijObj.setScale(0.5, 0.5);

    // var frameNames = this.anims.generateFrameNames('batterij', {
    //   start: 0, end: 28,
    //   prefix: 'blauw-', suffix: '.png'
    // });
    // this.anims.create({ key: 'walk', frames: frameNames, frameRate: 10, repeat: -1 });
    // batterijObj.anims.play('walk');
   
    var timer = this.time.addEvent({
      delay: 1000,                // ms
      callback: this.drawTutorial(),
      //args: [],
      callbackScope: this,
      loop: false
  });
  }

    // welke functie er opgeropen wordt bij de overlap tussen de speler 
    handleHit (hand, goal){
      console.log('hit')
      goal.destroy();
      this.scene.restart();
      this.scene.start('tutorial2', { restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet, skeletonObj: this.skeleton});    
  }
  
  drawTutorial(){
      let xGoal = 250
      let yGoal = 200;
  
      let tutTarget = this.add.rectangle(xGoal, yGoal, 100, 100, "red");
      this.targetGroup.add(tutTarget, false);
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