export class StartUp extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  $webcam = document.querySelector('#webcam');

  // om de input van de webcam om te draaien
  flipPoseHorizontal = true;

  // game settings
  poseNet = undefined; 
  poses = [];
  state = undefined; 
  loaded = false; 

  init = async() => {
    console.log(`StartUp INIT`);

    // this.$webcam.width = window.innerWidth;
    // this.$webcam.height = window.innerHeight;

    // const videostream = await navigator.mediaDevices.getUserMedia({ video: true });
    // this.poseNet = await posenet.load();
    // this.$webcam.srcObject = videostream;
    // if (!this.$webcam.captureStream) {
    //     this.$webcam.captureStream = () => videostream;
    // };

    // this.$webcam.addEventListener('loadeddata', () => {
    //   console.log('webcam loaded');
    //   this.loaded = true; 
    //   this.scene.start('start', { restart: false, webcamObj: this.$webcam, poseNet: this.poseNet});    
    // });
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