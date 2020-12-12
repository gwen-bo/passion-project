// uitleg over handen strekken en bolletje dat handen voorstelt 
import voetR from '../assets/img/keypoints/voetR.png'
import voetL from '../assets/img/keypoints/voetL.png'
import uitlegVoeten from '../assets/img/tutorial/Voeten-tut.png'
import AlignGrid from '../js/utilities/alignGrid'
import hart1 from '../assets/img/game/sprites/hart1.png'
import taDa from '../assets/audio/welcome.mp3'
import probeerVoeten from '../assets/audio/Probeer-nu-ook-maar-eens-met-je-voeten.mp3'
import Wauw from '../assets/audio/Wauw.mp3'

export class TutorialVoetenScene extends Phaser.Scene{
  constructor(config){
    super(config);
  }


  restart; 
  restartNext; 

  init = async (data) => {

    this.t = 0; 

    console.log(`TutorialScene-2 INIT`);

    this.restart = data.restart;
    this.restartNext = data.restart;
    this.pausedTime = 0; 

    this.skeleton = {
      "leftWrist": {part: "leftWrist", x: 400, y: 500},
      "rightWrist": {part: "rightWrist", x: 600, y: 500},
      "leftKnee": {part: "leftKnee", x: 600, y: 500},
      "rightKnee": {part: "rightKnee", x: 600, y: 500}
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
    this.load.spritesheet('hart1', hart1, { frameWidth: 337, frameHeight: 409 });
    this.load.audio('probeerVoeten', probeerVoeten);
    this.load.audio('Wauw', Wauw);
    this.load.audio('taDa', taDa);
  }

  // in de uiteindelijke code zal dit leftAnkel en rightAnkle moeten zijn
  keypointsGameOjb = {
    leftWrist: undefined,
    rightWrist: undefined, 
    leftKnee: undefined, 
    rightKnee: undefined, 
  }


  footLeft = undefined; 
  footRight = undefined; 
  posenetplugin;

  create(){
    this.posenetplugin = this.plugins.get('PoseNetPlugin');

    let title = this.add.image(0, 0, 'uitlegVoeten');
    this.aGrid = new AlignGrid({scene: this.scene, rows:40, cols: 11, height: 1710, width: 1030})
    // this.aGrid.showNumbers();
    this.aGrid.placeAtIndex(49, title); // 60

    this.keypointsGameOjb.leftKnee = this.add.image(this.skeleton.leftKnee.x, this.skeleton.leftKnee.y, 'voetL').setScale(0.5);
    this.footLeft = this.physics.add.existing(this.keypointsGameOjb.leftKnee);
    this.keypointsGameOjb.rightKnee = this.add.image(this.skeleton.rightKnee.x,this.skeleton.rightKnee.y, 'voetR').setScale(0.5);
    this.footRight = this.physics.add.existing(this.keypointsGameOjb.rightKnee);

    this.targetGroup = this.physics.add.group(); 
    this.physics.add.overlap(this.footLeft, this.targetGroup, this.handleHit, null, this);
    this.physics.add.overlap(this.footRight, this.targetGroup, this.handleHit, null, this);

    this.probeerVoeten = this.sound.add('probeerVoeten', {loop: false});
    this.wauw = this.sound.add('Wauw', {loop: false});
    this.taDa = this.sound.add('taDa', {loop: false});

    this.probeerVoeten.play();
    this.probeerVoeten.on('complete', this.drawTarget, this.scene.scene);
  }

  drawTarget(){
    let target1 = this.add.sprite(350, 1000, 'hart1', 17).setScale(0.5);
    this.taDa.play();
    this.anims.create({
      key: 'beweeg',
      frames: this.anims.generateFrameNumbers('hart1', { start: 17, end: 18 }),
      frameRate: 3,
      repeat: -1
    });
    this.anims.create({
      key: 'hit',
      frames: this.anims.generateFrameNumbers('hart1', { start: 0, end: 16 }),
      frameRate: 15,
      repeat: 0
    });
    target1.anims.play('beweeg');
    this.targetGroup.add(target1, true);
  }

  handleHit (hand, target){
    console.log('hit');
    this.countdown = 0;
    this.targetGroup.remove(target);
    this.wauw.play();
    target.anims.play('hit');
    target.on('animationcomplete', function(){
      target.destroy();
    })

    this.time.addEvent({ delay: 1000, callback: this.onHitCountdown, callbackScope: this, repeat: 2 });    
}

  countdown = 0; 
  onHitCountdown(){
    this.countdown++
    if(this.countdown >= 1){
      this.probeerVoeten.stop();
      this.scene.start('gameBegin', {restart: this.restartNext});    
    }
}

  pausedTimer(){
    this.pausedTime++;
    if(this.pausedTime >= 600){
      this.scene.stop('timeOut');
      this.scene.start('start', { restart: true});    
    }
  }
  pausedTime; 
  pausedScore = 0; 

  // PLUGIN
  handlePoses(poses){
    poses.forEach(({score, keypoints}) => {
      if(score >= 0.4){
        this.drawKeypoints(keypoints);
        return; 
      }else if (score <= 0.02){
        this.pausedScore++
      }
    })
  }

  fetchPoses = async () => {
    let poses = await this.posenetplugin.poseEstimation();
    this.handlePoses(poses);
  }

  update(){
    this.fetchPoses();

    this.keypointsGameOjb.leftKnee.x = this.skeleton.leftKnee.x;
    this.keypointsGameOjb.leftKnee.y = this.skeleton.leftKnee.y;

    this.keypointsGameOjb.rightKnee.x = this.skeleton.rightKnee.x;
    this.keypointsGameOjb.rightKnee.y = this.skeleton.rightKnee.y;

    // time-out function
    if(this.pausedScore === 10){
      this.probeerVoeten.pause();
      this.scene.launch('timeOut', {currentScene: 'gameplay'});  
      this.pausedTimer();
    }else if(this.pausedScore === 500){
      this.afsluiten.play();
      this.afsluiten.on('complete', this.handleShutDown, this.scene.scene);
    }else if(this.pausedScore === 0){
      this.probeerVoeten.resume();
      this.scene.sleep('timeOut');
    }
  }
}