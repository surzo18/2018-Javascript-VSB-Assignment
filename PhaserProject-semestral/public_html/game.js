// GAME GAME GAME
// Name: UNKNOWN
// Author: A.MIN.
// Year: 2018

/*
 * 
 * VYLESIT AI
 * Ottestovat Mobil
 * Vylepšiť LVLOVANIE
 * Spawny upravit
 * Opravit chyby
 */

//Game Globals
var Scene;
var Lvl = 0;
var score = 0;
var lives = 3;
var side = "up";
scaleRatio = window.devicePixelRatio / 3;

var Loading = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:function Loading ()
    {
        Phaser.Scene.call(this, { key: 'Loading' });
    },

    preload: function ()
    {
        Scene = this;
        //MENU assets
        this.load.image('menuBG', 'assets/MenuBG.png');

        
        //GAME assetes
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
        
        this.load.on("progress",function(percent){
            text = Scene.add.text(0, 0, "LOADING YOUR GAME...",{font: "64px Arial",space: "2px",color :"red"});
            Phaser.Display.Align.In.Center(text, Scene.add.zone(window.innerWidth / 2, window.innerHeight / 2, 800, 600));
        });
        
        this.load.on("complete",function(percent){
            Scene.scene.start("Menu", "loading complete");
        });
    },
    
    create: function ()
    {
        
         
          
        
    }
});

var Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:function Loading ()
    {
        Phaser.Scene.call(this, { key: 'Menu' });
    },
    
    
    init: function(data)
    {
                console.log(data);
                Scene = this;
    },
    
    create: function ()
    {
        this.cameras.main.setSize(window.innerWidth, window.innerHeight);
        Scene.BG = this.add.sprite(0, 0, 'menuBG').setOrigin(0);
        var scaleX = this.cameras.main.width / Scene.BG.width;
        var scaleY = this.cameras.main.height / Scene.BG.height;
        var scale = Math.max(scaleX, scaleY);
        Scene.BG.setScale(scale).setScrollFactor(0);
        this.createButtons();
     
    },
    
    createButtons: function(){
       
      var y = 200;
      var style = { font: "bold 25px Georgia", fill: "#1b2fc6", boundsAlignH: "center", boundsAlignV: "middle" };
        
        
       var startButton = this.add.text(window.innerWidth /2, y, 'New Game', style)
      .setInteractive()
      .on('pointerover', () => this.enterButtonHoverState(startButton) )
      .on('pointerout', () => this.enterButtonRestState(startButton) )
      .on('pointerdown', () => this.startNewGame() );
      
      y += 100;
      
       var highScoreButton = this.add.text(window.innerWidth /2, y, 'High Score', style)
      .setInteractive()
      .on('pointerover', () => this.enterButtonHoverState(highScoreButton) )
      .on('pointerout', () => this.enterButtonRestState(highScoreButton) )
      .on('pointerdown', () => this.showHighScore() );
      
       y += 100;
       
      
       var exitButton = this.add.text(window.innerWidth /2, y, 'Exit ', style)
      .setInteractive()
      .on('pointerover', () => this.enterButtonHoverState(exitButton) )
      .on('pointerout', () => this.enterButtonRestState(exitButton) )
      .on('pointerdown', () =>  window.close())
      
    } ,
    
    
    enterButtonHoverState : function(button){
        button.setStyle({ fill: '#4b5de5'});
    },
    
    enterButtonRestState: function(button) {
        button.setStyle({ fill: '#1b2fc6' });
    },
    
    startNewGame: function(){
        Scene.scene.restart("Game");
        Scene.scene.start('Game');
      
    },
    
    showHighScore : function()
    {
        var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

        while ( i-- ) {
            values.push( JSON.parse(localStorage.getItem(keys[i])));
        }
        
        
        values.sort((a, b) => (a.score > b.score) ? 1 : -1);
        console.log("The best score:" +  values[keys.length-1].username + " = " + values[keys.length-1].score + " points");
        console.log("Second place:" + values[keys.length-2].username + " = " + values[keys.length-2].score + " points");
        console.log("Third place:" + values[keys.length-3].username + " = " + values[keys.length-3].score + " points");


    }
  });

var Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:function Loading ()
    {
        Phaser.Scene.call(this, { key: 'Game' });
    },
    
    create: function()
    {
        window.addEventListener('resize', () => {
        game.resize(window.innerWidth, window.innerHeight);
        
        });
        Scene = this;
        map = createMap(Scene);
        createAnimations(Scene);
        var GameObjects = createGameObjects(Scene);
        createPhysics(Scene,GameObjects,map);
        createSounds(Scene);


         setKeyboardListeners(Scene);


         this.cameras.main.setSize(window.innerWidth,window.innerHeight);
         this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
         this.cameras.main.startFollow(player);
         //this.cameras.main.setZoom(5);
         player.speed=64;
         player.lives = 3;

         enemies.speed = 64;

         timedEvent = this.time.addEvent({ delay: 500, callback: normal, callbackScope: this});
    },
    
    
    
    update: function(){
        checkInput();
        updateAi();
    }
    
    });
    
 



//Game Settings
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    pixelArt: true,
    scene: [Loading,Menu,Game],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    }
};
var game = new Phaser.Game(config);




//CREATE-FUNCTIONS:

//This create MAP in scene with JSON-MAP and create Layeres
function createMap(Scene){
     map = Scene.make.tilemap({key: 'json_map'});
     var tiles = map.addTilesetImage('Dungeon_Tileset', 'tiles');
     
     map.Layers = createLayers(map,tiles);

     return map;
     
}

//Create layers for map with tiles ( JSON )
function createLayers(map,tiles)
{
    backgroundLayer = map.createDynamicLayer('Background', tiles, 0, 0);

    collisionLayer = map.createDynamicLayer('Collision', tiles, 0, 0);
    
    slowLayer = map.createDynamicLayer('Slow', tiles, 0, 0);
    fastLayer = map.createDynamicLayer('Fast', tiles, 0, 0);
    itemLayer = map.createDynamicLayer('Item', tiles, 0, 0);
    collisionLayer.setCollisionByExclusion([-1]);
    



    return Layers = {
        backgroundLayer : backgroundLayer,
        collisionLayer : collisionLayer,
        slowLayer : slowLayer,
        fastLayer : fastLayer,
        itemLayer : itemLayer
    };
}

//Create annimations in scene
function createAnimations(Scene)
{

    Scene.anims.create({
        key: 'Playerright',
        frames: Scene.anims.generateFrameNumbers('human', {start: 9, end: 17}),
        frameRate: 4,
        repeat: -1
    });
    
    Scene.anims.create({
        key: 'Playerleft',
        frames: Scene.anims.generateFrameNumbers('human', {start: 27, end: 35}),
        frameRate: 4,
        repeat: -1
    });
    
    Scene.anims.create({
        key: 'Playertop',
        frames: Scene.anims.generateFrameNumbers('human', {start: 0, end: 8}),
        frameRate: 4,
        repeat: -1
    });
    
        Scene.anims.create({
        key: 'Playerdown',
        frames: Scene.anims.generateFrameNumbers('human', {start: 18, end: 26}),
        frameRate: 4,
        repeat: -1
    });
    
        Scene.anims.create({
        key: 'Orcright',
        frames: Scene.anims.generateFrameNumbers('orc', {start: 9, end: 17}),
        frameRate: 4,
        repeat: -1
    });
    
    Scene.anims.create({
        key: 'Orcleft',
        frames: Scene.anims.generateFrameNumbers('orc', {start: 27, end: 35}),
        frameRate: 4,
        repeat: -1
    });
    
    Scene.anims.create({
        key: 'Orctop',
        frames: Scene.anims.generateFrameNumbers('orc', {start: 0, end: 8}),
        frameRate: 4,
        repeat: -1
    });
    
        Scene.anims.create({
        key: 'Orcdown',
        frames: Scene.anims.generateFrameNumbers('orc', {start: 18, end: 26}),
        frameRate: 4,
        repeat: -1
    });
}

