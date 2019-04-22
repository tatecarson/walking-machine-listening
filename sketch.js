// Basic KNN classification of MFFCs
const k = 3; // k can be any integer
let machine;
let soundGuess;
let currentClass = 'cars';
let totalNumSamples = 0; //eslint-disable-line
let currentNumSamples = 0;
let currentNumSamplesFlag = true;
let audio;
const normalized = [];

let mfcc;
let loudness = 0; //eslint-disable-line
let loudnessThreshold = 10;

let soundReady = false; //eslint-disable-line

// TRIGGER MODE
let predictionAlpha = 255;

let singleTrigger = true;
let startTime;
const triggerTimerThreshold = 300;
let timer;

let traffic;
let birds;

let db;
let getData;
let data;
let select;
let trainingSpeed;

let musicToggle;
let musicToggleFlag = true;
let instrument;

function preload() {
  // load firebase
  fb();
}

function setup() {
  const cnv = createCanvas(displayWidth, 200);
  cnv.parent('sketchHolder');

  audio = new MicrophoneInput(512);
  startTime = millis();

  // test for user or trainer
  // to train go to walking.netlify.com/#train
  // eslint-disable-next-line no-restricted-globals
  if (location.hash === '#train') {
    console.log('youre a trainer');
  } else {
    document.getElementById('save-data').style.display = 'none';
  }

  musicToggle = document.getElementById('music-on');
  // Tone.Transport.start();
}

function draw() {
  // console.log(loudness);
  background(255);
  textSize(12);

  /**
   * Setup UI elements
   */
  currentClass = document.getElementById('label').value;
  const record = document.getElementById('record-data');
  loudnessSlider = document.getElementsByClassName('slider')[0];
  loudnessThreshold = Number(loudnessSlider.value);

  /**
   * deal with training sounds and guessing sounds
   */
  if (currentClass === '') {
    // console.log("please select a label before recording")
    record.disabled = true;
  } else {
    record.disabled = false;
  }

  // recording debouncer
  timer = millis() - startTime;
  if (timer > triggerTimerThreshold) {
    singleTrigger = true;
  }

  // Start Training
  if (record.checked) {
    trainSound();
    vizSound();

    if (currentNumSamplesFlag) {
      // reset current samples to 0 when toggle is off only the first time through the loop
      // used for discarding the most recent recording without having to refresh page
      currentNumSamples = 0;
      currentNumSamplesFlag = false;
    }
  } else {
    currentNumSamplesFlag = true;

    // guess only when not training
    guessSound();
  }

  noStroke();
  fill(0, 255, 0, predictionAlpha);
  textSize(50);
  text(soundGuess, 10, 150);

  noStroke();
  fill(0);
  textSize(12);
  text(`loudness threshold: ${floor(loudnessSlider.value)}`, 10, 35);
  text(`total samples: ${totalNumSamples}`, 10, 35 + 20);

  if (predictionAlpha > 0) predictionAlpha -= 5;

  // do Transport manipulation here because draw loop never stops
  if (musicToggle.checked && musicToggleFlag) {
    Tone.Transport.start();
  } else if (!musicToggle.checked && !musicToggleFlag) {
    Tone.Transport.stop();
  }
}

/**
 * Using Loop here because requestAnimationFrame pauses when screen is off.
 * All of the musically important stuff is done in this loop. The drawing components are left above
 * in the draw loop.
 */
const soundLoop = new Tone.Loop(() => {
  /**
   * Start and stop music
   * dispose for better performance
   */
  console.log('repeating');

  if (musicToggle.checked && musicToggleFlag) {
    instrument = instrumentInit();
    instrument.volume.volume.rampTo(-3, 4);

    musicToggleFlag = false;
  } else if (!musicToggle.checked && !musicToggleFlag) {
    // fade out then dispose so no clicks
    instrument.volume.volume.rampTo(-60, 5);
    musicToggleFlag = true;
  }

  // check if instrument exists, if it isn't full of nulls, and if it has faded out
  // then dispose
  if (
    instrument &&
    !_.isNull(instrument.volume.volume) &&
    floor(instrument.volume.volume.value) === -60
  ) {
    instrument.dispose();
    console.log('disposed');
  }

  /**
   * Sound functions that repeat
   */
  if (instrument && !_.isNull(instrument.volume.volume)) {
    soundUpdates();
    guessSound();
  }
}, '8n').start();
