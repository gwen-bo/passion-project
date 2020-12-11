export class StartUp extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  state = undefined; 
  loaded = false; 

  init = async() => {
    console.log(`StartUp INIT`);
  }


  preload(){
  }

  t = 0; 
  onEvent(){
    console.log('time event started');
    this.t++
    if(this.t >= 2){
      console.log('time event', this.t);
      // this.scene.stop();
      this.scene.start('start', { restart: false});    
    }
  }

  posenetplugin; 
  create(){
    this.posenetplugin = this.plugins.get('PoseNetPlugin');
    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: 10 });    
  }

  fetchPoses = async () => {
    let poses = await this.posenetplugin.poseEstimation();
    console.log(poses)
  }

  update(){
    this.fetchPoses();
    
    // this.events.on('poses', this.handlePoses, this);

  }

}