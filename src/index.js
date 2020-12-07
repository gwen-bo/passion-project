import Phaser from "phaser";

import css from './style.css';
import PoseNetPlugin from './js/plugins/PoseNetPlugin.js'

import {StartUp} from './scenes/0StartUp.js';
import {StartScene} from './scenes/1StartScene.js';
import {WelcomeScene} from './scenes/2WelcomeScene.js';
import {Tutorial1Scene} from './scenes/3Tutorial1.js'; // handen tutorial
import {Tutorial1_goal} from './scenes/4Tutorial1_goal.js'; // handen tutorial
import {Tutorial2Scene} from './scenes/5Tutorial2.js'; // handen tutorial
import {Tutorial2_goal} from './scenes/6Tutorial2_goal.js'; // voeten tutorial
import {GameBegin} from './scenes/7GameBegin.js'; // voeten tutorial
import {GamePlayScene} from './scenes/8GamePlayScene.js'; // gameplay -
import {EndingScene} from './scenes/9EndingScene.js'; // ending scene -
import {TimeOutScene} from './scenes/TimeOutScene.js'; // time out function - melding

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1030,
  height: 1710,
  backgroundColor: 0xFFE5D2,
  plugins: {
    scene: [
      { 
        key: 'PoseNetPlugin', plugin: PoseNetPlugin, mapping: 'posenet'
    }
    ]
  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: 0
    }
  },
  scenes: [],
};

const game = new Phaser.Game(config);

game.scene.add(`startup`, StartUp, false);
game.scene.add(`start`, StartScene, false);
game.scene.add(`welcome`, WelcomeScene, false);
game.scene.add(`tutorial1`, Tutorial1Scene, false);
game.scene.add(`tutorial1_goal`, Tutorial1_goal, false);
game.scene.add(`tutorial2`, Tutorial2Scene, false);
game.scene.add(`tutorial2_goal`, Tutorial2_goal, false);
game.scene.add(`gameBegin`, GameBegin, false);
game.scene.add(`gameplay`, GamePlayScene, false);
game.scene.add(`ending`, EndingScene, false);
game.scene.add(`timeOut`, TimeOutScene, false);

game.scene.start(`startup`);