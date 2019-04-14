//Basic KNN classification of MFFCs
var k = 3; //k can be any integer
var machine;
var test;
var currentClass = 'cars';
var totalNumSamples = 0;
var currentNumSamples = 0;
var currentNumSamplesFlag = true;
var audio;
var normalized = [];

var mfcc;
var loudness = 0;
var loudnessThreshold = 10;

var soundReady = false;

//TRIGGER MODE
var predictionAlpha = 255;

var singleTrigger = true;
var startTime;
var triggerTimerThreshold = 300;
var timer;
var test = '';

var traffic, birds;

var db, getData, data;
var select;
var trainingSpeed;

let musicToggle;
let musicToggleFlag = true;
let instrument;

function preload() {
  // load firebase
  fb();
}

function setup() {
  var cnv = createCanvas(displayWidth, 200);
  cnv.parent("sketchHolder");

  audio = new MicrophoneInput(512);
  startTime = millis();
}

function draw() {
  background(255);
  textSize(12);

  /**
   * Setup UI elements
   */
  currentClass = document.getElementById("label").value;
  var record = document.getElementById('record-data');
  loudnessSlider = document.getElementsByClassName('slider')[0];
  loudnessThreshold = loudnessSlider.value;

  /** 
   * Start and stop music
   * dispose for better performance 
   */
  musicToggle = document.getElementById('music-on')
  if (musicToggle.checked && musicToggleFlag) {
    instrument = instrumentInit();
    instrument.volume.volume.value = -3;
    Tone.Transport.start();
    musicToggleFlag = false;

  } else if (!musicToggle.checked && !musicToggleFlag) {
    Tone.Transport.stop();

    //fade out then dispose so no clicks
    instrument.volume.volume.rampTo(-60, 5);
    musicToggleFlag = true;
  }

  // check if instrument exists, if it isn't full of nulls, and if it has faded out
  // then dispose
  if (instrument && !_.isNull(instrument.volume.volume) && floor(instrument.volume.volume.value) == -60) {
    instrument.dispose();
    console.log('disposed')
  }


  /**
   * deal with training sounds and guessing sounds
   */
  if (currentClass == '') {
    // console.log("please select a label before recording")
    record.disabled = true
    loudnessSlider.disabled = true
    loudnessSlider.style.opacity = 0.1;
  } else {
    record.disabled = false
    loudnessSlider.disabled = false
    loudnessSlider.style.opacity = 0.7;
  }

  // recording debouncer 
  timer = millis() - startTime;
  if (timer > triggerTimerThreshold) {
    singleTrigger = true;
  }

  vizSound();

  // Start Training 
  if (record.checked) {
    trainSound();

    if (currentNumSamplesFlag) {
      // reset current samples to 0 when toggle is off only the first time through the loop
      // used for discarding the most recent recording without having to refresh page
      currentNumSamples = 0;
      currentNumSamplesFlag = false;
    }
  } else {
    currentNumSamplesFlag = true;
  }

  guessSound();

  noStroke();
  fill(0, 255, 0, predictionAlpha);
  textSize(50);
  text(test, 10, 150);

  noStroke();
  fill(0);
  textSize(12);
  text("loudness threshold: " + floor(loudnessSlider.value), 10, 35)
  text("total samples: " + totalNumSamples, 10, 35 + 20);

  if (predictionAlpha > 0) predictionAlpha -= 5;
}