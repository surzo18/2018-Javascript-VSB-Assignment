import { CST }from "../CST.js";
export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key:CST.SCENES.LOAD
        });
    }
    
    preload()
    {
        this.load.image('tiles', 'assets/Dungeon_Tileset.png');
        this.load.tilemapTiledJSON('json_map', 'assets/MapFinal.json');

        this.load.spritesheet('human', 'assets/human_base2.png',
               {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('orc', 'assets/orc_base2.png',
                {frameWidth: 16, frameHeight: 16});

        this.load.spritesheet('shot', 'assets/items.png', {frameWidth: 32, frameHeight: 32});

        this.load.audio('game_music', 'assets/Music.mp3');
        this.load.audio('shot', 'assets/Shot.wav');
        this.load.audio('pick', 'assets/Pick.wav');


        this.load.spritesheet('items', 'assets/items.png',
            {frameWidth: 32, frameHeight: 32});
            
            
        var loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff //white
            }
        })
        
        this.load.on("progress", (percent) => {
            loadingBar.fillRect(this.game.renderer.width / 2, 0, 50, this.game.renderer.height * percent);
            console.log(percent);
        })
    }
    
    
    create(){       
        console.log("LOAD SCENE");
        this.scene.start(CST.SCENES.MENU, "Hello from LOAD");
    }
}