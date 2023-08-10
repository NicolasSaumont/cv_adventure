// Cette variable va être passée en session
let soundOn = true;

const audio = {
    home: new Howl({
        src: './audio/home.mp3',
        html5: true,
        volume: 0.3,
        loop: true
    }),
    interior: new Howl({
        src: './audio/interior.mp3',
        html5: true,
        volume: 0.3,
        loop: true
    }),
    travelToOtherSites: new Howl({
        src: './audio/travelToOtherSites.mp3',
        html5: true,
        volume: 0.3,
        loop: true
    }),
    jump: new Howl({
        src: './audio/jump.mp3',
        html5: true,
        volume: 0.2,
    }),
    run: new Howl({
        src: './audio/run.mp3',
        html5: true,
        volume: 1,
        loop: true
    })
}

const soundController = document.querySelector('.sound-control');

soundController.addEventListener('click', (event) => {
    document.querySelector('.sound-control_icon--on').classList.toggle('hidden');
    document.querySelector('.sound-control_icon--off').classList.toggle('hidden');
    if ( soundOn ) {
        soundOn = false;
        audio.home.volume(0);
        audio.interior.volume(0);
        audio.travelToOtherSites.volume(0);
        // audio.run.volume(0);
        // audio.jump.volume(0);
    } else {
        soundOn = true;
        audio.home.volume(0.3);
        audio.interior.volume(0.3);
        audio.travelToOtherSites.volume(0.3);
        // audio.run.volume(0.3);
        // audio.jump.volume(0.3);
    }
    
});