export default class StartUp extends Phaser.Scene{
  constructor(config){
    super(config);
  }

  $webcam = document.querySelector('#webcam');
  // om de input van de webcam om te draaien
  flipPoseHorizontal = true;
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;

  // game settings
  poseNet = undefined; 
  poses = [];
  state = undefined; 
  loaded = false; 

  init = async() => {
    console.log(`StartUp INIT`);

    this.$webcam.width = window.innerWidth;
    this.$webcam.height = window.innerHeight;

    const videostream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.poseNet = await posenet.load();
        this.$webcam.srcObject = videostream;
        if (!this.$webcam.captureStream) {
            this.$webcam.captureStream = () => videostream;
        };

      this.$webcam.addEventListener('loadeddata', () => {
        console.log('webcam loaded');
        this.loaded = true; 
        // this.scene.stop();
        this.scene.start('start', { restart: false, webcamObj: this.$webcam, poseNet: this.poseNet});    
    });
  }


  preload(){
  }

  create(){
  }

  update(){
  }

}