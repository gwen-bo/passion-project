export default class GamePlayScene extends Phaser.Scene{
  constructor(config, utilities){
    super(config, utilities);
  }

  // om de input van de webcam om te draaien
  flipPoseHorizontal = true;

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
    
    this.score = 0;

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
    this.load.image('voetL', './assets/keypoints/voetL.png');

    this.load.audio('energy', 'assets/goal/energy.mp3');

    this.load.multiatlas('batterij-tut2', './assets/spritesheets/batterij/blauw/blauw.json', './assets/spritesheets/batterij/blauw/batterij');  

    this.load.image('score-0', './assets/goal/meter/score-0.png');
    this.load.image('score-1', './assets/goal/meter/score-1.png');
    this.load.image('score-2', './assets/goal/meter/score-2.png');
    this.load.image('score-3', './assets/goal/meter/score-3.png');
    this.load.image('score-4', './assets/goal/meter/score-4.png');
    this.load.image('score-5', './assets/goal/meter/score-5.png');
    this.load.image('score-6', './assets/goal/meter/score-6.png');
    this.load.image('score-7', './assets/goal/meter/score-7.png');
    this.load.image('score-8', './assets/goal/meter/score-8.png');
    this.load.image('score-9', './assets/goal/meter/score-9.png');
    this.load.image('score-10', './assets/goal/meter/score-10.png');
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
  energyMeter; 
  energySound;

  create(){
    this.screenWidthCenter = this.cameras.main.worldView.centerX;
    this.score = 0;

    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL');
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR');
    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);

    this.energyMeter = this.add.image(0, 0, 'score-0');
    console.log(this.cameras.main.worldView);
    this.aGrid = new AlignGrid({scene: this.scene, rows:8, cols: 11, height: this.cameras.main.worldView.height, width: this.cameras.main.worldView.width})
    // this.aGrid.showNumbers();
    this.aGrid.placeAtIndex(5, this.energyMeter);

    this.targetGroup = this.physics.add.group(); 

    this.energySound = this.sound.add('energy', {loop: false});
    this.physics.add.overlap(this.handLeft, this.targetGroup, this.handleHit, null, this);
    this.physics.add.overlap(this.handRight, this.targetGroup, this.handleHit, null, this);
    
    this.drawGoal();
  }

  handleHit (hand, goal){
    // animeren on hit
      // var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
      // animation.killOnComplete = true;

      console.log('hit');
      this.score++
      this.energySound.play();
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

    // if(this.score >= 10){
    //   console.log('score hit!');
    //   this.scene.start('ending', { webcamObj: this.$webcam, poseNet: this.poseNet});    
    // }

    if(this.paused === true){
      this.scene.launch('timeOut', {currentScene: 'gameplay'});  
    }else if(this.paused === false){
      this.scene.stop('timeOut');
    }

    switch(this.score){

      case 1: 
        this.energyMeter.setTexture('score-1');
      break;

      case 2: 
        this.energyMeter.setTexture('score-2');
      break;

      case 3: 
        this.energyMeter.setTexture('score-3');
      break;

      case 4: 
        this.energyMeter.setTexture('score-4');
      break;

      case 5: 
        this.energyMeter.setTexture('score-5');
      break;

      case 6: 
        this.energyMeter.setTexture('score-6');
      break;

      case 7: 
        this.energyMeter.setTexture('score-7');
      break;

      case 8: 
        this.energyMeter.setTexture('score-8');
      break;

      case 9: 
        this.energyMeter.setTexture('score-9');
      break;

      case 10: 
        console.log('score hit!');
        this.energyMeter.setTexture('score-10');
        this.scene.start('ending', { webcamObj: this.$webcam, poseNet: this.poseNet});   
      break;

    }

  }
}