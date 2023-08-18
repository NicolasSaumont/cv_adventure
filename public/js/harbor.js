const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0;

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    };

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    };
};

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

class FrontObject {
    constructor({ x, y, image, name }) {
        this.position = {
            x,
            y
        };
        this.speed = 1;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.image = image;
        this.name = name;
        this.width = image.width;
        this.height = image.height;
    };

    draw() {

        c.drawImage(this.image, this.position.x, this.position.y);    

    };

    update() {

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

class Player {

    constructor() {

        this.speed = 3;
        this.position = {
            x: 0,
            y: 416
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

const platforms = [
    new Platform({ 
        x: 0, 
        y: 464,
        image: createImage('/img/floorHarbor.png') 
    })
];

const genericObjects = [
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage('/img/harbor.png'),
        name: 'harbor'
    })
];

const frontObject = new FrontObject({
    x: 650,
    y: 250,
    image: createImage('/img/vogueMerry.png'),
    name: 'vogueMerry',
});

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

let spacePressed = false;

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

function standStill() {
    runningSoundTurnedOn = false;
    keys.right.pressed = false;
    player.currentSprite = player.sprites.stand.right;
}

function animate() {

    requestAnimationFrame(animate);

    platforms.forEach(platform => {
        platform.draw()
    });

    genericObjects.forEach(genericObject => {
        genericObject.draw() 
    });
    
    player.update();

    frontObject.update() 

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

    if (player.position.x > 830){
        player.position.y = 400
    };
    if (player.position.x > 850){
        player.position.y = 390
    };
    if (player.position.x < 870){
        runToTheRight();
    };
    if (player.position.x > 870){
        standStill();
        setTimeout(function () {
            if (player.position.x > 870){
                player.speed = 1.15;
                player.velocity.x = player.speed;
                frontObject.velocity.x = frontObject.speed;
            };
        }, 1000);
    };

    // Platform collision detection
    platforms.forEach(platform => {
        if (
            player.position.y + player.height <= platform.position.y
            && player.position.y + player.height + player.velocity.y >= platform.position.y
            // Bug avec platform.width qui vaut 0 au chargement de la page
            // La collision ne fonctionne alors pas
            // Pour régler le bug, je passe les valeurs en dur (platform.width = 640)
            && player.position.x + player.width >= platform.position.x
            && player.position.x <= platform.position.x + 640
        ){
            player.velocity.y = 0;
        };
    });

    // Exit
    if (player.position.x >= 1059) {
        document.querySelector('.continue').classList.remove('hidden');
    }
};

audio.travelToOtherSites.play();

document.querySelector('.blackbox').style.opacity="0";

animate();

addEventListener('keydown', ({ code }) => {
    switch (code) {
    case 'ArrowLeft':
        if (
            sessionStorage.gameStarted === 'true' 
            && musicReloaded === false 
            && sessionStorage.comeFrom === undefined
        ) {
            musicReloaded = true;
        };
        if (sessionStorage.comeFrom === 'outside') {
            sessionStorage.removeItem('comeFrom');
            musicReloaded = true;
        };
        runningSoundTurnedOn = true;
        keys.left.pressed = true;
        player.currentSprite = player.sprites.run.left;
        lastKey = 'ArrowLeft';
        alertProhibitedPhone = false;
        break;
    case 'ArrowRight':
        if (
            sessionStorage.gameStarted === 'true' 
            && musicReloaded === false 
            && sessionStorage.comeFrom === undefined
        ) {
            musicReloaded = true;
        };
        if (sessionStorage.comeFrom === 'outside') {
            sessionStorage.removeItem('comeFrom');
            musicReloaded = true;
        };
        if (sessionStorage.alertSoundCityHall === undefined){
            sessionStorage.setItem('alertSoundCityHall', true);
            audio.alert.play();
        }
        alertOn = true;
        runningSoundTurnedOn = true;
        keys.right.pressed = true;
        player.currentSprite = player.sprites.run.right;
        lastKey = 'ArrowRight';
        alertProhibitedPhone = false;
        break;
    case 'ArrowDown':
        break;
    case 'ArrowUp':

        break;
    case 'Space':
        if (spacePressed === false) {
            if (player.velocity.y === 0) {
                spacePressed = true;
                audio.jump.play();
                player.velocity.y -= 18;
            };
        }
        break;
    case 'Enter':

        break;
    case 'Escape':

        break;
    };
});

addEventListener('keyup', ({ code }) => {
    if (code === lastKey) {
        switch (code) {
        case 'ArrowLeft':
            runningSoundTurnedOn = false;
            keys.left.pressed = false;
            player.currentSprite = player.sprites.stand.left;
            break;
        case 'ArrowRight':
            runningSoundTurnedOn = false;
            keys.right.pressed = false;
            player.currentSprite = player.sprites.stand.right;
            break;
        case 'ArrowDown':
            break;
        case 'Space':
            if (player.velocity.y === 0) {
                break;
            };
        };
    };
    spacePressed = false;
});

addEventListener('keydown', ({ code }) => {
    if (code === 'Enter') {
        document.querySelector('.blackbox').style.opacity="1";
        sessionStorage.removeItem('comeFrom');
        sessionStorage.setItem('comeFrom', 'portfolio');
        window.open('https://memory.nicolassaumont.com/');
        setTimeout(() => {
            sessionStorage.removeItem('exit', false);
            location.href = '/'; 
        }, 100);
    }
});