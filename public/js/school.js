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

            if (watchSkills === true) {
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
        if (this.name === 'alertBubbleHardSkills') {
            if (sessionStorage.alertBubbleSchoolHardSkillsDisappearedOnce === 'true') {
                c.globalAlpha = 0; 
            };

            if (alertHardSkillsOn && sessionStorage.alertBubbleSchoolHardSkillsDisappearedOnce === undefined) {
                c.globalAlpha = 1;
            };

            if (player.position.x > 280) {
                sessionStorage.setItem('alertBubbleSchoolHardSkillsDisappearedOnce', true)
                alertHardSkillsOn = false;
            };
        };
        if (this.name === 'alertBubbleLanguages') {
            if (sessionStorage.alertBubbleSchoolLanguagesDisappearedOnce === 'true') {
                c.globalAlpha = 0; 
            };

            if (alertLanguagesOn && sessionStorage.alertBubbleSchoolLanguagesDisappearedOnce === undefined) {
                c.globalAlpha = 1;
            };

            if (player.position.x > 490) {
                sessionStorage.setItem('alertBubbleSchoolLanguagesDisappearedOnce', true)
                alertLanguagesOn = false;
            };
        };
        if (this.name === 'alertBubbleSoftSkills') {
            if (sessionStorage.alertBubbleSchoolSoftSkillsDisappearedOnce === 'true') {
                c.globalAlpha = 0; 
            };

            if (alertSoftSkillsOn && sessionStorage.alertBubbleSchoolSoftSkillsDisappearedOnce === undefined) {
                c.globalAlpha = 1;
            };

            if (player.position.x < 600 && whichFloor === 'first') {
                sessionStorage.setItem('alertBubbleSchoolSoftSkillsDisappearedOnce', true)
                alertSoftSkillsOn = false;
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
        image: createImage('/img/groundFloorSchool.png') 
    }),
    new Platform({ 
        x: 160, 
        y: 288,
        image: createImage('/img/firstFloorSchool.png') 
    })
];

const genericObjects = [
    new GenericObject({
        x: 0,
        y: 0,
        image: createImage('/img/insideSchool.png'),
        name: 'school'
    })
];

const frontObjects = [
    new FrontObject({
        x: (canvas.width - 1280) / 2,
        y: (canvas.height - 853) / 2,
        image: createImage('/img/blackboard.png'),
        name: 'blackboard'
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
        name: 'alertBubbleHardSkills',
        positionX: 295,
        positionY: 290 
    }),
    new AlertBubble({
        image: createImage('/img/alertBubble.png'), 
        name: 'alertBubbleLanguages',
        positionX: 503,
        positionY: 290 
    }),
    new AlertBubble({
        image: createImage('/img/alertBubble.png'), 
        name: 'alertBubbleSoftSkills',
        positionX: 567,
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

let watchSkills = false;

let alertProhibitedPhone = false;

let alertHardSkillsOn = false;
let alertLanguagesOn = false;
let alertSoftSkillsOn = false;

let lastKey = '';

let spacePressed = false;

let runningSoundTurnedOn = false;

let runningSoundAlreadyOn = false;

let musicReloaded = false;

let whichFloor = 'ground';

let inStairs = false;

function animate() {

    requestAnimationFrame(animate);

    genericObjects.forEach(genericObject => {
        genericObject.draw();  
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

    if (inStairs){
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
        sessionStorage.setItem('comeFrom', 'school');
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
        if (inStairs){
            inStairs = false;
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
        if (watchSkills === false){
            runningSoundTurnedOn = true;
            keys.left.pressed = true;
            player.currentSprite = player.sprites.run.left;
            lastKey = 'ArrowLeft';
            alertProhibitedPhone = false;
        };
        if (watchSkills === true){
            watchSkills = false;
            const elementsToHide = document.querySelectorAll('.skills-content_skill');
            elementsToHide.forEach(elementToHide => {
                elementToHide.classList.remove('hidden');
                elementToHide.classList.add('hidden');
            });
            document.querySelector('.close-button').classList.add('hidden');
        };
        break;
    case 'ArrowRight':
        if (inStairs){
            inStairs = false;
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
        if (watchSkills === false){
            if (sessionStorage.alertSoundSchool === undefined){
                sessionStorage.setItem('alertSoundSchool', true);
                audio.alert.play();
            }
            alertHardSkillsOn = true;
            alertLanguagesOn = true;
            alertSoftSkillsOn = true;
            runningSoundTurnedOn = true;
            keys.right.pressed = true;
            player.currentSprite = player.sprites.run.right;
            lastKey = 'ArrowRight';
            alertProhibitedPhone = false;
        };
        if (watchSkills === true){
            watchSkills = false;
            const elementsToHide = document.querySelectorAll('.skills-content_skill');
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
            player.position.x >= 715
            && player.position.x <= 745
            && player.velocity.y === 0 
        ) {
            document.querySelector('.blackbox').style.opacity="1";
            if (sessionStorage.soundOn === 'true'){audio.interior.mute(true);};
            if (sessionStorage.soundOn === 'true'){audio.stairs.play();};
            setTimeout(() => {
                if (whichFloor === 'ground') {
                    whichFloor = 'first';
                    inStairs = true;
                } else if (whichFloor === 'first') {
                    whichFloor = 'ground';
                    inStairs = true;
                };
                setTimeout(() => {
                    document.querySelector('.blackbox').style.opacity="0";
                    if (sessionStorage.soundOn === 'true'){audio.interior.mute(false);};
                }, 300);
            }, 2000);  
        };
        if (
            player.position.x > 280 
            && player.position.x < 325 
            && watchSkills === false
            && whichFloor === 'ground'
        ) {
            watchSkills = true;
            document.querySelector('.skills-content_skill--hard-skills').classList.remove('hidden');
            document.querySelector('.close-button').classList.remove('hidden');
        };
        if (
            player.position.x > 490 
            && player.position.x < 535 
            && watchSkills === false
            && whichFloor === 'ground'
        ) {
            watchSkills = true;
            document.querySelector('.skills-content_skill--languages').classList.remove('hidden');
            document.querySelector('.close-button').classList.remove('hidden');
        };
        if (
            player.position.x > 550 
            && player.position.x < 595 
            && watchSkills === false
            && whichFloor === 'first'
        ) {
            watchSkills = true;
            document.querySelector('.skills-content_skill--soft-skills').classList.remove('hidden');
            document.querySelector('.close-button').classList.remove('hidden');
        };
        break;
    case 'Space':
        if (spacePressed === false && watchSkills === false) {
            if (player.velocity.y === 0) {
                spacePressed = true;
                audio.jump.play();
                player.velocity.y -= 14;
            };
        }
        break;
    case 'Enter':
        if (watchSkills === false) {
            alertProhibitedPhone = true;
        }
        break;
    case 'Escape':
        watchSkills = false;
        const elementsToHide = document.querySelectorAll('.skills-content_skill');
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

document.querySelector('.close-button').addEventListener('click', (event) => {
    watchSkills = false;
    const elementsToHide = document.querySelectorAll('.skills-content_skill');
    elementsToHide.forEach(elementToHide => {
        elementToHide.classList.remove('hidden');
        elementToHide.classList.add('hidden');
    });
    document.querySelector('.close-button').classList.add('hidden');
});
