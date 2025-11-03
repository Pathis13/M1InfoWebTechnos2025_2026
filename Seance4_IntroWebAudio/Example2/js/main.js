// About imports and exports in JavaScript modules
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
// and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
// and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export

// default imports of classes from waveformdrawer.js and trimbarsdrawer.js
import WaveformDrawer from './waveformdrawer.js';
import TrimbarsDrawer from './trimbarsdrawer.js';
import Sound from './sound.js';
// "named" imports from utils.js and soundutils.js
import { loadAndDecodeSound } from './soundutils.js';

// The AudioContext object is the main "entry point" into the Web Audio API
let ctx;

const soundURL =
<<<<<<< HEAD
    'https://mainline.i3s.unice.fr/mooc/shoot2.mp3';

const soundURLs = [
   'https://upload.wikimedia.org/wikipedia/commons/a/a3/Hardstyle_kick.wav',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c7/Redoblante_de_marcha.ogg/Redoblante_de_marcha.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c9/Hi-Hat_Cerrado.ogg/Hi-Hat_Cerrado.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/0/07/Hi-Hat_Abierto.ogg/Hi-Hat_Abierto.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3c/Tom_Agudo.ogg/Tom_Agudo.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/a/a4/Tom_Medio.ogg/Tom_Medio.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8d/Tom_Grave.ogg/Tom_Grave.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/68/Crash.ogg/Crash.ogg.mp3',
   'https://upload.wikimedia.org/wikipedia/commons/transcoded/2/24/Ride.ogg/Ride.ogg.mp3'
]

=======
    'https://mainline.i3s.unice.fr/WAMSampler2/audio/808/Maracas%20808.wav';
>>>>>>> e62ff46ed008406c36bb35a7cb2f682b4238fa9b
let decodedSound;
let decodedSounds = [];


let canvas, canvasOverlay;
// waveform drawer is for drawing the waveform in the canvas
// trimbars drawer is for drawing the trim bars in the overlay canvas

let sounds = []
let mousePos = { x: 0, y: 0 }
<<<<<<< HEAD
// index of the currently active sound (shared between handlers and animate)
let activeSoundIndex = 0;

=======
// The button for playing the sound
let playButton = document.querySelector("#playButton");
// disable the button until the sound is loaded and decoded
playButton.disabled = true;
let debugButton; 
>>>>>>> e62ff46ed008406c36bb35a7cb2f682b4238fa9b

window.onload = async function init() {
    ctx = new AudioContext();

     debugButton = document.querySelector("#debug");
     debugButton.onclick = function(evt) {
        waveformDrawer.drawWave(0, canvas.height);
     };

    // two canvas : one for drawing the waveform, the other for the trim bars
    canvas = document.querySelector("#myCanvas");
    const context = canvas.getContext('2d');
    canvasOverlay = document.querySelector("#myCanvasOverlay");

    // create the waveform drawer and the trimbars drawer
    
    // load and decode the sound
    // this is asynchronous, we use await to wait for the end of the loading and decoding
    // before going to the next instruction
    // Note that we cannot use await outside an async function
    // so we had to declare the init function as async
    decodedSound = await loadAndDecodeSound(soundURL, ctx);

    let promises = soundURLs.map(url => loadAndDecodeSound(url, ctx));
    decodedSounds = await Promise.all(promises);
    
    let buttonsContainer = document.querySelector("#buttons");
    
    
    decodedSounds.forEach((element, index) => {
        // create dedicated waveform and trimbars for this sound
        const wf = new WaveformDrawer();
        const tb = new TrimbarsDrawer(canvasOverlay, 100, 200);
        const sound = new Sound(wf, tb, element, canvas);
        // initialize its waveform
        sound.init('#83E83E');
        sounds.push(sound);

        // button to activate and play this sound
        let button = document.createElement("button");
        button.class = "playButton"
        button.textContent = `Play sound ${index + 1}`;
        buttonsContainer.appendChild(button);
        button.onclick = function() {
            // set active sound to this index
            activeSoundIndex = index;
            // play the active sound
            sounds[activeSoundIndex].play(ctx);
            // redraw waveform for the selected sound
            context.clearRect(0, 0, canvas.width, canvas.height);
            sounds[activeSoundIndex].waveForm.drawWave(0, canvas.height);
        };
        button.disabled = false;
    });
    // activeSoundIndex is declared at module scope; default already 0
    console.log(sounds[0])

    // declare mouse event listeners for ajusting the trim bars
    // when the mouse moves, we check if we are close to a trim bar
    // if so: highlight it!
    // if a trim bar is selected and the mouse moves, we move the trim bar
    // when the mouse is pressed, we start dragging the selected trim bar (if any)
    // when the mouse is released, we stop dragging the trim bar (if any)
    canvasOverlay.onmousemove = (evt) => {
        // get the mouse position in the canvas
        let rect = canvas.getBoundingClientRect();

        mousePos.x = (evt.clientX - rect.left);
        mousePos.y = (evt.clientY - rect.top);

        // When the mouse moves, we check if we are close to a trim bar
        // if so: move it!
        // operate on the active sound's trimbars if available
        if (sounds[activeSoundIndex] && sounds[activeSoundIndex].trimBars)
            sounds[activeSoundIndex].trimBars.moveTrimBars(mousePos);
    }

    canvasOverlay.onmousedown = (evt) => {
        // If a trim bar is close to the mouse position, we start dragging it
        if (sounds[activeSoundIndex] && sounds[activeSoundIndex].trimBars)
            sounds[activeSoundIndex].trimBars.startDrag();
    }

    canvasOverlay.onmouseup = (evt) => {
        // We stop dragging the trim bars (if they were being dragged)
        if (sounds[activeSoundIndex] && sounds[activeSoundIndex].trimBars)
            sounds[activeSoundIndex].trimBars.stopDrag();
    }

    // start the animation loop for drawing the trim bars
    requestAnimationFrame(animate);
};

// Animation loop for drawing the trim bars
// We use requestAnimationFrame() to call the animate function
// at a rate of 60 frames per second (if possible)
// see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
function animate() {
    // clear overlay canvas;
    // clear overlay and draw the active sound's trim bars
    if (sounds[activeSoundIndex] && sounds[activeSoundIndex].trimBars) {
        sounds[activeSoundIndex].trimBars.clear();
        sounds[activeSoundIndex].trimBars.draw();
    }

    // redraw in 1/60th of a second
    requestAnimationFrame(animate);
}



