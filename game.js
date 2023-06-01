class GlobalScene extends Phaser.Scene {
    constructor() {
        super("globalscene");
    }
    create() {
        this.registry.set("characterX", 100);
        this.registry.set("characterY", 200);
        this.registry.set("isChange", false);
        this.scene.start("rightnowscene");
    }
}

class RightNowScene extends Phaser.Scene {
    constructor() {
        super("rightnowscene");
    }
    preload() {
        this.load.path = './assets/';
        this.load.image("main_character", "textures/main_character.png");
        this.load.image("wall", "textures/wall.png");
        this.load.image("bush", "textures/bush.png");
    }
    create() {
        this.isCollide = false;
        this.cameras.main.setBackgroundColor('#1594d4');

        this.mainCharacter = this.physics.add.sprite(this.registry.get("characterX"), this.registry.get("characterY"), 'main_character')
        .setInteractive()
        .setScale(1.5)
        .setCollideWorldBounds(true);

        // control sprite
        this.cursors = this.input.keyboard.addKeys('W,A,S,D,T');

        this.wallGroup = this.physics.add.group();
        this.createWall();

        this.interactiveGroup = this.physics.add.group();
        this.createInteractive();

        this.finish = this.physics.add.sprite(780, 300);
        this.finish.setDisplaySize(20, 300);
        this.finish.setVisible(false);
        this.finish.setImmovable(true);
        this.finish.body.allowGravity = false;

        this.physics.add.collider(this.mainCharacter, this.wallGroup);
        this.physics.add.collider(this.mainCharacter, this.interactiveGroup, this.collideInteractive, null, this);
        this.physics.add.collider(this.interactiveGroup, this.wallGroup);
        this.physics.add.collider(this.mainCharacter, this.finish, this.gameFinish, null, this);
    }
    update() {
        if (this.cursors.A.isDown) {
            this.mainCharacter.setVelocityX(-160);
        }
        else if (this.cursors.D.isDown) {
            this.mainCharacter.setVelocityX(160);
        }
        else {
            this.mainCharacter.setVelocityX(0);
        }

        if (this.cursors.W.isDown && this.mainCharacter.body.touching.down) {
            this.mainCharacter.setVelocityY(-150);
        }

        if (this.cursors.T.isDown) {
            // press T to time travel and store the location of the character
            this.registry.set("characterX", this.mainCharacter.x);
            this.registry.set("characterY", this.mainCharacter.y);
            this.mask = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xffffff);
            this.mask.setOrigin(0, 0);
            this.mask.alpha = 0;
            this.tweens.add({
                targets: this.mask,
                alpha: 1,
                duration: 1000, // 淡出动画持续时间，以毫秒为单位
                onComplete: () => {
                    this.scene.start("pastscene");
                }
            });
        }
    }
    createWall() {
        this.wall1 = this.add.tileSprite(400, 300, 800, 10, 'wall');
        this.wall1Collider = this.wallGroup.create(this.wall1.x, this.wall1.y);
        this.wall1Collider.setDisplaySize(this.wall1.width, this.wall1.height);
        this.wall1Collider.setVisible(false);
        this.wall1Collider.setImmovable(true);
        this.wall1Collider.body.allowGravity = false;
    }
    createInteractive() {
        if (!this.registry.get("isChange")) {
            this.bush = this.interactiveGroup.create(500, 250, 'bush')
            .setScale(5)
            .setImmovable(true)
            .body.allowGravity = false;
        } else {
            this.add.text(100, 100, "You travel to the past to stop the bush grow\nnow you can pass it easily");
            this.bush = this.interactiveGroup.create(500, 280, 'bush')
            .setScale(2)
            .setImmovable(true)
            .body.allowGravity = false;
        }
    }
    collideInteractive() {
        if (!this.isCollide) {
            this.isCollide = true;
            if (!this.registry.get("isChange")) {
                this.tip = this.add.text(300, 400, "Seem like you can't jump over it.\nTry press T to time travel");
            } else {
                this.tip = this.add.text(300, 400, "It's short now, you can jump over it");
            }
            this.time.delayedCall(3000, () => {
                this.tweens.add({
                    targets: this.tip,
                    alpha: 0,
                    duration: 1000, // 淡出动画持续时间，以毫秒为单位
                    onComplete: () => {
                        this.isCollide = false;
                    }
                });
            })
        } 
    }
    gameFinish() {
        this.mask = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xffffff);
        this.mask.setOrigin(0, 0);
        this.mask.alpha = 0;
        this.tweens.add({
            targets: this.mask,
            alpha: 1,
            duration: 1000, // 淡出动画持续时间，以毫秒为单位
            onComplete: () => {
                this.scene.start("finalscene");
            }
        });
    }
}

