const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0;

class GenericObject {
    constructor({ x, y, image, name }) {
        this.position = {
            x,
            y
        };
        this.image = image;
        this.name = name;
        this.width = image.width;
        this.height = image.height;
    };

    draw() {

        c.drawImage(this.image, this.position.x, this.position.y);    

    };
};

class Player {

    constructor() {

        this.speed = 3;
        this.position = {
            x: 0,
            y: 480
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = 36;
        this.height = 48;
        this.image = createImage('/img/spritesStandRight.png');
        this.frames = {...frames, val: 0, elapsed: 0, max: 6} ;
        this.sprites = {
            stand: {
                right: createImage('/img/spritesStandRight.png'),
                left: createImage('/img/spritesStandLeft.png'),
            },
            run: {
                right: createImage('/img/spritesRunRight.png'),
                left: createImage('/img/spritesRunLeft.png'),
            }
        };
        this.currentSprite = this.sprites.stand.right;
    };

    draw() {
        c.drawImage(
            this.currentSprite, 
            350 * this.frames.val, 
            0,
            350,
            500,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        );          
    };

    update() {
        if (this.frames.max > 1){
            this.frames.elapsed++;
        };

        if (this.frames.elapsed % 5 === 0) {
            this.frames.val++;
            if (this.frames.val >= 0 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) this.frames.val = 0;
            else if (this.frames.val >= 6 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) this.frames.val = 0;
        };

        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        };

    };
};

function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    return image;
};

const genericObjects = [
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage('/img/arcadeGameCenter.png'),
        name: 'arcadeGameCenter'
    })
];

const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    },
};

const player = new Player();

let lastKey = '';

let runningSoundTurnedOn = false;

let runningSoundAlreadyOn = false;

let musicReloaded = false;

sessionStorage.setItem('exit', true);

function runToTheRight() {
    runningSoundTurnedOn = true;
    keys.right.pressed = true;
    player.currentSprite = player.sprites.run.right;
    lastKey = 'ArrowRight';
}

function animate() {

    requestAnimationFrame(animate);

    genericObjects.forEach(genericObject => {
        genericObject.draw() 
    });
    
    player.update();

    if (runningSoundTurnedOn && !runningSoundAlreadyOn) {
        audio.run.play();
        runningSoundAlreadyOn = true;
    }

    if (!runningSoundTurnedOn) {
        audio.run.stop();
        runningSoundAlreadyOn = false;
    }

    if (
        keys.right.pressed 
        && lastKey === 'ArrowRight' 
        && player.position.x < 1030
    ){
        player.velocity.x = player.speed;
    } else if (
        keys.left.pressed 
        && lastKey === 'ArrowLeft' 
        && player.position.x >= 160
    ){
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;
    };

    // animation 

    runToTheRight();

    // Exit
    if (player.position.x >= 720) {
        document.querySelector('.continue').classList.remove('hidden');
    }
};

audio.travelToOtherSites.play();

document.querySelector('.blackbox').style.opacity="0";

animate();

addEventListener('keydown', ({ code }) => {
    if (code === 'Enter') {
        document.querySelector('.blackbox').style.opacity="1";
        sessionStorage.removeItem('comeFrom');
        sessionStorage.setItem('comeFrom', 'portfolio');
        // document.querySelector('.to-top-5-video-games').click();
        window.open('https://www.games.nicolassaumont.com/');
        setTimeout(() => {
            sessionStorage.removeItem('exit', false);
            location.href = '/'; 
        }, 100);
    }
});