//Create all objects for our game and return them
function createGameObjects(Scene){
    return GameObjects = {
        player : Scene.physics.add.sprite(40, 40, 'human'),
        items : Scene.physics.add.sprite(60, 60, 'items'),
        shots : Scene.physics.add.group(),
        cursor : Scene.input.keyboard.createCursorKeys(),
        textScore : Scene.add.text(16, 0, "Score: " + score, {font: "16px Impact"}),
        textLives : Scene.add.text(16, 16, "Lives: " + lives, {font: "16px Impact"}),
        textLvl: Scene.add.text(80, 16, "Lvl: " + Lvl, {font: "16px Impact"}),
        enemies : Scene.physics.add.group(),
    };
    
}

//CreatePhysics for objects (collisions)
function createPhysics(Scene,GameObjects,map)
{
   items = GameObjects.items;
   items.setFrame(3);
   player = GameObjects.player;
   //bombs = GameObjects.bombs;
   shots = GameObjects.shots;
   //items= GameObjects.items;
   enemies = GameObjects.enemies;
   collisionLayer = map.Layers.collisionLayer;
   slowLayer = map.Layers.slowLayer; 
   fastLayer = map.Layers.fastLayer;
   
    fastLayer.setTileIndexCallback(0, normal, Scene);
    slowLayer.setTileIndexCallback(0, normal, Scene);

    fastLayer.setTileIndexCallback(70, faster, Scene);
    slowLayer.setTileIndexCallback(79, slower, Scene);

    
   Scene.physics.add.collider(player, collisionLayer, collisionWithCollisionLayer);
   Scene.physics.add.overlap(player, slowLayer);
   Scene.physics.add.overlap(player, fastLayer);
   
   Scene.physics.add.collider(enemies, collisionLayer,OrcCollision);
   Scene.physics.add.overlap(enemies, fastLayer);
   Scene.physics.add.overlap(enemies, fastLayer);

   Scene.physics.add.collider(player, enemies, Die, null, this);
   Scene.physics.add.collider(shots, enemies, destroyEnemy, null, this);

   Scene.physics.add.overlap(player, items, pickItem);
   Scene.physics.add.collider(enemies, enemies);


   Scene.physics.add.collider(shots, collisionLayer,ShotCollider);
}




//Create sounds for scene and play
function createSounds(Scene){
    Scene.soundFX = Scene.sound.add('game_music', {loop: 'true',volume: 0.05});
    Scene.soundFX.rate = 1;
    Scene.soundFX.play();
}

function setKeyboardListeners(Scene)
{
     Scene.input.keyboard.on('keyup_P', function (e) {
        if (Scene.soundFX.isPlaying)
            Scene.soundFX.pause();
        else
            Scene.soundFX.resume();
   }, Scene);

    Scene.input.keyboard.on('keyup_SPACE', function (e) {

        var velocityX = player.body.velocity.x;
        var velocityY = player.body.velocity.y;
        var shot = shots.create(player.x, player.y, 'shot');
        shot.setFrame(43);
        this.sound.play('shot',{volume: 0.2});


        if (velocityX !== 0 || velocityY !== 0) {
            
            if (velocityX > 0) {
                velocityX += 200;
            } else if (velocityX < 0) {
                velocityX -= 200;
            }

            else if (velocityY > 0) {
                velocityY += 200;
            } else if (velocityY < 0) {
                velocityY -= 200;
            }
            else{
                velocityY += 200;
            }

            shot.setVelocity(velocityX, velocityY);
        }else{
            if (side == "down")
                shot.setVelocity(0,200);
            if (side == "up")
                shot.setVelocity(0,-200);
            if (side == "right")
                shot.setVelocity(200,0);
            if (side == "left")
                shot.setVelocity(-200,0);

        }
    }, Scene);
}

