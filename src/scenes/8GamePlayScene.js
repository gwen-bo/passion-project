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
  restart = false; 
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
      console.log(this.restart);
      // this.scene.restart({ restart: false, webcamObj: this.$webcam, poseNet: this.poseNet})
      this.scene.restart({ restart: false})
    }

    // this.poseEstimation();
  }

  // poseEstimation = async () => {
  //   // console.log('poseEstimation');
  //   const pose = await this.poseNet.estimateSinglePose(this.$webcam, {
  //       flipHorizontal: this.flipPoseHorizontal,
  //   });
    
  //   this.poses = this.poses.concat(pose);
  //   this.poses.forEach(({score, keypoints}) => {
  //     if(score > 0.4){
  //       if(this.paused === true){
  //         this.paused = false; 
  //       }
  //       this.drawKeypoints(keypoints);
  //     } else if (score <= 0.05 ){
  //       this.paused = true; 
  //     }
  //   });
  // }

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

    // this.load.multiatlas('batterij-tut2', './assets/spritesheets/batterij/blauw/blauw.json', './assets/spritesheets/batterij/blauw/batterij');  

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
  create(){
    this.score = 0;

    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.5);
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.5);
    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);
    this.keypointsGameOjb.leftKnee = this.add.image(this.skeleton.leftKnee.x, this.skeleton.leftKnee.y, 'voetL').setScale(0.5);
    this.kneeLeft = this.physics.add.existing(this.keypointsGameOjb.leftKnee);
    this.keypointsGameOjb.rightKnee = this.add.image(this.skeleton.rightKnee.x, this.skeleton.rightKnee.y, 'voetL').setScale(0.5);
    this.kneeRight = this.physics.add.existing(this.keypointsGameOjb.rightKnee);

    this.scoreMeter = this.add.image(0, 0, 'score-0');
    console.log(this.cameras.main.worldView);
    this.aGrid = new AlignGrid({scene: this.scene, rows:40, cols: 11, height: this.cameras.main.worldView.height, width: this.cameras.main.worldView.width})
    // this.aGrid.showNumbers();
    this.aGrid.placeAtIndex(49, this.scoreMeter); // 38 of 60

    this.targetGroup = this.physics.add.group([this.handLeft, this.handRight, this.kneeLeft, this.kneeRight]); 
    this.keypointGroup = this.physics.add.group(); 

    this.hitSound = this.sound.add('hit', {loop: false});
    this.physics.add.overlap(this.keypointGroup, this.targetGroup, this.handleHit, null, this);
    // this.physics.add.overlap(this.keypointGroup, this.targetGroup, this.handleHit, null, this);
    // this.physics.add.overlap(this.keypointGroup, this.targetGroup, this.handleHit, null, this);
    // this.physics.add.overlap(this.keypointGroup, this.targetGroup, this.handleHit, null, this);

    this.drawGoal();
  }

  handleHit (hand, goal){
    // animeren on hit
      // var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
      // animation.killOnComplete = true;

      console.log('hit');
      this.score++
      this.hitSound.play();
      goal.destroy();
      this.drawGoal();
  }
  
  drawGoal(){
    console.log('drawGoal activated');
    let x = Phaser.Math.Between(300, 800);
    let y = Phaser.Math.Between(200, 1200);

    let newTarget = this.add.rectangle(x, y, 100, 100, "red");
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
      }else {
        this.paused = true; 
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

    if(this.paused === true){
      this.scene.launch('timeOut', {currentScene: 'gameplay'});  
      this.pausedTimer();
    }else if(this.paused === false){
      this.scene.pause('timeOut');
    }

    switch(this.score){

      case 1: 
        this.scoreMeter.setTexture('score-1');
      break;

      case 2: 
        this.scoreMeter.setTexture('score-2');
      break;

      case 3: 
        this.scoreMeter.setTexture('score-3');
      break;

      case 4: 
        this.scoreMeter.setTexture('score-4');
      break;

      case 5: 
        this.scoreMeter.setTexture('score-5');
      break;

      case 6: 
        this.scoreMeter.setTexture('score-6');
      break;

      case 7: 
        this.scoreMeter.setTexture('score-7');
      break;

      case 8: 
        this.scoreMeter.setTexture('score-8');
      break;

      case 9: 
        this.scoreMeter.setTexture('score-9');
      break;

      case 10: 
        console.log('score hit!');
        this.scoreMeter.setTexture('score-10');
      break;

      case 11: 
        console.log('score hit!');
        this.scoreMeter.setTexture('score-11');
      break;

      case 12: 
        console.log('score hit!');
        this.scoreMeter.setTexture('score-12');
      break;

      case 13: 
        console.log('score hit!');
        this.scoreMeter.setTexture('score-13');
        this.scene.start('ending');   
      break;

    }

  }
}