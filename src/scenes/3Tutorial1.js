// uitleg over handen strekken en bolletje dat handen voorstelt 
import handR from '../assets/img/keypoints/handR.png'
import handL from '../assets/img/keypoints/handL.png'
import uitlegHanden from '../assets/img/tutorial/Handen-tut.png'

import AlignGrid from '../js/utilities/alignGrid'

import hart1 from '../assets/img/game/sprites/hart1.png'

import taDa from '../assets/audio/welcome.mp3'
import uitlegAudio from '../assets/audio/Dit-spel-speel-je-met-je-handen-en-voeten.mp3'
import probeerHartje from '../assets/audio/Probeer-maar-Hartje.mp3'
import Super from '../assets/audio/Super.mp3'


export class Tutorial1Scene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  restart; 
  restartNext; 

  init = async (data) => {

    console.log(`TutorialScene-1 INIT`);
    this.countdown = 0
    this.restart = data.restart;
    this.restartNext = data.restart;

    this.skeleton = {
      "leftWrist": {part: "leftWrist", x: 400, y: 500},
      "rightWrist": {part: "rightWrist", x: 600, y: 500}
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
    this.load.image('handR', handR);
    this.load.image('handL', handL);
    this.load.image('uitlegHanden', uitlegHanden);
    this.load.spritesheet('hart1', hart1, { frameWidth: 337, frameHeight: 409 });
    this.load.audio('uitlegAudio', uitlegAudio);
    this.load.audio('probeerHartje', probeerHartje);
    this.load.audio('Super', Super);
    this.load.audio('taDa', taDa);
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

    let title = this.add.image(0, 0, 'uitlegHanden');
    this.aGrid = new AlignGrid({scene: this.scene, rows:40, cols: 11, height: 1710, width: 1030})
    // this.aGrid.showNumbers();
    this.aGrid.placeAtIndex(49, title); // 60

    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.5);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.5);

    this.handRight = this.physics.add.existing(this.keypointsGameOjb.rightWrist);
    this.handLeft = this.physics.add.existing(this.keypointsGameOjb.leftWrist);
    this.targetGroup = this.physics.add.group(); 
    this.physics.add.overlap(this.handLeft, this.targetGroup, this.handleHit, null, this);
    this.physics.add.overlap(this.handRight, this.targetGroup, this.handleHit, null, this);

    this.uitlegAudio = this.sound.add('uitlegAudio', {loop: false});
    this.probeerHartje = this.sound.add('probeerHartje', {loop: false});
    this.super = this.sound.add('Super', {loop: false});
    this.taDa = this.sound.add('taDa', {loop: false});

    this.uitlegAudio.play();
    this.uitlegAudio.on('complete', this.handleEndAudio, this.scene.scene);
  }

  handleEndAudio(){
    console.log('audio is gedaan');
    this.probeerHartje.play();
    this.probeerHartje.on('complete', this.drawTarget, this.scene.scene);
  }

  drawTarget(){
    let target1 = this.add.sprite(450, 500, 'hart1', 17).setScale(0.5);
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
    this.super.play();
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
      this.uitlegAudio.stop();
      this.probeerHartje.stop();
      this.scene.start('tutorial2', {restart: this.restartNext});    
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