//Basic KNN classification of MFFCs
// TODO: adjust the spacing to work better on mobile
// I can't see the full canvas or the button to change labels, or save data

var k = 3; //k can be any integer
var machine;
var test;
var currentClass = 'cars';
var nSamples = 0;

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
  createCanvas(displayWidth, displayHeight);
  audio = new MicrophoneInput(512);
  startTime = millis();

  var threshold = new Nexus.Slider("#threshold", {
    'size': ["350", "100"],
    'min': -3,
    'max': 10,
    'step': 0,
    'value': 10
  })

  threshold.on('change', v => {
    loudnessThreshold = v
  })
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
  guessSound();

  noStroke();
  fill(0, 255, 0, predictionAlpha);
  textSize(126);
  text(test, width / 3, height / 2);

  noStroke();
  fill(0);
  textSize(12);
  text("nSamples: " + nSamples, 10, 35);
  text("loudness threshold: " + floor(loudnessThreshold), 10, 35 + 20)
  text("trainingClass: " + currentClass, 10, 35 + 40);
  if (predictionAlpha > 0) predictionAlpha -= 5;

  // training button
  text('press to train', displayWidth - 110, 95)

  fill(0, 255, 0)
  rect(displayWidth - 110, 100, 100, 100)
}

function touchStarted(e) {

  fill(255, 0, 0)
  rect(displayWidth - 110, 100, 100, 100)

  trainSound();
  // return false;
}