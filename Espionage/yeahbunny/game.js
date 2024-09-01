let game;
let score = 0;
let maxScore = 7;
let isPlayerDead = false;
let gameOptions = {

    // hero gravity
    heroGravity: 900,

    // gravity when underwater
    underwaterGravity: 30,

    // hero friction when on wall
    heroGrip: 100,

    // hero horizontal speed
    heroSpeed: 200,

    // hero horizontal speed when underwater
    underwaterSpeed: 50,

    // hero jump force
    heroJump: 400,

    // hero hit force
    heroHit: 200,

    // hero jump force when underwater
    underwaterJump: 300,

    // hero double jump force
    heroDoubleJump: 300,

    // trampoline tile impulse
    trampolineImpulse: 500,

    // soldier velocity
    soldierVelocity: 100,

    // velocity needed to kill soldier
    killSpeed: 15
}

// constants to make some numbers more readable
const STOP_TILE = 14;
const TRAMPOLINE_TILE = 13;
const WATER_TILE = 9;
const PAPER_TILE = 15;
const SOLDIER_TILE = 16;

const TILE_SIZE = 32;

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x88dfd7,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 640,
            height: 480
        },
        physics: {
            default: "arcade",
            arcade: {
                debug: false,
                gravity: {
                    y: 0
                }
            }
        },
       scene: [preloadGame, intro, playGame, gameOver, credits]
    }
    game = new Phaser.Game(gameConfig);
}

class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, callback) {
      super(scene, x, y, text, style);
  
      this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerdown', () => this.enterButtonActiveState() )
        .on('pointerup', () => {
          this.enterButtonHoverState();
          callback();
        });
    }
  
    enterButtonHoverState() {
      this.setStyle({ fill: '#ff0'});
    }
  
    enterButtonRestState() {
      this.setStyle({ fill: '#f0f'});
    }
  
    enterButtonActiveState() {
      this.setStyle({ fill: '#0ff' });
    }
  }

class preloadGame extends Phaser.Scene{
    constructor(){
        super("PreloadGame");
    }
    preload(){
        this.load.tilemapTiledJSON("level", "level1.json");
        this.load.image("tile2", "tile2.png");
        this.load.spritesheet('Player', 'Player.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('Soldier', 'Soldier.png', { frameWidth: 16, frameHeight: 16 });
        this.load.audio('music','music.mp3');
        this.load.audio('fail','fail.mp3');
        this.load.audio('jump','jump.wav');
        this.load.audio('fanfare','fanfare.mp3');
        this.load.audio('ouch','ouch.wav');
        this.load.audio('pickup','pickup.wav');
    }
    create(){
        this.scene.start("Intro");
    }
}

class intro extends Phaser.Scene{
    constructor(){
        super("Intro");
    }
    create() {
        let { width, height } = this.sys.game.canvas;
        const text1 = this.add.text(width/2, height/2-100, 'Salta!', { font: '128px Arial' }).setShadow(1, 1).setOrigin(0.5, 0.5);
        text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

        this.add.text(width/2, height/2+50,'It’s 1817 in Salta, United Province of Río de la Plata.').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#ffff00'); 
        this.add.text(width/2, height/2+75,'In the Independence War, María Loreto is a lady who helps').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#ffff00'); 
        this.add.text(width/2, height/2+100,'the independent army with information about the spanish army.').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#ffff00');
    
        this.clickButton = new TextButton(this, 450, 375, 'Play!', { fill: '#f0f', font: '64px Arial'}, () => this.scene.start("PlayGame"));
        this.add.existing(this.clickButton);
    }
}

class gameOver extends Phaser.Scene{
    constructor(){
        super("GameOver");
    }
    create() {
        let { width, height } = this.sys.game.canvas;
        const text1 = this.add.text(width/2, height/2, 'Game Over', { font: '64px Arial' }).setShadow(1, 1).setOrigin(0.5, 0.5);    
        this.clickButton = new TextButton(this, 450, 375, 'Play!', { fill: '#f0f', font: '64px Arial'}, () => this.scene.start("PlayGame"));
        this.add.existing(this.clickButton);
    }
}

class credits extends Phaser.Scene{
    constructor(){
        super("Credits");
    }
    create() {
        this.fanfare = this.sound.add('fanfare');
        this.fanfare.play();
        let { width, height } = this.sys.game.canvas;
        this.add.text(width/2, height/2-200,'Credits:').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#00ff00');
        this.add.text(width/2, height/2-175,'Cecilia Verino - Story').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#00ff00');
        this.add.text(width/2, height/2-150,'Comrade Internet - Art').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#00ff00');
        this.add.text(width/2, height/2-125,'Kate Tavasoli - Music').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#00ff00');
        this.add.text(width/2, height/2-100,'Magnus Lindh - Code').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#00ff00');
        this.add.text(width/2, height/2-75,'Vibhav Bobade - Sfx').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#00ff00');

        this.add.text(width/2, height/2,'Thanks to Maria´s advice, the patriotic army could defend Salta').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#ffff00'); 
        this.add.text(width/2, height/2+25,'against the royalists. But her contributions to the independence').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#ffff00'); 
        this.add.text(width/2, height/2+50,'of the United Provinces of Río de la Plata were long forgotten.').setShadow(1, 1).setOrigin(0.5, 0.5).setColor('#ffff00');
    
        this.clickButton = new TextButton(this, 450, 375, 'Play!', { fill: '#f0f', font: '64px Arial'}, () => this.scene.start("PlayGame"));
        this.add.existing(this.clickButton);
    }
}

class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    create(){

