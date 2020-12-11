import Phaser from "phaser";

import css from './style.css';
import PoseNetPlugin from './js/plugins/PoseNetPlugin.js'

import {StartScene} from './scenes/1StartScene.js';
import {TutorialHandenScene} from './scenes/2TutorialHanden.js'; // handen tutorial
import {TutorialVoetenScene} from './scenes/3TutorialVoeten.js'; // voeten tutorial
import {GameBegin} from './scenes/4GameBegin.js'; // story 
import {GamePlayScene} from './scenes/5GamePlayScene.js'; // gameplay
import {EndingScene} from './scenes/6EndingScene.js'; // ending scene
import {TimeOutScene} from './scenes/TimeOutScene.js'; // time out function - melding

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1025,
  height: 1825,
  backgroundColor: 0xFFE5D2,
  plugins: {
    global: [
        { key: 'PoseNetPlugin', plugin: PoseNetPlugin, start: true}
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

game.scene.add(`start`, StartScene, false);
game.scene.add(`tutorial1`, TutorialHandenScene, false);
game.scene.add(`tutorial2`, TutorialVoetenScene, false);
game.scene.add(`gameBegin`, GameBegin, false);
game.scene.add(`gameplay`, GamePlayScene, false);
game.scene.add(`ending`, EndingScene, false);
game.scene.add(`timeOut`, TimeOutScene, false);

game.scene.start(`start`, {restart: false});