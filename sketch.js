//Basic KNN classification of MFFCs

var k = 3; //k can be any integer
var machine;
var test;
var currentClass = 0;
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
  mobileConsole.show();
}

function setup() {
  createCanvas(640, 480);
  audio = new MicrophoneInput(512);
  startTime = millis();

  // biophony - insects, birds, larger animals 
  // geophony - water, wind, weather 
  // anthrophony - people talking, cars/trucks, air conditioning, airplanes, construction
  select = new Nexus.Select("#select", {
    options: [
      "cars",
      "construction ",
      "human-speech",
      "AC",
      "airplanes",
      "rain",
      "wind",
      "other-weather",
      "insects",
      "birds",
      "large-animals"
    ]
  });

  select.on('change', v => {
    currentClass = v.value
  })

  var threshold = new Nexus.Slider("#threshold", {
    'size': ["500", "100"],
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
  text("loudness threshold: " + floor(loudnessThreshold), 10, 35)
  text("trainingClass: " + currentClass, 10, 35 + 50);
  text(" nSamples: " + nSamples, width - 350, 35);
  if (predictionAlpha > 0) predictionAlpha -= 5;

  // training button
  text('press to train', 400, 95)

  fill(0, 255, 0)
  rect(400, 100, 100, 100)

  if (touchIsDown) {
    fill(255, 0, 0)
    rect(400, 100, 100, 100)

    trainSound();
    console.log(e)
  }
}

// FIXME: not working on mobile 
// function touchStarted(e) {
//   console.log(mouseX, mouseY)
//   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//     fill(255, 0, 0)
//     rect(400, 100, 100, 100)

//     trainSound();
//     console.log(e)
//   }
//   // prevent default
//   return false;
// }