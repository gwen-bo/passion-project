import handR from '../assets/img/keypoints/handR.png'
import handL from '../assets/img/keypoints/handL.png'

import hart1 from '../assets/img/game/sprites/hart1.png'

export class Tutorial1_goal extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  restart; 
  restartNext; 

  init = async (data) => {
    
    console.log(`TutorialScene INIT`);
    this.restart = data.restart;
    this.restartNext = data.restart;

    this.skeleton = {
      "leftWrist": {part: "leftWrist", x: 500, y: 500},
      "rightWrist": {part: "rightWrist", x: 500, y: 500}
    };

    if(this.restart === true){
      console.log('restarting');
      this.scene.restart({ restart: false})
    }
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
    this.load.spritesheet('hart1', hart1, { frameWidth: 337, frameHeight: 409 });

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
  posenetplugin; 
  create(){
    this.posenetplugin = this.plugins.get('PoseNetPlugin');

    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.5);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.5);

    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);

    this.targetGroup = this.physics.add.group(); 

    this.physics.add.overlap(this.handLeft, this.targetGroup, this.handleHit, null, this);
    this.physics.add.overlap(this.handRight, this.targetGroup, this.handleHit, null, this);

    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    
  };

  t = 0; 
  score = 0; 

  onEvent(){
    this.t++
    if(this.t === 2){
      // console.log('time event', this.t);
      let target1 = this.add.sprite(250, 300, 'hart1', 17).setScale(0.5);
      // let target2 = this.add.sprite(250, 300, 'hart1', 17).setScale(0.5);

      this.anims.create({
        key: 'beweeg',
        frames: this.anims.generateFrameNumbers('hart1', { start: 17, end: 18 }),
        frameRate: 3,
        repeat: -1
      });
      this.anims.create({
        key: 'hit',
        frames: this.anims.generateFrameNumbers('hart1', { start: 0, end: 16 }),
        frameRate: 3,
        repeat: 0
      });
      target1.anims.play('beweeg');
      this.targetGroup.add(target1, false);
      // this.targetGroup.add(target2, false);  
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

    // welke functie er opgeropen wordt bij de overlap tussen de speler 
    handleHit (hand, goal){
      this.score++
      console.log('hit', goal);
      goal.anims.play('hit');
      goal.destroy();

      // goal.on('animationcomplete', function () {
      // }, this);

      // if(this.score >= 2){
        this.scene.start('tutorial2', {webcamObj: this.$webcam, poseNet: this.poseNet, skeletonObj: this.skeleton});    
      // }
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