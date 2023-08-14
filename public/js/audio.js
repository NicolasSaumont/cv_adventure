const audio = {
    home: new Howl({
        src: './audio/home.mp3',
        html5: true,
        volume: 0.3,
        loop: true,
        mute: false
    }),
    interior: new Howl({
        src: './audio/interior.mp3',
        html5: true,
        volume: 0.3,
        loop: true,
        mute: false
    }),
    travelToOtherSites: new Howl({
        src: './audio/travelToOtherSites.mp3',
        html5: true,
        volume: 0.3,
        loop: true,
        mute: false
    }),
    jump: new Howl({
        src: './audio/jump.mp3',
        html5: true,
        volume: 0.2,
        mute: false
    }),
    run: new Howl({
        src: './audio/run.mp3',
        html5: true,
        volume: 1,
        loop: true,
        mute: false
    }),
    flipPages: new Howl({
        src: './audio/flipPages.mp3',
        html5: true,
        volume: 1,
        loop: false,
        mute: false
    }),
    closeBook: new Howl({
        src: './audio/closeBook.mp3',
        html5: true,
        volume: 1,
        loop: false,
        mute: false
    }),
    alert: new Howl({
        src: './audio/alert.mp3',
        html5: true,
        volume: 1,
        loop: false,
        mute: false
    })
}

const soundController = document.querySelector('.sound-control');

function turnSoundOn() {
    document.querySelector('.sound-control_icon--on').classList.remove('hidden');
    document.querySelector('.sound-control_icon--off').classList.add('hidden');
    audio.home.mute(false);
    audio.interior.mute(false);
    audio.travelToOtherSites.mute(false);
    audio.run.mute(false);
    audio.jump.mute(false);
    audio.flipPages.mute(false);
    audio.closeBook.mute(false);
    audio.alert.mute(false);
    sessionStorage.removeItem('soundOn');
    sessionStorage.setItem('soundOn', true);
};

function turnSoundOff() {
    document.querySelector('.sound-control_icon--on').classList.add('hidden');
    document.querySelector('.sound-control_icon--off').classList.remove('hidden');
    audio.home.mute(true);
    audio.interior.mute(true);
    audio.travelToOtherSites.mute(true);
    audio.run.mute(true);
    audio.jump.mute(true);
    audio.flipPages.mute(true);
    audio.closeBook.mute(true);
    audio.alert.mute(true);
    sessionStorage.removeItem('soundOn');
    sessionStorage.setItem('soundOn', false);
};

soundController.addEventListener('click', (event) => {    
    if (sessionStorage.soundOn === 'true') {
        turnSoundOff();
    } else if (sessionStorage.soundOn === 'false') {
        turnSoundOn();
    }  
});