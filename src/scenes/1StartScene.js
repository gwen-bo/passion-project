// import PoseNetPlugin from "../index";
import eye from '../assets/img/start/eye.png'
import AlignGrid from '../js/utilities/alignGrid'

export class StartScene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  state; 
  restart; 
  restartNext; 

    init = (data) => {

    console.log(`StartScene INIT`);

    this.restart = data.restart;
    this.restartNext = data.restart;
    if(this.restart === true){
      this.scene.restart({ restart: false})
    }

  }

  eyeObj; 
  posenetplugin;
  preload(){
    this.load.spritesheet('eye', eye, { frameWidth: 800, frameHeight: 598 });
  }
  
  create(){
    this.posenetplugin = this.plugins.get('PoseNetPlugin');
    this.state = "STAND_BY";
    this.eyeObj = this.add.sprite(0, 0, 'eye', 0);
    this.aGrid = new AlignGrid({scene: this.scene, rows:25, cols: 11, height: 1710, width: 1030})
    // this.aGrid.showNumbers();
    this.anims.create({
      key: 'opening',
      frames: this.anims.generateFrameNumbers('eye', { start: 0, end: 7 }),
      frameRate: 15,
      repeat: 0,
    });
    this.anims.create({
      key: 'closed',
      frames: this.anims.generateFrameNumbers('eye', { start: 0, end: 0 }),
      frameRate: 3,
      repeat: -1
    }); 
    this.eyeObj.anims.play('closed');
    this.aGrid.placeAtIndex(126, this.eyeObj);
  }

  activeScore = 0; 
  // PLUGIN
  handlePoses(poses){
    if(poses === false){
        return; 
    }
    poses.forEach(({score}) => {
      if(score >= 0.4){
        this.activeScore++
        return; 
      }else if (score <= 0.05 ){
        this.activeScore === 0;
      }
    })
  }

  fetchPoses = async () => {
    let poses = await this.posenetplugin.poseEstimation();
    this.handlePoses(poses);
  }
 
  update(){
    console.log(this.activeScore);
    this.fetchPoses();

    if(this.activeScore === 0){
      this.eyeObj.anims.play('closed');
    }else if(this.activeScore <= 100 && this.activeScore >= 50){
      console.log('eyes should open')
      this.eyeObj.anims.play('opening');
    }else if(this.activeScore >= 800){
      this.scene.start('tutorial1', {restart: this.restartNext});    
    }else {
      return; 
    }

  }

}