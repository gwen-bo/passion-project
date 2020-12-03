import StartUp from './scenes/0StartUp.js';
import StartScene from './scenes/1StartScene.js';
import WelcomeScene from './scenes/2WelcomeScene.js';
import Tutorial1Scene from './scenes/3Tutorial1.js'; // handen tutorial
import Tutorial1_goal from './scenes/4Tutorial1_goal.js'; // handen tutorial
import Tutorial2Scene from './scenes/5Tutorial2.js'; // handen tutorial
import Tutorial2_goal from './scenes/6Tutorial2_goal.js'; // voeten tutorial
import GameBegin from './scenes/7GameBegin.js'; // voeten tutorial
import GamePlayScene from './scenes/8GamePlayScene.js'; // gameplay -
import EndingScene from './scenes/9EndingScene.js'; // ending scene -
import TimeOutScene from './scenes/TimeOutScene.js'; // time out function - melding

export default class Game extends Phaser.Game{
  constructor(){
    let config = {
      type: Phaser.AUTO,
      width: 1464,
      height: 900,
      backgroundColor: 6337683,
      physics: {
        default: 'arcade',
        arcade: {
            gravity: 0
        }
    },      
    scenes: [],
    }
    
    super(config); 
    //start first Scene
    this.scene.add(`startup`, StartUp, false);
    this.scene.add(`start`, StartScene, false);
    this.scene.add(`welcome`, WelcomeScene, false);
    this.scene.add(`tutorial1`, Tutorial1Scene, false);
    this.scene.add(`tutorial1_goal`, Tutorial1_goal, false);
    this.scene.add(`tutorial2`, Tutorial2Scene, false);
    this.scene.add(`tutorial2_goal`, Tutorial2_goal, false);
    this.scene.add(`gameBegin`, GameBegin, false);
    this.scene.add(`gameplay`, GamePlayScene, false);
    this.scene.add(`ending`, EndingScene, false);
    this.scene.add(`timeOut`, TimeOutScene, false);

    this.scene.start('startup');
  }
}
