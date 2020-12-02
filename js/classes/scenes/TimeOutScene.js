export default class TimeOutScene extends Phaser.Scene{
    constructor(config, utilities){
      super(config, utilities);
    }

    currentScene = 'gameplay'; 

    init = (data) => {
        console.log(`timeOut scene INIT`);
        this.currentScene = data.currentScene;
        let timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, repeat: true });    
    }

  
    preload(){
    }
    
    t = 0; 
    onEvent(){
        this.t++
        if(this.t === 15){
        console.log('time event', this.t);
        // this.scene.stop();
        this.scene.start('start');
        }
    }

    create(){
        let txt = this.add.text(500, 500, 'Hé, ben jij er nog?');
    }
    
    update(){
        
    }
  }