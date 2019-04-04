//Basic KNN classification of MFFCs
// TODO: adjust the spacing to work better on mobile
// I can't see the full canvas or the button to change labels, or save data

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
var test = 0;

var traffic, birds;

var db, getData, data;
var select;
var trainingSpeed;

function preload() {
  // load firebase
  fb();
  // mobileConsole.show();
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
  currentClass = document.getElementById("label").value;

  // recording debouncer 
  timer = millis() - startTime;
  if (timer > triggerTimerThreshold) {
    singleTrigger = true;
  }

  vizSound();

  // Start Training 
  if (document.getElementById('record-data').checked) {
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
  textSize(100);
  text(test, 10, 150);

  noStroke();
  fill(0);
  textSize(12);
  // TODO: reposition this so you can see it and the threshold at the same time 
  loudnessThreshold = document.getElementsByClassName('slider')[0].value
  text("loudness threshold: " + floor(loudnessThreshold), 10, 35)
  text("total samples: " + totalNumSamples, 10, 35 + 20);

  if (predictionAlpha > 0) predictionAlpha -= 5;
}