//CREATE - FUNCTION .. this is one of three main programs
function create()
{
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
    
    
    player.speed=64; //nasobky 16
    player.lives = 3;
    
    enemies.speed = 64; //nasobky 16
    
    timedEvent = this.time.addEvent({ delay: 500, callback: normal, callbackScope: this});
    
    //enemies.create(player.x + 20, player.y + 20, 'orc');
}

//END of CREATE-FUNCTIONS

function faster(object,fastLayer){
    if(object === player)
        object.speed = 128;
    else
        enemies.speed = 112;
}

function slower(object,fastLayer){
    if(object === player)
        object.speed = 32;
    else
        enemies.speed = 32;
    
}

function normal(){
    player.speed = 64;
    enemies.speed = 64;
    timedEvent.reset({ delay: 500, callback: normal, callbackScope: this, repeat: 1});
}

//****************************************************************
//****************************************************************
//****************************************************************


//UPDATE - FUNCTIONS

//Check if keys down and make actions
function checkInput(){
    //Left
    if (GameObjects.cursor.left.isDown)
    {
        player.anims.play('Playerleft', true);
        player.body.setVelocityX(-player.speed);
        player.body.setVelocityY(0);
        //player.angle = 90;
        side = "left";
    } 
    //UP
    else if (GameObjects.cursor.up.isDown)
    {
        player.anims.play('Playertop', true);
        player.body.setVelocityX(0);
        player.body.setVelocityY(-player.speed);
        //player.angle = 180;
        side = "up";

    }
    //RIGHT
    else if (GameObjects.cursor.right.isDown)
    {
        player.anims.play('Playerright', true);
        player.body.setVelocityX(player.speed);
        player.body.setVelocityY(0);
        //player.angle = -90;
        side = "right";

    } 
    //DOWN
    else if (GameObjects.cursor.down.isDown)
    {
        player.anims.play('Playerdown', true);
        player.body.setVelocityX(0);
        player.body.setVelocityY(player.speed);
        //player.angle = 0;
        side = "down";

    }
    else{
        //player.anims.play('Playerdown', true);
        player.body.setVelocityX(0);
        player.body.setVelocityY(0);
    }
}

//Update Game Score
function updateScoreScore()
{
    GameObjects.score += 100;
    GameObjects.textScore.setText("Score: " + GameObjects.score);
}



function collisionWithCollisionLayer(player, collisionLayer) {

}

//END of update functions

//****************************************************************
//****************************************************************
//****************************************************************


//MAIN UPDATE FUNCTION
function update()
{
    //player.anims.play('stay', true);
    checkInput();
    updateAi();


    

}


function ShotCollider(shot, collisionLayer) {
    shot.disableBody(true, true);
}

