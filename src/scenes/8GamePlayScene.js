import score0 from '../assets/img/game/meter/0.png'
import score1 from '../assets/img/game/meter/1.png'
import score2 from '../assets/img/game/meter/2.png'
import score3 from '../assets/img/game/meter/3.png'
import score4 from '../assets/img/game/meter/4.png'
import score5 from '../assets/img/game/meter/5.png'
import score6 from '../assets/img/game/meter/6.png'
import score7 from '../assets/img/game/meter/7.png'
import score8 from '../assets/img/game/meter/8.png'
import score9 from '../assets/img/game/meter/9.png'
import score10 from '../assets/img/game/meter/10.png'
import score11 from '../assets/img/game/meter/11.png'
import score12 from '../assets/img/game/meter/12.png'
import score13 from '../assets/img/game/meter/13.png'

import hart3 from '../assets/img/game/sprites/hart3.png'
import hart4 from '../assets/img/game/sprites/hart4.png'
import hart5 from '../assets/img/game/sprites/hart5.png'
import hart6 from '../assets/img/game/sprites/hart6.png'

import handR from '../assets/img/keypoints/handR.png'
import handL from '../assets/img/keypoints/handL.png'
import voetR from '../assets/img/keypoints/voetR.png'
import voetL from '../assets/img/keypoints/voetL.png'

import hit from '../assets/audio/hit.mp3'


import AlignGrid from '../js/utilities/alignGrid'

export class GamePlayScene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  // om de input van de webcam om te draaien
  // flipPoseHorizontal = true;

  // poseNet = undefined; 
  // poses = [];
  paused = false; 
  score; 
  restart; 
  restartNext; 

  init = async (data) => {
    // this.$webcam = data.webcamObj;
    // this.poseNet = data.poseNet;
    this.skeleton = data.skeletonObj;

    console.log(`Gameplay scene INIT`);
    
    this.score = 0;
    this.pausedTime = 0; 

    // this.$webcam.width = window.innerWidth;
    // this.$webcam.height = window.innerHeight;
    this.restart = data.restart;
    this.restartNext = data.restart;

    if(this.restart === true){
      console.log('restarting');
      // this.scene.restart({ restart: false, webcamObj: this.$webcam, poseNet: this.poseNet})
      this.scene.restart({ restart: false})
    }

    // this.poseEstimation();
  }

  // eventueel ook op andere javascript file 
  drawKeypoints = (keypoints, scale = 1) => {
    for (let i = 0; i < keypoints.length; i++) {
        this.handleKeyPoint(keypoints[i], scale);
    }
}

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

    this.load.audio('hit', hit);
    this.load.spritesheet('hart3', hart3, { frameWidth: 337, frameHeight: 409 });
    this.load.spritesheet('hart4', hart4, { frameWidth: 337, frameHeight: 409 });
    this.load.spritesheet('hart5', hart5, { frameWidth: 337, frameHeight: 409 });
    this.load.spritesheet('hart6', hart6, { frameWidth: 337, frameHeight: 409 });

    this.load.image('score-0', score0);
    this.load.image('score-1', score1);
    this.load.image('score-2', score2);
    this.load.image('score-3', score3);
    this.load.image('score-4', score4);
    this.load.image('score-5', score5);
    this.load.image('score-6', score6);
    this.load.image('score-7', score7);
    this.load.image('score-8', score8);
    this.load.image('score-9', score9);
    this.load.image('score-10', score10);
    this.load.image('score-11', score11);
    this.load.image('score-12', score12);
    this.load.image('score-13', score13);
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
  targetGroup = undefined; 

  scoreMeter; 
  hitSound;
  aGrid; 
  posenetplugin; 
  create(){
    this.posenetplugin = this.plugins.get('PoseNetPlugin');

    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.5);
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.5);
    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);
    this.keypointsGameOjb.leftKnee = this.add.image(this.skeleton.leftKnee.x, this.skeleton.leftKnee.y, 'voetL').setScale(0.5);
    this.kneeLeft = this.physics.add.existing(this.keypointsGameOjb.leftKnee);
    this.keypointsGameOjb.rightKnee = this.add.image(this.skeleton.rightKnee.x, this.skeleton.rightKnee.y, 'voetR').setScale(0.5);
    this.kneeRight = this.physics.add.existing(this.keypointsGameOjb.rightKnee);

    this.score = 0;
    this.scoreMeter = this.add.image(0, 0, 'score-0');
    this.aGrid = new AlignGrid({scene: this.scene, rows:40, cols: 11, height: 1710, width: 1030})
    // this.aGrid.showNumbers();
    this.aGrid.placeAtIndex(49, this.scoreMeter); // 38 of 60

    this.targetGroup = this.physics.add.group(); 
    this.keypointGroup = this.physics.add.group([this.handLeft, this.handRight, this.kneeLeft, this.kneeRight]); 

    this.hitSound = this.sound.add('hit', {loop: false});
    this.physics.add.overlap(this.keypointGroup, this.targetGroup, this.handleHit, null, this);

    this.createCoordinates();
  }

  handleHit (hand, goal){
    this.score++
    this.hitSound.play();
    goal.destroy();
    this.createCoordinates();
}

