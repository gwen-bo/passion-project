import voetR from '../assets/img/keypoints/voetR.png'
import voetL from '../assets/img/keypoints/voetL.png'
import handR from '../assets/img/keypoints/handR.png'
import handL from '../assets/img/keypoints/handL.png'
import titlescreen from '../assets/img/titlescreen/titlescreen.png'
import betekenisAudio from '../assets/audio/Ondersteboven-zijn-van-iemand-betekent.mp3'
import AlignGrid from '../js/utilities/alignGrid'

export class GameBegin extends Phaser.Scene{
  constructor(config){
    super(config);
  }
  restart; 
  restartNext; 
  skeleton;
  keypointsGameOjb = {
    leftWrist: undefined,
    rightWrist: undefined, 
    leftKnee: undefined, // in uiteindelijke intsallatie zal dit leftAnkle zijn (voor demo purpose is dit leftKnee) 
    rightKnee: undefined, // in uiteindelijke intsallatie zal dit rightAnkle zijn (voor demo purpose is dit rightKnee)
  }
  handLeft = undefined; 
  handRight = undefined; 
  kneeLeft = undefined; 
  kneeRight = undefined; 
  posenetplugin;

  init = async (data) => {

    this.restart = data.restart;
    this.restartNext = data.restart;

    this.skeleton = {
      "leftWrist": {part: "leftWrist", x: 500, y: 500},
      "rightWrist": {part: "rightWrist", x: 500, y: 500},
      "rightKnee": {part: "rightKnee", x: 500, y: 500},
      "leftKnee": {part: "leftKnee", x: 500, y: 500}
    };

    if(this.restart === true){
      this.scene.restart({ restart: false})
    }
  }

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
    this.load.image('voetR', voetR);
    this.load.image('voetL', voetL);
    this.load.spritesheet('titlescreen', titlescreen, { frameWidth: 960, frameHeight: 945.47 });
    this.load.audio('betekenisAudio', betekenisAudio);
  }


  
  create(){
    this.posenetplugin = this.plugins.get('PoseNetPlugin');
    this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 25, height: window.innerHeight, width: window.innerWidth})
    // this.aGrid.showNumbers();

    this.keypointsGameOjb.leftWrist = this.add.image(this.skeleton.leftWrist.x, this.skeleton.leftWrist.y, 'handL').setScale(0.5);
    this.keypointsGameOjb.rightWrist = this.add.image(this.skeleton.rightWrist.x,this.skeleton.rightWrist.y, 'handR').setScale(0.5);
    this.keypointsGameOjb.leftKnee = this.add.image(this.skeleton.leftKnee.x, this.skeleton.leftKnee.y, 'voetL').setScale(0.5);
    this.keypointsGameOjb.rightKnee = this.add.image(this.skeleton.rightKnee.x, this.skeleton.rightKnee.y, 'voetR').setScale(0.5);

    let title = this.add.sprite(0, 0, 'titlescreen', 0).setScale(0.8);
    this.aGrid.placeAtIndex(312, title); // 
    this.anims.create({
      key: 'welcome',
      frames: this.anims.generateFrameNumbers('titlescreen', { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1
    });
    title.anims.play('welcome');
    
    this.betekenisAudio = this.sound.add('betekenisAudio', {loop: false});
    this.betekenisAudio.play();
    this.betekenisAudio.on('complete', this.handleEndAudio, this.scene.scene);
  }

  handleEndAudio(){
    this.scene.start('gameplay', { restart: this.restartNext, skeletonObj: this.skeleton});    
  }

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

    this.keypointsGameOjb.leftKnee.x = this.skeleton.leftKnee.x;
    this.keypointsGameOjb.leftKnee.y = this.skeleton.leftKnee.y;

    this.keypointsGameOjb.rightKnee.x = this.skeleton.rightKnee.x;
    this.keypointsGameOjb.rightKnee.y = this.skeleton.rightKnee.y;

    this.keypointsGameOjb.rightWrist.x = this.skeleton.rightWrist.x;
    this.keypointsGameOjb.rightWrist.y = this.skeleton.rightWrist.y;

  }
}