function updateAi(){
    if ( enemies.children.size != Lvl)
    {
        for(var i=enemies.children.size ; i < Lvl; i++){
            var ranX = Phaser.Math.Between(17,map.widthInPixels - 16 );
            var ranY = Phaser.Math.Between(17, map.heightInPixels - 16);
            var newOrk = enemies.create(ranX, ranY, 'orc');
            
            //IF NEW ORK OVERLAPING OTHER ORK OR WALLS CREATE NEW ORK
        }
    }
    
    var enemiesObjects = enemies.getChildren();
    for(var i =0; i <  enemiesObjects.length;i++)
    {
        xDif = player.x - enemiesObjects[i].x;
        yDif = player.y - enemiesObjects[i].y;
        
        var horizontal = 0;
        var vertical = 0;


        if(xDif > 0)
        {
            horizontal = 1;//"right";

        }
        if(xDif < 0)
        {
            horizontal = 2; //"left";
        }
        if(yDif < 0)
        {
            vertical = 3//;"top";

        }
        if(yDif > 0)
        {
            vertical = 4;//"down";
        }

        
        randomN = randomIntFromInterval(1,2);
        if (vertical === 3 && horizontal === 2) {
           
           if(randomN ===1)
           {
                  enemiesObjects[i].anims.play('Orctop',true);
                    enemiesObjects[i].body.setVelocityY(-enemies.speed);
                    enemiesObjects[i].body.setVelocityX(0);
           }
           else{
                    enemiesObjects[i].anims.play('Orcleft',true);
                    enemiesObjects[i].body.setVelocityY(0);
                    enemiesObjects[i].body.setVelocityX(-enemies.speed);
           }
        }
        
        if (vertical === 3 && horizontal === 1) {
           
           if(randomN ===1)
           {
                  enemiesObjects[i].anims.play('Orctop',true);
                    enemiesObjects[i].body.setVelocityY(-enemies.speed);
                    enemiesObjects[i].body.setVelocityX(0);
           }
           else{
                   enemiesObjects[i].anims.play('Orcright',true);
                    enemiesObjects[i].body.setVelocityY(0);
                    enemiesObjects[i].body.setVelocityX(enemies.speed);
           }
        }
        
        if (vertical === 4 && horizontal === 2) {
           
            if(randomN ===1)
           {
                enemiesObjects[i].anims.play('Orcdown',true);
                    enemiesObjects[i].body.setVelocityY(enemies.speed);
                    enemiesObjects[i].body.setVelocityX(0);
           }
           else{
                    enemiesObjects[i].anims.play('Orcleft',true);
                    enemiesObjects[i].body.setVelocityY(0);
                    enemiesObjects[i].body.setVelocityX(-enemies.speed);
           }
        }
        
        if (vertical === 4 && horizontal === 1) {
           
           if(randomN ===1)
           {        
                enemiesObjects[i].anims.play('Orcdown',true);
                    enemiesObjects[i].body.setVelocityY(enemies.speed);
                    enemiesObjects[i].body.setVelocityX(0);
           }
           else{
                   enemiesObjects[i].anims.play('Orcright',true);
                    enemiesObjects[i].body.setVelocityY(0);
                    enemiesObjects[i].body.setVelocityX(enemies.speed);
           }
        }
   }
            

    }
        
function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function OrcCollision(enemy,collisinLayer){
    enemy.body.setVelocityY(150);
}

function Die(player,enemy)
{   var style = { font: "bold 25px Georgia", fill: "#1b2fc6", boundsAlignH: "center", boundsAlignV: "middle" };

         
   
    
    player.lives -=1;
    if(player.lives <= 0)
    {   
        
        player.setTint(0xff0000);
        var username = null;
        while (username === null) 
            username = prompt("zadaj Meno: ");
        var today = new Date();
        var info = {
            username : username,
            score : score
        };
        info = JSON.stringify(info);
        localStorage.setItem(today, info);
        gameOver = true;
        var menuButton = Scene.add.text(window.innerWidth /2 - 100, 300, 'Go to menu', style)
        .setInteractive()
        .on('pointerdown', () => Scene.scene.start("Menu", "loading complete") );
        score = 0;
        Lvl = 1;
        lives=3;
        Scene.physics.pause();

        
    }
    else
    {
        enemies.clear(true);
        updateLives();
        player.x = 40;
        player.y = 40;
        Scene.physics.resume();
    }
    
}

function destroyEnemy(shot,enemy){
    enemy.disableBody(true, true);
    shot.disableBody(true, true);
    updateScore(200);
    enemy.destroy();
    shot.destroy();
}

function updateScore(s)
{
    score = score + s;
    GameObjects.textScore.setText("Score: " + score );
    
    Lvl = score / 100;
    GameObjects.textLvl.setText("Lvl: " + Lvl );
}

function updateLives()
{
    
    lives = lives - 1;
    GameObjects.textLives.setText("Lives: " + lives );
    
}

function pickItem(player,item)
{

    updateScore(100);
    item.disableBody(true, true);
    if (item.body.enable === false)
    {

        x = Phaser.Math.RND.integerInRange(32, map.widthInPixels - 48)
        y = Phaser.Math.RND.integerInRange(32, map.heightInPixels - 48)

        item.enableBody(true, x, y, true, true);
    }
        Scene.sound.play('pick');

    
}

