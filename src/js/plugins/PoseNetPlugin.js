// verstuurt werkelijk de poses maar de update functie werkt niet meer in scene??

var PoseNetPlugin = function (scene)
{
    //  The Scene that owns this plugin
    this.scene = scene;

    this.systems = scene.sys;

    if (!scene.sys.settings.isBooted)
    {
        scene.sys.events.once('boot', this.boot, this);
    }
};

//  Static function called by the PluginFile Loader.
PoseNetPlugin.register = function (PluginManager)
{
    //  Register this plugin with the PluginManager, so it can be added to Scenes.

    //  The first argument is the name this plugin will be known as in the PluginManager. It should not conflict with already registered plugins.
    //  The second argument is a reference to the plugin object, which will be instantiated by the PluginManager when the Scene boots.
    //  The third argument is the local mapping. This will make the plugin available under `this.sys.base` and also `this.base` from a Scene if
    //  it has an entry in the InjectionMap.
    PluginManager.register('PoseNetPlugin', PoseNetPlugin, 'base');
};

let poseNet;
let poses;
let $webcam; 
let loaded = false; 
PoseNetPlugin.prototype = {
    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot: async function ()
    {
        console.log('PoseNetPlugin has started');

        let eventEmitter = this.systems.events;

        this.$webcam = document.querySelector('#webcam');
        // let poseNet; 
        this.poses = [];

        this.$webcam.width = window.innerWidth;
        this.$webcam.height = window.innerHeight;

        this.poseNet = await posenet.load();

        const videostream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$webcam.srcObject = videostream;
        if (!this.$webcam.captureStream) {
            this.$webcam.captureStream = () => videostream;
        };

        this.$webcam.addEventListener('loadeddata', () => {
            console.log('webcam loaded');
            this.loaded = true; 
            this.poseEstimation();
        });

        //  Listening to the following events is entirely optional, although we would recommend cleanly shutting down and destroying at least.
        //  If you don't need any of these events then remove the listeners and the relevant methods too.
        eventEmitter.on('start', this.start, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    //  A test method.
    test: function (name)
    {
        console.log('PoseNetPlugin says hello ' + name + '!');
    },

    //  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
    start: function ()
    {
  
    },

    poseEstimation: async function (){
        const pose = await this.poseNet.estimateSinglePose(this.$webcam, {
            flipHorizontal: true,
        });
    
        this.poses = this.poses.concat(pose);
        // console.log(this.poses);
        this.scene.events.emit('poses', this.poses);
        // this.scene.events.emit('poses', pose);

    },

    //  Called every Scene step - phase 1
    preUpdate: function (time, delta)
    {
    },

    //  Called every Scene step - phase 2
    update: function ()
    {
        if(this.loaded === true){
            this.poseEstimation();
        }
    },

    sendPoses (poses) {
        this.game.events.emit('pose', poses)
    },

    sendTest () {
        this.scene.events.emit('test', 'hallo')
    },


    //  Called every Scene step - phase 3
    postUpdate: function (time, delta)
    {
    },

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown: function ()
    {
    },

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy: function ()
    {
        this.shutdown();

        this.scene = undefined;
    }

};

PoseNetPlugin.prototype.constructor = PoseNetPlugin;

//  Make sure you export the plugin for webpack to expose

module.exports = PoseNetPlugin;