createCoordinates(){
  this.x = Phaser.Math.Between(300, 800);
  this.y = Phaser.Math.Between(700, 1000);

  let distance = Phaser.Math.Distance.Between(x, y, this.previousX, this.previousY);
  if(distance <= 250){
    this.x = Phaser.Math.Between(300, 800);
    this.y = Phaser.Math.Between(700, 1000);
  }else{
    this.drawGoal();
    this.previousX = this.x; 
    this.previousY = this.y; 
  }
}
 
// checking if distance is big enough between the coördinates
x; 
y; 
previousX = 0; 
previousY = 0;

drawGoal(){
  console.log('drawGoal activated');
  const targets = ["hart3", "hart4", "hart5", "hart6"];
  let currentTarget = targets[Math.floor(Math.random()*targets.length)];
  let newTarget; 
  
  switch(currentTarget){
    case "hart3": 
      newTarget = this.add.sprite(this.x, this.y, 'hart3', 0).setScale(0.5);
      this.anims.create({
        key: 'beweeg3',
        frames: this.anims.generateFrameNumbers('hart3', { start: 17, end: 18 }),
        frameRate: 5,
        repeat: -1
      });
      newTarget.anims.play('beweeg3');
    break;
    case "hart4": 
      newTarget = this.add.sprite(this.x, this.y, 'hart4', 0).setScale(0.5);
      this.anims.create({
        key: 'beweeg4',
        frames: this.anims.generateFrameNumbers('hart4', { start: 17, end: 18 }),
        frameRate: 5,
        repeat: -1
      });
      newTarget.anims.play('beweeg4');
    break;
    case "hart5": 
      newTarget = this.add.sprite(this.x, this.y, 'hart5', 0).setScale(0.5);
      this.anims.create({
        key: 'beweeg5',
        frames: this.anims.generateFrameNumbers('hart5', { start: 17, end: 18 }),
        frameRate: 5,
        repeat: -1
      });
      newTarget.anims.play('beweeg5');
    break;
    case "hart6": 
      newTarget = this.add.sprite(this.x, this.y, 'hart6', 0).setScale(0.5);
      this.anims.create({
        key: 'beweeg6',
        frames: this.anims.generateFrameNumbers('hart6', { start: 17, end: 18 }),
        frameRate: 5,
        repeat: -1
      });
      newTarget.anims.play('beweeg6');
    break;
}
  this.targetGroup.add(newTarget, false);
}

  pausedTimer(){
    this.pausedTime++;
    if(this.pausedTime >= 600){
      this.scene.stop('timeOut');
      this.scene.start('start', { restart: true, webcamObj: this.$webcam, poseNet: this.poseNet});    
    }
  }
  pausedTime; 

  // PLUGIN
  handlePoses(poses){
    poses.forEach(({score, keypoints}) => {
      if(score >= 0.4){
        this.drawKeypoints(keypoints);
        return; 
      }else if (score <= 0.02){
        console.log('pausing, because bad score', score);
        this.paused = true; 
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

    this.keypointsGameOjb.leftKnee.x = this.skeleton.leftKnee.x;
    this.keypointsGameOjb.leftKnee.y = this.skeleton.leftKnee.y;

    this.keypointsGameOjb.rightKnee.x = this.skeleton.rightKnee.x;
    this.keypointsGameOjb.rightKnee.y = this.skeleton.rightKnee.y;

    this.keypointsGameOjb.rightWrist.x = this.skeleton.rightWrist.x;
    this.keypointsGameOjb.rightWrist.y = this.skeleton.rightWrist.y;

    if(this.paused === true){
      this.scene.launch('timeOut', {currentScene: 'gameplay'});  
      this.pausedTimer();
    }else if(this.paused === false){
      this.scene.stop('timeOut');
    }

    this.scoreMeter.setTexture(`score-${this.score}`);
    if(this.score >= 13){
      this.scene.start('ending', { webcamObj: this.$webcam, poseNet: this.poseNet});    

    }

  }
}