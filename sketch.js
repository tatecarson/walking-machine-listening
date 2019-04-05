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

  //UI elements
  currentClass = document.getElementById("label").value;
  var record = document.getElementById('record-data');
  loudnessSlider = document.getElementsByClassName('slider')[0];

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