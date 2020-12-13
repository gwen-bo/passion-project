import eye from '../assets/img/start/eye.png'
import AlignGrid from '../js/utilities/alignGrid'

export class StartScene extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  restart; 
  restartNext; 
  activeScore; 
  eyeObj; 
  posenetplugin;

    init = (data) => {

    this.activeScore = 0; 
    this.restartNext = data.restart;
    if(data.restart === true){
      this.scene.restart({ restart: false})
    }
  }

  preload(){
    this.load.spritesheet('eye', eye, { frameWidth: 800, frameHeight: 598 });
  }
  
  create(){
    this.activeScore = 0; 
    this.posenetplugin = this.plugins.get('PoseNetPlugin');
    this.eyeObj = this.add.sprite(0, 0, 'eye', 0);
    this.aGrid = new AlignGrid({scene: this.scene, rows: 35, cols: 30, height: window.innerHeight, width: window.innerWidth})
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
    this.aGrid.placeAtIndex(493, this.eyeObj);
  }

  handlePoses(poses){
    if(poses === false){
        return; 
    }
    poses.forEach(({score}) => {
      if(score >= 0.4){
        this.activeScore++
        return; 
      }else if (score <= 0.07 ){
        this.activeScore = 0;
      }
    })
  }

  fetchPoses = async () => {
    let poses = await this.posenetplugin.poseEstimation();
    this.handlePoses(poses);
  }
 
  update(){
    this.fetchPoses();

    if(this.activeScore === 0){
      this.eyeObj.anims.play('closed');
    }else if(this.activeScore <= 100 && this.activeScore >= 30){
      this.eyeObj.anims.play('opening');
    }else if(this.activeScore >= 200){
      this.scene.start('tutorial1', {restart: this.restartNext});    
    }else {
      return; 
    }

  }

}