class PastScene extends Phaser.Scene {
    constructor() {
        super("pastscene")
    }
    preload() {
        this.load.path = './assets/';
        this.load.image("main_character", "textures/main_character.png");
        this.load.image("wall", "textures/wall.png");
        this.load.image("bush", "textures/bush.png");
    }
    create() {
        this.isCollide = false;
        this.cameras.main.setBackgroundColor('#1594d4');

        this.add.text(100, 100, "Past Time");

        this.mainCharacter = this.physics.add.sprite(this.registry.get("characterX"), this.registry.get("characterY"), 'main_character')
        .setInteractive()
        .setScale(1.5)
        .setCollideWorldBounds(true);

        // control sprite
        this.cursors = this.input.keyboard.addKeys('W,A,S,D,T');

        this.wallGroup = this.physics.add.group();
        this.createWall();

        this.interactiveGroup = this.physics.add.group();
        this.createInteractive();

        this.physics.add.collider(this.mainCharacter, this.wallGroup);
        this.physics.add.collider(this.mainCharacter, this.interactiveGroup, this.collideInteractive, null, this);
        this.physics.add.collider(this.interactiveGroup, this.wallGroup);
    }
    update() {
        if (this.cursors.A.isDown) {
            this.mainCharacter.setVelocityX(-160);
        }
        else if (this.cursors.D.isDown) {
            this.mainCharacter.setVelocityX(160);
        }
        else {
            this.mainCharacter.setVelocityX(0);
        }

        if (this.cursors.W.isDown && this.mainCharacter.body.touching.down) {
            this.mainCharacter.setVelocityY(-100);
        }

        if (this.cursors.T.isDown) {
            // press T to time travel and store the location of the character
            this.registry.set("characterX", this.mainCharacter.x);
            this.registry.set("characterY", this.mainCharacter.y);
            this.mask = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0xffffff);
            this.mask.setOrigin(0, 0);
            this.mask.alpha = 0;
            this.tweens.add({
                targets: this.mask,
                alpha: 1,
                duration: 1000, // 淡出动画持续时间，以毫秒为单位
                onComplete: () => {
                    this.scene.start("rightnowscene");
                }
            });
        }
    }
    createWall() {
        this.wall1 = this.add.tileSprite(400, 300, 800, 10, 'wall');
        this.wall1Collider = this.wallGroup.create(this.wall1.x, this.wall1.y);
        this.wall1Collider.setDisplaySize(this.wall1.width, this.wall1.height);
        this.wall1Collider.setVisible(false);
        this.wall1Collider.setImmovable(true);
        this.wall1Collider.body.allowGravity = false;
    }
    createInteractive() {
        this.bush = this.interactiveGroup.create(500, 280, 'bush')
        .setScale(2)
        .setImmovable(true)
        .body.allowGravity = false;
    }
    collideInteractive() {
        if (!this.isCollide) {
            this.isCollide = true;
            this.registry.set("isChange", true);
            let tip = this.add.text(300, 400, "Oh! You just step on the little bush\nit won't grow to that large in the future\nlet's travel back.");
            this.time.delayedCall(3000, () => {
                this.tweens.add({
                    targets: tip,
                    alpha: 0,
                    duration: 1000, // 淡出动画持续时间，以毫秒为单位
                    onComplete: () => {
                        this.isCollide = false;
                    }
                })
            });
        }
        console.log("isCollide"); 
    }
}

class FinalScene extends Phaser.Scene {
    constructor() {
        super("finalscene");
    }
    create() {
        this.add.text(300, 300, "You solve the puzzle\nany press to restart.");
        this.input.on('pointerdown', () => {
            this.scene.start('globalscene');
        })
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [GlobalScene, RightNowScene, PastScene, FinalScene], //
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 }, // 可以根据需要调整重力
        debug: false, // 设置为 true 以查看调试信息，如碰撞边界框
      }
    }
  };
  
  const game = new Phaser.Game(config);