        // set to zero when restarting
        isPlayerDead=false;
        score=0;

        // start the music
        this.music = this.sound.add('music');
        this.music.loop = true;
        this.music.play();

        // add sfx
        this.fail = this.sound.add('fail');
        this.jump = this.sound.add('jump');
        this.ouch = this.sound.add('ouch');
        this.pickup = this.sound.add('pickup');

        // creation of "level" tilemap
        this.map = this.make.tilemap({
            key: "level"
        });

        // add tiles to tilemap
        let tile = this.map.addTilesetImage("tile2", "tile2");

        // which layers should we render? That's right, "layer01"
        this.layer = this.map.createDynamicLayer("layer01", tile);

        // which tiles will collide? Tiles from 1 to 3. Water won't be checked for collisions
        this.layer.setCollision([1,8,13,14]);

        // coin collection
        this.layer.setTileIndexCallback(PAPER_TILE, collectCoin, this);

        // Hero animation
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('Player', { frames: [ 0, 1, 2, 3 ] }),
            frameRate: 8,
            repeat: -1
        });

        // Soldier animation
        this.anims.create({
            key: 'soldierWalk',
            frames: this.anims.generateFrameNumbers('Soldier', { frames: [ 0, 1, 2, 3 ] }),
            frameRate: 8,
            repeat: -1
        });

        // add the hero sprite and enable arcade physics for the hero;
        this.hero = this.physics.add.sprite(32, 1024);
        this.hero.setSize(16,16);
        this.hero.body.setOffset(0,0);
        this.hero.play('walk');

        // soldier group
        this.soldiers = this.physics.add.group({
            defaultKey: 'soldier',
            maxSize: 100,
            createCallback: function (soldier)
            {
                soldier.setName(`soldier${this.getLength()}`);
                //console.log('Created', soldier.name);
            },
            removeCallback: function (soldier)
            {
                //console.log('Removed', soldier.name);
            }
        });

        // set hero horizontal speed
        this.hero.body.velocity.x = gameOptions.heroSpeed;

        // hero can jump at the moment
        this.canJump = true;

        // hero cannot double jump
        this.canDoubleJump = false;

        // hero is not on the wall
        this.onWall = false;

        // hero is not underwater
        this.isUnderwater = false;

        // hero is on land
        this.isOnLand = true;

        // listener for hero input
        this.input.on("pointerdown", this.handleJump, this);

        // set workd bounds to allow camera to follow the hero
        this.cameras.main.setBounds(0, 0, 1920, 1440);

        // make the camera follow the hero
        this.cameras.main.startFollow(this.hero);

        // collect coin
        function collectCoin(sprite, tile) {
            this.layer.removeTileAt(tile.x, tile.y); // remove the tile/coin
            this.pickup.play();
            score++;
            if (score==maxScore) {
                this.music.stop();
                this.scene.start("Credits");
            }
            console.log("Score: " + score);
            this.scoreText.text = "Score: " + score;
            return false;
        }
        /*
        this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => this.addSoldier()
        });
        */

        // add soldiers from tiles
        this.layer.forEachTile(tile => {
            let t = this.layer.getTileAt(tile.x, tile.y);
        
            if ( !t ) {
                return;
            }
        
            if( t.index == SOLDIER_TILE) {
                this.layer.putTileAt(0, tile.x, tile.y);  // replace with empty tile
                this.addSoldier(tile.x*TILE_SIZE,tile.y*TILE_SIZE);
            } 
        });

        // score text
        this.scoreText = this.add.text(10, 10, 'Score: ' + score, { font: '32px Arial', fill: '#ffffff' }).setScrollFactor(0).setShadow(1,1);

    }

    // method to make the hero jump
    handleJump(){
        this.jump.play();

        // is the hero underwater?
        if(this.isUnderwater){

            // in this case, the hero can jump (let's say swim up) only if not already swimming up
            if(this.hero.body.velocity.y >= 0){

                // apply swim force
                this.hero.body.velocity.y = -gameOptions.underwaterJump;
            }
        }

        // hero is not underwater
        else{

            // hero can jump when:
            // canJump is true AND hero is on the ground (blocked.down)
            // OR
            // hero is on the wall
            if((this.canJump && this.hero.body.blocked.down) || this.onWall){

                // apply jump force
                this.hero.body.velocity.y = -gameOptions.heroJump;

                // is the hero on a wall?
                if(this.onWall){

                    // change horizontal velocity too. This way the hero will jump off the wall
                    this.setHeroXVelocity(true);
                }

                // hero can't jump anymore
                this.canJump = false;

                // hero is not on the wall anymore
                this.onWall = false;

                // hero can now double jump
                this.canDoubleJump = true;
            }
            else{

                // can the hero double jump?
                if(this.canDoubleJump){

                    // hero can't double jump anymore
                    this.canDoubleJump = false;

                    // apply double jump force
                    this.hero.body.velocity.y = -gameOptions.heroDoubleJump;
                }
            }
        }
    }

    // method to be executed at each frame
    update(){

        if (isPlayerDead) return;

        // check which tile the hero is on
        let tile = this.map.getTileAtWorldXY(this.hero.x, this.hero.y);

        // hero is underwater when over a water tile
        this.isUnderwater = tile != null && tile.index == WATER_TILE;

        // if the hero is underwater...
        if(this.isUnderwater){

            // if the hero is swimming up...
            if(this.hero.body.velocity.y < 0){

                // ... reduce swimming force
                this.hero.body.velocity.y *= 0.9;
            }

            // if the hero is drowning ...
            if(this.hero.body.velocity.y > 0){

                // ... reduce drowning force
                this.hero.body.velocity.y *= 0.97;
            }

            // if the hero is also on the land, this means the hero jumped in the water right now
            if(this.isOnLand){

                // reduce hero vertical velocity
                this.hero.body.velocity.y *= 0.5;

                // hero is no more on land
                this.isOnLand = false;
            }
        }

        // if the hero is not underwater...
        else{

            // the hero is on land
            this.isOnLand = true;
        }

        // apply the proper gravity according to hero being on land or underwater
        this.hero.body.gravity.y = this.isUnderwater ? gameOptions.underwaterGravity : gameOptions.heroGravity;

        // hero is not on wall
        this.onWall = false;

        // method to set hero velocity. Arguments are:
        // * move toward default direction
        // * should hero stop?
        // * is the hero underwater?
        this.setHeroXVelocity(true, false, this.isUnderwater);

        // handle overlap between hero and soldiers
        this.physics.world.overlap(this.hero, this.soldiers, function(hero, soldier){
            
            if (hero.body.velocity.y>gameOptions.killSpeed){
                this.soldiers.killAndHide(soldier);
                //  And disable the body
                soldier.body.enable = false;
                // play sound
                this.ouch.play()
                // apply hit force
                this.hero.body.velocity.y = -gameOptions.heroHit;
            } else {
                isPlayerDead=true;
                this.music.stop();
                this.fail.play();
                const cam = this.cameras.main;
                cam.shake(1000, 0.05);
                cam.fade(1000, 0, 0, 0);
                cam.once("camerafadeoutcomplete", () => {
                    this.hero.destroy();
                    this.scene.start("GameOver");
                  });
            }
        }, null, this);

        // handle collision between soldier and tiles
        this.physics.world.collide(this.soldiers, this.layer, function(soldier, layer){

            // some temporary variables to determine if the soldier is blocked only once
            //let blockedDown = hero.body.blocked.down;
            let blockedLeft = soldier.body.blocked.left;
            let blockedRight = soldier.body.blocked.right;

            // soldier on the ground and touching a wall on the right
            if(blockedRight){

                // horizontal flip soldier sprite
                soldier.flipX = true;
            }

            // soldier on the ground and touching a wall on the right
            if(blockedLeft){

                // default orientation of soldier sprite
                soldier.flipX = false;
            }

            // adjust hero speed according to the direction the soldier is moving
            soldier.flipX ? soldier.body.velocity.x = -gameOptions.soldierVelocity : soldier.body.velocity.x = gameOptions.soldierVelocity;
        }, null, this);

        // handle collision between hero and tiles
        this.physics.world.collide(this.hero, this.layer, function(hero, layer){

            // should the hero stop?
            let shouldStop = false;

            // some temporary variables to determine if the hero is blocked only once
            let blockedDown = hero.body.blocked.down;
            let blockedLeft = hero.body.blocked.left;
            let blockedRight = hero.body.blocked.right;

            // if the hero hits something, no double jump is allowed
            this.canDoubleJump = false;

            // hero on the ground
            if(blockedDown){

                // hero can jump
                this.canJump = true;

                // if we are on tile 2 (stop tile)...
                if(layer.index == STOP_TILE){

                    // hero should stop
                    shouldStop = true;
                }

                // if we are on a trampoline and previous hero vertical velocity was greater than zero...
                if(layer.index == TRAMPOLINE_TILE && this.previousYVelocity > 0){

                    // trampoline jump!
                    hero.body.velocity.y = -gameOptions.trampolineImpulse;

                    // hero can double jump
                    this.canDoubleJump = true
                }

            }

            // hero on the ground and touching a wall on the right
            if(blockedRight){

                // horizontal flip hero sprite
                hero.flipX = true;
            }

            // hero on the ground and touching a wall on the right
            if(blockedLeft){

                // default orientation of hero sprite
                hero.flipX = false;
            }

            // hero NOT on the ground and touching a wall but not underwater
            if((blockedRight || blockedLeft) && !blockedDown && !this.isUnderwater){

                // hero on a wall
                hero.scene.onWall = true;

                // remove gravity
                hero.body.gravity.y = 0;

                // set new y velocity
                hero.body.velocity.y = gameOptions.heroGrip;
            }

            // adjust hero speed according to the direction the hero is moving
            this.setHeroXVelocity(!this.onWall || blockedDown, shouldStop, this.isUnderwater);
        }, null, this);

        // save current vertical velocity
        this.previousYVelocity = this.hero.body.velocity.y;

    }

    // method to set hero horizontal velocity
    setHeroXVelocity(defaultDirection, stopIt, underwater){

        // should the hero stop?
        if(stopIt){

            // ... then stop!
            this.hero.body.velocity.x = 0;
        }
        else{

            // set hero speed also checking if the hero is underwater or whether the hero looks left or right
            this.hero.body.velocity.x = (underwater ? gameOptions.underwaterSpeed : gameOptions.heroSpeed) * (this.hero.flipX ? -1 : 1) * (defaultDirection ? 1 : -1);
        }
    }

    activateSoldier(soldier)
    {
        soldier
            .setActive(true)
            .setVisible(true)
            .setSize(16,16)
            .setVelocity(100,0)
            .play('soldierWalk');
        soldier.body.setOffset(0,0);
        soldier.body.gravity.y = 900;
    }

    addSoldier(x,y)
    {
        // Random position above screen
        //const x = Phaser.Math.Between(0, 1920);
        //const y = Phaser.Math.Between(0, 1440);

        // Find first inactive sprite in group or add new sprite, and set position
        const soldier = this.soldiers.get(x, y);

        // None free or already at maximum amount of sprites in group
        if (!soldier) { return; }

        this.activateSoldier(soldier);
    }
}
