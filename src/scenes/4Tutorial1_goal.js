import handR from '../assets/img/keypoints/handR.png'
import handL from '../assets/img/keypoints/handL.png'

export class Tutorial1_goal extends Phaser.Scene{
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
  restart = false; 
  restartNext; 

  init = async (data) => {
    // console.log(data);
    // this.$webcam = data.webcamObj;
    // this.poseNet = data.poseNet;

    console.log(`TutorialScene INIT`);
    // console.log(this.$webcam, this.poseNet);

    // this.$webcam.width = window.innerWidth;
    // this.$webcam.height = window.innerHeight;

    this.restart = data.restart;
    this.restartNext = data.restart;

    this.skeleton = {
      "leftWrist": {part: "leftWrist", x: 500, y: 500},
      "rightWrist": {part: "rightWrist", x: 500, y: 500}
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
    // this.load.multiatlas('batterij', batterijJson, '../assets/spritesheets/batterij/blauw/batterij');  

    this.load.image('handR', handR);
    this.load.image('handL', handL);
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
    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.5);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.5);

    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);

    this.targetGroup = this.physics.add.group(); 

    this.physics.add.overlap(this.handLeft, this.targetGroup, this.handleHit, null, this);
    this.physics.add.overlap(this.handRight, this.targetGroup, this.handleHit, null, this);

    // let batterijObj = this.add.sprite(250,200, 'batterij', 'blauw-0.png');
    // batterijObj.setScale(0.2, 0.2);

    // var frameNames = this.anims.generateFrameNames('batterij', {
    //   start: 0, end: 58,
    //   suffix: '.png', zeroPad: 0,
    // });
    // this.anims.create({ key: 'walk', frames: frameNames, frameRate: 25, repeat: -1 });
    // batterijObj.anims.play('walk');

    let batterijObj = this.add.rectangle(250, 300, 100, 100, "red");
    this.targetGroup.add(batterijObj, false);
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

    // welke functie er opgeropen wordt bij de overlap tussen de speler 
    handleHit (hand, goal){
      console.log('hit')
      goal.destroy();
      this.scene.start('tutorial2', { restart: this.restartNext, webcamObj: this.$webcam, poseNet: this.poseNet, skeletonObj: this.skeleton});    
  }
  
  update(){
    // PROBLEEM MET PLUGIN??
    this.posenet.poseEstimation();
    this.events.on('poses', this.handlePoses, this);

    this.keypointsGameOjb.leftWrist.x = this.skeleton.leftWrist.x;
    this.keypointsGameOjb.leftWrist.y = this.skeleton.leftWrist.y;

    this.keypointsGameOjb.rightWrist.x = this.skeleton.rightWrist.x;
    this.keypointsGameOjb.rightWrist.y = this.skeleton.rightWrist.y;

  }
}