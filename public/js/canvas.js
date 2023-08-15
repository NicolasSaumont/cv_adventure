// const quoteController = require('../../app/controllers/quoteController.js');
// const client = require('./database.js');

const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

let phoneOut = false;

// let textHowToGetSnackDisappearedOnce = false;
// let quoteSnackAppeared = false;

function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    return image;
};

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
        }
        else {
        line = testLine;
        };
    };
    context.fillText(line, x, y);
};

// const randomQuote = {
//     getRandomQuote: async () => {
//         try {
//             const sqlQuery = `SELECT * FROM feel_good_quotes ORDER BY RANDOM() LIMIT 1;`;
//             const result = await client.query(sqlQuery);
//             return result.rows[0];
//         } catch (error) {
//             console.trace(error);
//             res.status(500);
//         }
//     }
// };

class Player {

    constructor() {
        this.speed = 3;
        this.position = {
            x: 150,
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
            },
            watchPhone: {
                right: createImage('/img/spritesWatchPhoneRight.png'),
                left: createImage('/img/spritesWatchPhoneLeft.png'),
            }, 
            teleport: {
                right: createImage('img/spritesTeleportingRight.png'),
                left: createImage('img/spritesTeleportingLeft.png'),
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
            else if (this.frames.val >= 11 && (this.currentSprite === this.sprites.teleport.right)) this.frames.val = 0;
            else if (this.frames.val >= 0 && (this.currentSprite === this.sprites.watchPhone.right)) this.frames.val = 0;
            else if (this.frames.val >= 0 && (this.currentSprite === this.sprites.watchPhone.left)) this.frames.val = 0;
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

class Obstacle {
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

        c.globalAlpha = 1; 

        if (
            this.name === 'phoneScreen' 
            && phoneOut === false
            ){
            c.globalAlpha = 0; 
        };

        c.drawImage(this.image, this.position.x, this.position.y);

        c.globalAlpha = 1; 
    };
};

class DialogBubble {
    constructor({ image, name, text, opacity}) {

        this.position = {
            x: player.position.x,
            y: player.position.y
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.image = image;
        this.name = name;

        // Bug avec image.width et image.height qui valent 0 au chargement de la page
        // Le texte s'affiche alors mal
        // Pour régler le bug, je passe les valeurs en dur (image.width = 150 et image.height = 103)

        this.width = 150;
        this.height = 103;
        this.text = text;
    };

    draw() {
        
        // Gestion des apparitions et disparations des bulles 'tuto'
        if (this.name === 'move'){
            if (sessionStorage.textHowToMoveDisappearedOnce === 'true') {
                c.globalAlpha = 0; 
            };
        };

        if (this.name === 'jump'){
            c.globalAlpha = 0;
            if (
                scrollOffSet + player.position.x >= 924 
                && sessionStorage.textHowToJumpDisappearedOnce === undefined
            ){
                c.globalAlpha = 1; 
            };

            if (sessionStorage.textHowToJumpDisappearedOnce === 'true') {
                c.globalAlpha = 0; 
            };   
        };

        if (this.name === 'up'){
            c.globalAlpha = 0;
            if (
                scrollOffSet + player.position.x >= 1320 
                && scrollOffSet + player.position.x <= 1420 
                && sessionStorage.textHowToGoInsideDisappearedOnce === undefined
            ){
                c.globalAlpha = 1; 
            };

            if (
                scrollOffSet + player.position.x < 1320 
                && scrollOffSet + player.position.x > 1420 
                || sessionStorage.textHowToGoInsideDisappearedOnce === 'true'
            ){
                c.globalAlpha = 0; 
            };   
        };

        if (this.name === 'enter'){
            c.globalAlpha = 0;
            if (
                scrollOffSet + player.position.x >= 1680 
                && scrollOffSet + player.position.x <= 1750 
                && sessionStorage.textHowToTakePhoneDisappearedOnce === undefined
            ){
                c.globalAlpha = 1; 
            };

            if (scrollOffSet + player.position.x < 1680 
                && scrollOffSet + player.position.x > 1750 
                || sessionStorage.textHowToTakePhoneDisappearedOnce === 'true'
            ){
                c.globalAlpha = 0; 
            };   
        };

        if (this.name === 'takePhoneAnytime'){
            c.globalAlpha = 0;
            if (
                scrollOffSet + player.position.x >= 2300 
                && scrollOffSet + player.position.x <= 2600 
                && sessionStorage.textWhenToTakePhoneDisappearedOnce === undefined
            ){
                c.globalAlpha = 1; 
            };

            if (scrollOffSet + player.position.x > 2600){
                sessionStorage.removeItem('textWhenToTakePhoneDisappearedOnce')
                sessionStorage.setItem('textWhenToTakePhoneDisappearedOnce', true);
            };  

            if (scrollOffSet + player.position.x < 2300 
                && scrollOffSet + player.position.x > 2600 
                || sessionStorage.textWhenToTakePhoneDisappearedOnce === 'true'
            ){
                c.globalAlpha = 0; 
            };   
        };

        // if (this.name === 'upSnack'){
        //     c.globalAlpha = 0;
        //     if (
        //         scrollOffSet + player.position.x >= 2965 
        //         && scrollOffSet + player.position.x <= 3060 
        //         && textHowToGetSnackDisappearedOnce === false
        //     ){
        //         c.globalAlpha = 1; 
        //     };

        //     if (
        //         scrollOffSet + player.position.x < 2965 
        //         && scrollOffSet + player.position.x > 3060 
        //         || textHowToGetSnackDisappearedOnce === true
        //     ){
        //         c.globalAlpha = 0; 
        //     };   
        // };

        if (this.name === 'upContact'){
            c.globalAlpha = 0;
            if (
                scrollOffSet + player.position.x >= 4910 
                && scrollOffSet + player.position.x <= 4970 
                && sessionStorage.textHowToContactMeDisappearedOnce === undefined
            ){
                c.globalAlpha = 1; 
            };

            if (
                scrollOffSet + player.position.x < 4910 
                && scrollOffSet + player.position.x > 4970 
                || sessionStorage.textHowToContactMeDisappearedOnce === 'true'
            ){
                c.globalAlpha = 0; 
            };   
        };

        // if (this.name === 'snackQuote'){
        //     c.globalAlpha = 0;
        //     if (
        //         scrollOffSet + player.position.x >= 2965 
        //         && scrollOffSet + player.position.x <= 3060 
        //         && quoteSnackAppeared === true
        //     ){
        //         c.globalAlpha = 1; 
        //     };

        //     if (
        //         scrollOffSet + player.position.x < 2965 
        //         && scrollOffSet + player.position.x > 3060 
        //         || quoteSnackAppeared === false
        //     ){
        //         c.globalAlpha = 0; 
        //     };   
        // };

        c.drawImage(this.image, this.position.x, this.position.y);
        
        const maxWidth = this.width;
        const lineHeight = 20;

        c.font = '20px VT323, Arial, serif';
        c.fillStyle = '#000';
        c.textAlign = 'center';

        wrapText(c, this.text, this.position.x + this.width / 2 + 5, this.position.y + this.height / 2 - lineHeight / 2, maxWidth, lineHeight);

        c.globalAlpha = 1;
    };

    update() {

        this.draw();
        this.position.x = player.position.x + 10;
        this.position.y = player.position.y - 100;
       
    };
};

// class QuoteBubble {
//     constructor({ image, name, text }) {

//         this.position = {
//             x: canvas.width / 2 - (canvas.width - 500) / 2,
//             y: 100
//         };
//         this.velocity = {
//             x: 0,
//             y: 0
//         };
//         this.image = image;
//         this.name = name;
//         this.width = image.width;
//         this.height = image.height;
//         this.text = text;
//     };

//     draw() {
        
//         // Gestion des apparitions et disparations des bulles 'quotes'
        
//         c.globalAlpha = 0;
//         if (
//             scrollOffSet + player.position.x >= 2965 
//             && scrollOffSet + player.position.x <= 3060 
//             && quoteSnackAppeared === true
//         ){
//             c.globalAlpha = 1; 
//         };

//         if (
//             scrollOffSet + player.position.x < 2965 
//             && scrollOffSet + player.position.x > 3060 
//             || quoteSnackAppeared === false
//         ){
//             c.globalAlpha = 0; 
//         };   

//         c.drawImage(this.image, this.position.x, this.position.y);
        
//         const maxWidth = this.width;
//         const lineHeight = 20;

//         c.font = '20px VT323, Arial, serif';
//         c.fillStyle = '#000';
//         c.textAlign = 'center';

//         wrapText(c, this.text, this.position.x + this.width / 2 + 5, this.position.y + this.height / 2 - lineHeight / 2, maxWidth, lineHeight);

//         c.globalAlpha = 1;
//     };

//     update() {

//         this.draw();
       
//     };
// };

const player = new Player();

const dialogBubbles = [
    new DialogBubble({
        image: createImage('/img/dialogBubble.png'), 
        name: `move`,
        text: `Press 'Left' and 'Right' to move`,
    }),
    new DialogBubble({
        image: createImage('/img/dialogBubble.png'), 
        name: `jump`,
        text: `Press 'Space' to jump`,
    }),
    new DialogBubble({
        image: createImage('/img/dialogBubble.png'), 
        name: `up`,
        text: `Press 'Up' to go inside`,
    }),
    new DialogBubble({
        image: createImage('/img/dialogBubble.png'), 
        name: `enter`,
        text: `Press 'Enter' to take my phone`,
    }),
    new DialogBubble({
        image: createImage('/img/dialogBubble.png'), 
        name: `takePhoneAnytime`,
        text: `I can take my phone anytime btw`,
    }),
    // new DialogBubble({
    //     image: createImage('/img/dialogBubble.png'), 
    //     name: `upSnack`,
    //     text: `Press 'Up' to get a snack`,
    // }),
    new DialogBubble({
        image: createImage('/img/dialogBubble.png'), 
        name: `upContact`,
        text: `Press 'Up' to contact me`,
    })
];

// const quoteBubbles = [
//     new QuoteBubble({ 
//     image: createImage('/img/snackBubble.png') ,
//     name: `snackQuote`,
//     text: `Requete SQL`,
//     // text: randomQuote.getRandomQuote(),
//     })
// ];

const platforms = [
    new Platform({ 
        x: 0, 
        y: 530,
        image: createImage('/img/floor.png') 
    })
];

const obstacles = [
    new Obstacle({ 
        x: 985, 
        y: 450,
        image: createImage('/img/barrier.png') 
    })
];

const genericObjects = [
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage('/img/backgroundSky.png'),
        name: 'background-sky'
    }), 
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage('/img/backgroundTown.png'),
        name: 'background-town'
    }),
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage('/img/backgroundHouses.png'),
        name: 'background-houses'
    }),
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage('/img/nearHouses.png'),
        name: 'near-houses'
    }),
    new GenericObject({
        x: 100,
        y: 75,
        image: createImage('/img/site-title.png'),
        name: 'title'
    }),
    new GenericObject({
        x: (canvas.width - 500)/2,
        y: (canvas.height - 359)/2,
        image: createImage('/img/phoneScreen.png'),
        name: 'phoneScreen'
    }),
    new GenericObject({
        x: (canvas.width - 412)/2,
        y: (canvas.height + 150)/2,
        image: createImage('/img/starting.png'),
        name: 'starting'
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

let scrollOffSet = 0;

let stepsCount = 0;

let lastKey = '';

let spacePressed = false;

let menuIndex = 1;

let runningSoundTurnedOn = false;

let runningSoundAlreadyOn = false;

let musicReloaded = false;

function animate(req, res) {
    requestAnimationFrame(animate);

    if (sessionStorage.gameStarted === undefined) {
        genericObjects.forEach(genericObject => {
            if (genericObject.name === 'background-sky' || genericObject.name === 'title' || genericObject.name === 'starting') {
               genericObject.draw(); 
            }
        });
    } else {
        genericObjects.forEach(genericObject => {
            if (genericObject.name !== 'starting') {
               genericObject.draw(); 
            }
        });

        platforms.forEach(platform => {
            platform.draw()
        });

        obstacles.forEach(obstacle => {
            obstacle.draw()
        });

        dialogBubbles.forEach(dialogBubble => {
            dialogBubble.update()
        });

        // quoteBubbles.forEach(quoteBubble => {
        //     quoteBubble.update()
        // });

        player.update();

        switch (sessionStorage.comeFrom) {
            case 'library':
                scrollOffSet = 1071;
                player.position.x = 300;
                player.position.y = 481,4;
                genericObjects[0].position.x = -5,35;
                genericObjects[1].position.x = -107;
                genericObjects[2].position.x = -214;
                genericObjects[3].position.x = -1070;
                genericObjects[4].position.x = -1070 + 100;
                platforms[0].position.x = -1070;
                obstacles[0].position.x = -1070 + 985;
                break;
            case 'cityHall':
                scrollOffSet = 1701;
                player.position.x = 300;
                player.position.y = 481,4;
                genericObjects[0].position.x = -8,5;
                genericObjects[1].position.x = -170;
                genericObjects[2].position.x = -340;
                genericObjects[3].position.x = -1701;
                genericObjects[4].position.x = -1701 + 100;
                platforms[0].position.x = -1701;
                obstacles[0].position.x = -1701 + 985;
                break;
            default:
                break;
        }

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
        ){
            stepsCount += player.speed;
        } else if (
            keys.left.pressed 
            && lastKey === 'ArrowLeft'
            && player.position.x > 0
        ){
            stepsCount -= player.speed;
        };

        if (
            (keys.right.pressed 
            && lastKey === 'ArrowRight' 
            && player.position.x < 300) 
        || 
            (keys.right.pressed 
            && lastKey === 'ArrowRight' 
            && scrollOffSet > 4270 
            && player.position.x < 990)
        ){
            player.velocity.x = player.speed;
        } else if (
            (keys.left.pressed 
            && lastKey === 'ArrowLeft' 
            && player.position.x > 150) 
        || (keys.left.pressed 
            && lastKey === 'ArrowLeft' 
            && scrollOffSet === 0 
            && player.position.x > 0)
        ){
            player.velocity.x = -player.speed;
        } else {
            player.velocity.x = 0;

            // Parallax
            if (
                keys.right.pressed 
                && lastKey === 'ArrowRight' 
                && scrollOffSet < 4270
            ){
                scrollOffSet += player.speed;
                platforms.forEach(platform => {
                    platform.position.x -= player.speed * 1;
                });
                obstacles.forEach(obstacle => {
                    obstacle.position.x -= player.speed * 1;
                });
                genericObjects.forEach(genericObject => {
                    switch (genericObject.name) {
                    case 'background-sky':
                        genericObject.position.x -= player.speed * 0.005;
                        break;
                    case 'background-town':
                        genericObject.position.x -= player.speed * 0.1;
                        break;
                    case 'background-houses':
                        genericObject.position.x -= player.speed * 0.2;
                        break;
                    case 'near-houses':
                        genericObject.position.x -= player.speed * 1;
                        break;
                    case 'title':
                        genericObject.position.x -= player.speed * 1
                        break
                    };
                });
            } else if (
                keys.left.pressed 
                && lastKey === 'ArrowLeft' 
                && scrollOffSet > 0
            ){
                scrollOffSet -= player.speed;
                platforms.forEach(platform => {
                    platform.position.x += player.speed * 1;
                });
                obstacles.forEach(obstacle => {
                    obstacle.position.x += player.speed * 1;
                });
                genericObjects.forEach(genericObject => {
                    switch (genericObject.name) {
                    case 'background-sky':
                        genericObject.position.x += player.speed * 0.005;
                        break;
                    case 'background-town':
                        genericObject.position.x += player.speed * 0.1;
                        break;
                    case 'background-houses':
                        genericObject.position.x += player.speed * 0.2;
                        break;
                    case 'near-houses':
                        genericObject.position.x += player.speed * 1;
                        break;
                    case 'title':
                        genericObject.position.x += player.speed * 1
                        break
                    };
                });
            };
        };

        

        // Platform collision detection
        platforms.forEach(platform => {
            if (
                player.position.y + player.height <= platform.position.y
                && player.position.y + player.height + player.velocity.y >= platform.position.y
                // Bug avec platform.width qui vaut 0 au chargement de la page
                // La collision ne fonctionne alors pas
                // Pour régler le bug, je passe les valeurs en dur (platform.width = 5296)
                && player.position.x + player.width >= platform.position.x
                && player.position.x <= platform.position.x + 5296
            ){
                player.velocity.y = 0;
            };
        });

        // Obstacle collision detection
        obstacles.forEach(obstacle => {

            // Bug avec obstacle.width et obstacle.height qui valent 0 au chargement de la page
            // La collision ne fonctionne alors pas
            // Pour régler le bug, je passe les valeurs en dur (obstacle.width = 96 et obstacle.height = 80)
            
            if (
                player.position.y + player.height <= obstacle.position.y + 18
                && player.position.y + player.height + player.velocity.y >= obstacle.position.y + 18
                // ces deux lignes sont à enlever ?? Ce sont elles qui posent problème au chargement de la page...
                && player.position.x + player.width >= obstacle.position.x + 27
                && player.position.x <= obstacle.position.x - 27 + 96
            ){
                player.velocity.y = 0;
            } else if (
                player.position.x + player.width >= obstacle.position.x + 42
                && player.position.x <= obstacle.position.x + 96 - 40
                && player.position.y + player.height >= obstacle.position.y
                && player.position.y <= obstacle.position.y + 80 - 18
            ){
                player.position.x = player.position.x - 1;
                player.velocity.x = 0;
            } else if (
                player.position.x <= obstacle.position.x + 96 - 15
                && player.position.x + player.width >= obstacle.position.x + 42
                && player.position.y + player.height >= obstacle.position.y
                && player.position.y <= obstacle.position.y + 80 - 18
            ){
                player.position.x = player.position.x + 1;
                player.velocity.x = 0;
            };
        }) ;
    }

};


document.querySelector(`.menu-item:nth-child(${menuIndex})`).classList.add('activated');

audio.home.play();  

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
            // audio.home.play();
        }
        if (sessionStorage.comeFrom === 'library') {
            sessionStorage.removeItem('comeFrom');
            musicReloaded = true;
        }
        runningSoundTurnedOn = true;
        keys.left.pressed = true;
        player.currentSprite = player.sprites.run.left;
        lastKey = 'ArrowLeft';
        sessionStorage.removeItem('textHowToMoveDisappearedOnce')
        sessionStorage.setItem('textHowToMoveDisappearedOnce', true);
        if (phoneOut === true) {
            document.querySelector('.phone-navbar').classList.add('hidden');
            phoneOut = false;
        };

        // textHowToGetSnackDisappearedOnce = false;
        // quoteSnackAppeared = false;

        break; 
    case 'ArrowRight':
        if (
            sessionStorage.gameStarted === 'true' 
            && musicReloaded === false 
            && sessionStorage.comeFrom === undefined
        ) {
            musicReloaded = true;
            // audio.home.play();
        }
        if (sessionStorage.comeFrom === 'library') {
            sessionStorage.removeItem('comeFrom');
            musicReloaded = true;
        }
        runningSoundTurnedOn = true;
        keys.right.pressed = true;
        player.currentSprite = player.sprites.run.right;
        lastKey = 'ArrowRight';
        sessionStorage.removeItem('textHowToMoveDisappearedOnce')
        sessionStorage.setItem('textHowToMoveDisappearedOnce', true);
        if (phoneOut === true) {
            document.querySelector('.phone-navbar').classList.add('hidden');
            phoneOut = false;
        };
        
        // textHowToGetSnackDisappearedOnce = false;
        // quoteSnackAppeared = false;

        break;
    case 'ArrowDown':
        if (phoneOut === true) {
            if (menuIndex < 6) {
                document.querySelector(`.menu-item:nth-child(${menuIndex})`).classList.remove('activated');
                menuIndex++;
                document.querySelector(`.menu-item:nth-child(${menuIndex})`).classList.add('activated');
                
            } else {
                document.querySelector(`.menu-item:nth-child(${menuIndex})`).classList.remove('activated');
                menuIndex = 1;
                document.querySelector(`.menu-item:nth-child(${menuIndex})`).classList.add('activated');
            };
        }
        break;
    case 'ArrowUp':
        if (phoneOut === false) {
            // 1320 correspond au scrollOffSet de l'endroit où on veut activer l'event + la position max du player (300)
            // 1420 correspond au scrollOffSet de l'endroit où on veut désactiver l'event + la position max du player (300)
            if (scrollOffSet + player.position.x >= 1060 && scrollOffSet + player.position.x <= 1280) {
                console.log('Vous pouvez me contacter');
                sessionStorage.removeItem('textHowToContactMeDisappearedOnce')
                sessionStorage.setItem('textHowToContactMeDisappearedOnce', true);
            } else if (scrollOffSet + player.position.x >= 1320 && scrollOffSet + player.position.x <= 1420) {
                document.querySelector('.blackbox').style.opacity="1";
                sessionStorage.removeItem('textHowToGoInsideDisappearedOnce')
                sessionStorage.setItem('textHowToGoInsideDisappearedOnce', true);
                sessionStorage.removeItem('comeFrom');
                sessionStorage.setItem('comeFrom', 'outside');
                setTimeout(() => {
                    location.href = location.pathname + 'library';
                }, 100);
            } else if (scrollOffSet + player.position.x >= 1940 && scrollOffSet + player.position.x <= 2060) {
                sessionStorage.removeItem('comeFrom');
                sessionStorage.setItem('comeFrom', 'outside');
                setTimeout(() => {
                    location.href = location.pathname + 'cityHall';
                }, 100);
            } else if (scrollOffSet + player.position.x >= 2965 && scrollOffSet + player.position.x <= 3060) {
                console.log('Appuyer sur "up" pour avoir un snack');
                // quoteSnackAppeared = false;
                // textHowToGetSnackDisappearedOnce = true;
                // quoteSnackAppeared = true;
            } else if (scrollOffSet + player.position.x >= 3440 && scrollOffSet + player.position.x <= 3530) {
                console.log('Vous pouvez entrer dans le Museum');
            } else if (scrollOffSet + player.position.x >= 4420 && scrollOffSet + player.position.x <= 4510) {
                console.log('Vous pouvez entrer dans la school');
            } else if (scrollOffSet + player.position.x >= 4910 && scrollOffSet + player.position.x <= 4970) {
                console.log('Vous pouvez me contacter');
                sessionStorage.removeItem('textHowToContactMeDisappearedOnce')
                sessionStorage.setItem('textHowToContactMeDisappearedOnce', true);
            };
        } else if (phoneOut === true) {
            if (menuIndex > 1) {
                document.querySelector(`.menu-item:nth-child(${menuIndex})`).classList.remove('activated');
                menuIndex--;
                document.querySelector(`.menu-item:nth-child(${menuIndex})`).classList.add('activated');
            } else {
                document.querySelector(`.menu-item:nth-child(${menuIndex})`).classList.remove('activated');
                menuIndex = 6;
                document.querySelector(`.menu-item:nth-child(${menuIndex})`).classList.add('activated');
            };
        };
        break;
    case 'Space':
        if (
            sessionStorage.gameStarted === 'true' 
            && musicReloaded === false 
            && sessionStorage.comeFrom === undefined
        ) {
            musicReloaded = true;
            // audio.home.play();
        }
        if (
            sessionStorage.comeFrom === 'library'
            || sessionStorage.comeFrom === 'cityHall'
        ) {
            sessionStorage.removeItem('comeFrom');
            musicReloaded = true;
        }
        if (spacePressed === false) {
            if (lastKey === 'ArrowLeft' && phoneOut === true) {
                player.currentSprite = player.sprites.stand.left
            } else if (lastKey === 'ArrowRight' && phoneOut === true) {
                player.currentSprite = player.sprites.stand.right
            };
            if (player.velocity.y === 0) {
                spacePressed = true;
                audio.jump.play();
                player.velocity.y -= 18;
            };
            sessionStorage.removeItem('textHowToJumpDisappearedOnce')
            sessionStorage.setItem('textHowToJumpDisappearedOnce', true);
            if (phoneOut === true) {
                document.querySelector('.phone-navbar').classList.add('hidden');
                phoneOut = false;
            };
        }
        break;
    case 'Enter':
        if (sessionStorage.gameStarted === undefined) {
            // audio.home.play();
            sessionStorage.setItem('soundOn', true);
            document.querySelector('.sound-control_icon--on').classList.remove('hidden');
            sessionStorage.setItem("gameStarted", true);
            musicReloaded = true;
            
        } else {
            if (
            sessionStorage.gameStarted === 'true' 
            && musicReloaded === false 
            && sessionStorage.comeFrom === undefined
        ) {
            musicReloaded = true;
            // audio.home.play();
        }
        if (
            sessionStorage.comeFrom === 'library'
            || sessionStorage.comeFrom === 'cityHall'
        ) {
            sessionStorage.removeItem('comeFrom');
            musicReloaded = true;
            
        }
            if (phoneOut === false){
                sessionStorage.removeItem('textHowToMoveDisappearedOnce')
                sessionStorage.setItem('textHowToMoveDisappearedOnce', true);
                sessionStorage.removeItem('textHowToTakePhoneDisappearedOnce')
                sessionStorage.setItem('textHowToTakePhoneDisappearedOnce', true);
                phoneOut = true;
                document.querySelector('.phone-navbar').classList.remove('hidden');
                if (lastKey === 'ArrowLeft') {
                    player.currentSprite = player.sprites.watchPhone.left;
                } else {
                    player.currentSprite = player.sprites.watchPhone.right;
                };

                if (scrollOffSet + player.position.x >= 2300 && scrollOffSet + player.position.x <= 2600) {
                    sessionStorage.removeItem('textWhenToTakePhoneDisappearedOnce')
                    sessionStorage.setItem('textWhenToTakePhoneDisappearedOnce', true);
                }; 
            } else {
                if (player.currentSprite === player.sprites.watchPhone.left) {
                    player.currentSprite = player.sprites.teleport.left;
                } else {
                    player.currentSprite = player.sprites.teleport.right;
                };
                if (sessionStorage.soundOn === 'true'){
                    audio.home.mute(true);
                    audio.teleport.play(); 
                    setTimeout(() => {
                        audio.home.mute(false);
                    }, 1000);
                }
                
                setTimeout(() => {
                    document.querySelector('.blackbox').style.opacity="1";
                }, 800);
                
                setTimeout(() => {
                    document.querySelector(`.menu-item:nth-child(${menuIndex})`).classList.remove('activated');
                    switch (menuIndex) {
                        case 1:
                            scrollOffSet = 1071;
                            player.position.x = 300;
                            player.position.y = 481,4;
                            genericObjects[0].position.x = -5,35;
                            genericObjects[1].position.x = -107;
                            genericObjects[2].position.x = -214;
                            genericObjects[3].position.x = -1070;
                            genericObjects[4].position.x = -1070 + 100;
                            platforms[0].position.x = -1070;
                            obstacles[0].position.x = -1070 + 985;
                            break;
                        case 2:
                            scrollOffSet = 1701;
                            player.position.x = 300;
                            player.position.y = 481,4;
                            genericObjects[0].position.x = -8,5;
                            genericObjects[1].position.x = -170;
                            genericObjects[2].position.x = -340;
                            genericObjects[3].position.x = -1701;
                            genericObjects[4].position.x = -1701 + 100;
                            platforms[0].position.x = -1701;
                            obstacles[0].position.x = -1701 + 985;
                            break;
                        case 3:
                            scrollOffSet = 4164;
                            player.position.x = 300;
                            player.position.y = 481,4;
                            genericObjects[0].position.x = -20,8;
                            genericObjects[1].position.x = -416;
                            genericObjects[2].position.x = -832;
                            genericObjects[3].position.x = -4164;
                            genericObjects[4].position.x = -4164 + 100;
                            platforms[0].position.x = -4164;
                            obstacles[0].position.x = -4164 + 985;
                            break;
                        case 4:
                            scrollOffSet = 4272;
                            player.position.x = 820;
                            player.position.y = 481,4;
                            genericObjects[0].position.x = -21,36;
                            genericObjects[1].position.x = -427,2;
                            genericObjects[2].position.x = -854,4;
                            genericObjects[3].position.x = -4272;
                            genericObjects[4].position.x = -4272 + 100;
                            platforms[0].position.x = -4272;
                            obstacles[0].position.x = -4272 + 985;
                            break;
                        case 5:
                            scrollOffSet = 3183;
                            player.position.x = 300;
                            player.position.y = 481,4;
                            genericObjects[0].position.x = -15,9;
                            genericObjects[1].position.x = -318;
                            genericObjects[2].position.x = -636;
                            genericObjects[3].position.x = -3183;
                            genericObjects[4].position.x = -3183 + 100;
                            platforms[0].position.x = -3183;
                            obstacles[0].position.x = -3183 + 985;
                            break;
                        case 6:
                            scrollOffSet = 4272;
                            player.position.x = 670;
                            player.position.y = 481,4;
                            genericObjects[0].position.x = -21,36;
                            genericObjects[1].position.x = -427,2;
                            genericObjects[2].position.x = -854,4;
                            genericObjects[3].position.x = -4272;
                            genericObjects[4].position.x = -4272 + 100;
                            platforms[0].position.x = -4272;
                            obstacles[0].position.x = -4272 + 985;
                            break;
                        default:
                            break;
                    }
                    document.querySelector('.blackbox').style.opacity="0";
                    phoneOut = false;
                    document.querySelector('.phone-navbar').classList.add('hidden');
                    menuIndex = 1;
                    document.querySelector(`.menu-item:nth-child(${menuIndex})`).classList.add('activated');
                    player.currentSprite = player.sprites.stand.right;
                    
                }, 1000);
            }
        }
        
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

// document.querySelector('.sound-control').addEventListener('click', (event) => {
//     audio.home.stop();
//     audio.home.play();
// });