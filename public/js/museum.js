const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 1.5;

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
        this.image = image;
        this.name = name;
        this.width = image.width;
        this.height = image.height;
    };

    draw() {

        c.globalAlpha = 0; 

            if (watchHobbies === true) {
                c.globalAlpha = 1; 
            };

        c.drawImage(this.image, this.position.x, this.position.y);    

        c.globalAlpha = 1; 

    };
};

class Player {

    constructor() {

        this.speed = 3;
        this.position = {
            x: 220,
            y: 384
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

class AlertBubble {
    constructor({ image, name, positionX, positionY }) {

        this.position = {
            x: positionX,
            y: positionY
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.name = name;
    };

    draw() {

        c.globalAlpha = 0;
        // Gestion des apparitions et disparitions des bulles 'alert'
        if (this.name === 'alertBubbleHockey') {
            if (sessionStorage.alertBubbleMuseumHockeyDisappearedOnce === 'true') {
                c.globalAlpha = 0; 
            };

            if (alertHockeyOn && sessionStorage.alertBubbleMuseumHockeyDisappearedOnce === undefined) {
                c.globalAlpha = 1;
            };

            if (player.position.x > 370) {
                sessionStorage.setItem('alertBubbleMuseumHockeyDisappearedOnce', true)
                alertHockeyOn = false;
            };
        };
        if (this.name === 'alertBubbleRetroGaming') {
            if (sessionStorage.alertBubbleMuseumRetroGamingDisappearedOnce === 'true') {
                c.globalAlpha = 0; 
            };

            if (alertRetroGamingOn && sessionStorage.alertBubbleMuseumRetroGamingDisappearedOnce === undefined) {
                c.globalAlpha = 1;
            };

            if (player.position.x > 514) {
                sessionStorage.setItem('alertBubbleMuseumRetroGamingDisappearedOnce', true)
                alertRetroGamingOn = false;
            };
        };
        if (this.name === 'alertBubbleWriting') {
            if (sessionStorage.alertBubbleMuseumWritingDisappearedOnce === 'true') {
                c.globalAlpha = 0; 
            };

            if (alertWritingOn && sessionStorage.alertBubbleMuseumWritingDisappearedOnce === undefined) {
                c.globalAlpha = 1;
            };

            if (player.position.x < 565 && whichFloor === 'first') {
                sessionStorage.setItem('alertBubbleMuseumWritingDisappearedOnce', true)
                alertWritingOn = false;
            };
        };
        if (this.name === 'alertBubbleHistory') {
            if (sessionStorage.alertBubbleMuseumHistoryDisappearedOnce === 'true') {
                c.globalAlpha = 0; 
            };

            if (alertHistoryOn && sessionStorage.alertBubbleMuseumHistoryDisappearedOnce === undefined) {
                c.globalAlpha = 1;
            };

            if (player.position.x < 421 && whichFloor === 'first') {
                sessionStorage.setItem('alertBubbleMuseumHistoryDisappearedOnce', true)
                alertHistoryOn = false;
            };
        };
        if (this.name === 'alertBubbleDetectiveNovels') {
            if (sessionStorage.alertBubbleMuseumDetectiveNovelsDisappearedOnce === 'true') {
                c.globalAlpha = 0; 
            };

            if (alertDetectiveNovelsOn && sessionStorage.alertBubbleMuseumDetectiveNovelsDisappearedOnce === undefined) {
                c.globalAlpha = 1;
            };

            if (player.position.x < 277 && whichFloor === 'first') {
                sessionStorage.setItem('alertBubbleMuseumDetectiveNovelsDisappearedOnce', true)
                alertDetectiveNovelsOn = false;
            };
        };

        c.drawImage(this.image, this.position.x, this.position.y);

        c.globalAlpha = 1;
    };

    update() {

        this.draw();
       
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
        c.globalAlpha = 0; 

        if (this.name === 'prohibitedPhone'){
            if (alertProhibitedPhone === true) {
                c.globalAlpha = 1; 
            };
        };

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

const platforms = [
    new Platform({ 
        x: 161, 
        y: 432,
        image: createImage('/img/groundFloorMuseum.png') 
    }),
    new Platform({ 
        x: 160, 
        y: 288,
        image: createImage('/img/firstFloorMuseum.png') 
    })
];

const genericObjects = [
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage('/img/insideMuseumGroundFloor.png'),
        name: 'museumGroundFloor'
    }),
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage('/img/insideMuseumFirstFloor.png'),
        name: 'museumFirstFloor'
    })
];

const frontObjects = [
    new FrontObject({
        x: (canvas.width - 800) / 2,
        y: (canvas.height - 800) / 2,
        image: createImage('/img/piedestal.png'),
        name: 'piedestal'
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

const alertBubbles = [
    new AlertBubble({
        image: createImage('/img/alertBubble.png'), 
        name: 'alertBubbleHockey',
        positionX: 424,
        positionY: 290 
    }),
    new AlertBubble({
        image: createImage('/img/alertBubble.png'), 
        name: 'alertBubbleRetroGaming',
        positionX: 568,
        positionY: 290 
    }),
    new AlertBubble({
        image: createImage('/img/alertBubble.png'), 
        name: 'alertBubbleWriting',
        positionX: 504,
        positionY: 145 
    }),
    new AlertBubble({
        image: createImage('/img/alertBubble.png'), 
        name: 'alertBubbleHistory',
        positionX: 360,
        positionY: 145 
    }),
    new AlertBubble({
        image: createImage('/img/alertBubble.png'), 
        name: 'alertBubbleDetectiveNovels',
        positionX: 216,
        positionY: 145 
    })
];

const dialogBubbles = [
    new DialogBubble({
        image: createImage('/img/dialogBubble.png'), 
        name: `prohibitedPhone`,
        text: `Can't take my phone here...`,
    })
];

let watchHobbies = false;

let alertProhibitedPhone = false;

let alertHockeyOn = false;
let alertRetroGamingOn = false;
let alertWritingOn = false;
let alertHistoryOn = false;
let alertDetectiveNovelsOn = false;

let lastKey = '';

let spacePressed = false;

let runningSoundTurnedOn = false;

let runningSoundAlreadyOn = false;

let musicReloaded = false;

let whichFloor = 'ground';

let inElevator = false;

function animate() {

    requestAnimationFrame(animate);

    genericObjects.forEach(genericObject => {
        if (whichFloor === 'ground'){
            if (genericObject.name === 'museumGroundFloor'){
                genericObject.draw();  
            };
        };

        if (whichFloor === 'first'){
            if (genericObject.name === 'museumFirstFloor'){
                genericObject.draw();  
            };
        };
        
    });

    platforms.forEach(platform => {
        platform.draw()
    });

    alertBubbles.forEach(alertBubble => {
        alertBubble.update()
    });

    dialogBubbles.forEach(dialogBubble => {
        dialogBubble.update()
    });
    
    player.update();

    if (inElevator){
        player.currentSprite = player.sprites.stand.left;
        switch (whichFloor) {
            case 'ground':
                player.position.x = 720;
                player.position.y = 384;
                break;
            case 'first':
                player.position.x = 720;
                player.position.y = 240;
                break;
            default:
                break;
        };
    };
    

    frontObjects.forEach(frontObject => {
        frontObject.draw() 
    });

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
        && player.position.x < 750
    ){
        player.velocity.x = player.speed;
    } else if (
        (whichFloor === 'ground'
        && (
            keys.left.pressed 
            && lastKey === 'ArrowLeft' 
            && player.position.x >= 160
        ))
        || (whichFloor === 'first'
        && (
            keys.left.pressed 
            && lastKey === 'ArrowLeft' 
            && player.position.x >= 170
        ))
    ){
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;
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
    if (player.position.x <= 160) {
        document.querySelector('.blackbox').style.opacity="1";
        sessionStorage.setItem('comeFrom', 'museum');
        setTimeout(() => {
            location.href = '/';
        }, 100);
    }
};

audio.interior.play();

document.querySelector('.blackbox').style.opacity="0";

animate();

addEventListener('keydown', ({ code }) => {
    switch (code) {
    case 'ArrowLeft':
        if (inElevator){
            inElevator = false;
        };
        if (
            sessionStorage.gameStarted === 'true' 
            && musicReloaded === false 
            && sessionStorage.comeFrom === undefined
        ) {
            musicReloaded = true;
        };
        if (sessionStorage.comeFrom === 'outside') {
            musicReloaded = true;
        };
        if (watchHobbies === false){
            runningSoundTurnedOn = true;
            keys.left.pressed = true;
            player.currentSprite = player.sprites.run.left;
            lastKey = 'ArrowLeft';
            alertProhibitedPhone = false;
        };
        if (watchHobbies === true){
            watchHobbies = false;
            const elementsToHide = document.querySelectorAll('.hobbies-content_hobby');
            elementsToHide.forEach(elementToHide => {
                elementToHide.classList.remove('hidden');
                elementToHide.classList.add('hidden');
            });
            document.querySelector('.close-button').classList.add('hidden');
        };
        break;
    case 'ArrowRight':
        if (inElevator){
            inElevator = false;
        };
        if (
            sessionStorage.gameStarted === 'true' 
            && musicReloaded === false 
            && sessionStorage.comeFrom === undefined
        ) {
            musicReloaded = true;
        };
        if (sessionStorage.comeFrom === 'outside') {
            musicReloaded = true;
        };
        if (watchHobbies === false){
            if (sessionStorage.alertSoundMuseum === undefined){
                sessionStorage.setItem('alertSoundMuseum', true);
                audio.alert.play();
            }
            alertHockeyOn = true;
            alertRetroGamingOn = true;
            alertWritingOn = true;
            alertHistoryOn = true;
            alertDetectiveNovelsOn = true;
            runningSoundTurnedOn = true;
            keys.right.pressed = true;
            player.currentSprite = player.sprites.run.right;
            lastKey = 'ArrowRight';
            alertProhibitedPhone = false;
        };
        if (watchHobbies === true){
            watchHobbies = false;
            const elementsToHide = document.querySelectorAll('.hobbies-content_hobby');
            elementsToHide.forEach(elementToHide => {
                elementToHide.classList.remove('hidden');
                elementToHide.classList.add('hidden');
            });
            document.querySelector('.close-button').classList.add('hidden');
        };
        break;
    case 'ArrowDown':
        break;
    case 'ArrowUp':
        if (
            player.position.x >= 685
            && player.position.x <= 740
            && player.velocity.y === 0 
        ) {
            document.querySelector('.blackbox').style.opacity="1";
            if (sessionStorage.soundOn === 'true'){audio.interior.mute(true);};
            if (sessionStorage.elevatorAlreadyTaken === undefined){
                if (sessionStorage.soundOn === 'true'){audio.elevatorMusic.play();};
                setTimeout(() => {
                    if (whichFloor === 'ground') {
                        whichFloor = 'first';
                        inElevator = true;
                    } else if (whichFloor === 'first') {
                        whichFloor = 'ground';
                        inElevator = true;
                    };
                    if (sessionStorage.soundOn === 'true'){audio.elevatorDing.play();};
                    setTimeout(() => {
                        document.querySelector('.blackbox').style.opacity="0";
                        if (sessionStorage.soundOn === 'true'){audio.interior.mute(false);};
                    }, 300);
                }, 5800);  
                sessionStorage.setItem('elevatorAlreadyTaken', true);
            } else {
                setTimeout(() => {
                    if (whichFloor === 'ground') {
                        whichFloor = 'first';
                        inElevator = true;
                    } else if (whichFloor === 'first') {
                        whichFloor = 'ground';
                        inElevator = true;
                    };
                    if (sessionStorage.soundOn === 'true'){
                        audio.elevatorDing.play();
                        audio.interior.mute(false);
                    }
                    document.querySelector('.blackbox').style.opacity="0";
                }, 100);
            }
            
        };
        if (
            player.position.x > 395 
            && player.position.x < 470 
            && watchHobbies === false
            && whichFloor === 'ground'
        ) {
            watchHobbies = true;
            document.querySelector('.hobbies-content_hobby--hockey').classList.remove('hidden');
            document.querySelector('.close-button').classList.remove('hidden');
        };
        if (
            player.position.x > 539 
            && player.position.x < 614 
            && watchHobbies === false
            && whichFloor === 'ground'
        ) {
            watchHobbies = true;
            document.querySelector('.hobbies-content_hobby--retro-gaming').classList.remove('hidden');
            document.querySelector('.close-button').classList.remove('hidden');
        };
        if (
            player.position.x > 465 
            && player.position.x < 540 
            && watchHobbies === false
            && whichFloor === 'first'
        ) {
            watchHobbies = true;
            document.querySelector('.hobbies-content_hobby--writing').classList.remove('hidden');
            document.querySelector('.close-button').classList.remove('hidden');
        };
        if (
            player.position.x > 321 
            && player.position.x < 400 
            && watchHobbies === false
            && whichFloor === 'first'
        ) {
            watchHobbies = true;
            document.querySelector('.hobbies-content_hobby--history').classList.remove('hidden');
            document.querySelector('.close-button').classList.remove('hidden');
        };
        if (
            player.position.x > 186 
            && player.position.x < 255 
            && watchHobbies === false
        ) {
            watchHobbies = true;
            document.querySelector('.hobbies-content_hobby--detective-novels').classList.remove('hidden');
            document.querySelector('.close-button').classList.remove('hidden');
        };
        break;
    case 'Space':
        if (spacePressed === false && watchHobbies === false) {
            if (player.velocity.y === 0) {
                spacePressed = true;
                audio.jump.play();
                player.velocity.y -= 14;
            };
        }
        break;
    case 'Enter':
        if (watchHobbies === false) {
            alertProhibitedPhone = true;
        }
        break;
    case 'Escape':
        watchHobbies = false;
        const elementsToHide = document.querySelectorAll('.hobbies-content_hobby');
        elementsToHide.forEach(elementToHide => {
            elementToHide.classList.remove('hidden');
            elementToHide.classList.add('hidden');
        });
        document.querySelector('.close-button').classList.add('hidden');
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

document.querySelector('.close-button--hobbies').addEventListener('click', (event) => {
    watchHobbies = false;
    const elementsToHide = document.querySelectorAll('.hobbies-content_hobby');
    elementsToHide.forEach(elementToHide => {
        elementToHide.classList.remove('hidden');
        elementToHide.classList.add('hidden');
    });
    document.querySelector('.close-button--hobbies').classList.add('hidden');
});
