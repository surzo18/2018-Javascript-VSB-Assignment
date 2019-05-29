import { CST }from "../CST.js";
export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key:CST.SCENES.GAME
        });
    };
    
    
    create()
    {
   console.log("TUUUU");
   //create Map with layers and save it to map variable (map.Layers)
   map = createMap(Scene);
   
   createAnimations(Scene);
   //create all GameObjects for this Scene
   var GameObjects = createGameObjects(Scene);
   //create Physic for all ours game Objects
   createPhysics(Scene,GameObjects,map);
   //create sounds
   createSounds(Scene);
   
   
   //Set Keyboard to actions (set Listeners)
    setKeyboardListeners(Scene);
    
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player);
    
    
    player.speed=60;
    player.lives = 3;
    
    enemies.speed = 60;
    
    timedEvent = this.time.addEvent({ delay: 500, callback: normal, callbackScope: this});
    
    //enemies.create(player.x + 20, player.y + 20, 'orc');
    }


}