// Cette variable va être passée en session
let soundOn = true;

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
    })
}

const soundController = document.querySelector('.sound-control');

soundController.addEventListener('click', (event) => {
    document.querySelector('.sound-control_icon--on').classList.toggle('hidden');
    document.querySelector('.sound-control_icon--off').classList.toggle('hidden');
    if ( soundOn ) {
        soundOn = false;
        audio.home.mute(true);
        audio.interior.mute(true);
        audio.travelToOtherSites.mute(true);
        audio.run.mute(true);
        audio.jump.mute(true);
    } else {
        soundOn = true;
        audio.home.mute(false);
        audio.interior.mute(false);
        audio.travelToOtherSites.mute(false);
        audio.run.mute(false);
        audio.jump.mute(false);
    }  
});