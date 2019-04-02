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

function preload() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC--0WCUJ3d5dfTlwAOw3U5p632TU-UqmM",
    authDomain: "walking-6dd4b.firebaseapp.com",
    databaseURL: "https://walking-6dd4b.firebaseio.com",
    projectId: "walking-6dd4b",
    storageBucket: "walking-6dd4b.appspot.com",
    messagingSenderId: "67753631072"
  };
  firebase.initializeApp(config);
  db = firebase.firestore();
  getData = db.collection("sounds").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      data = doc.data();
      machine = new kNear(k, data.soundData);
    });
  });

  mobileConsole.show();
}

function setup() {

  // console.log(data)
  createCanvas(640, 480);
  audio = new MicrophoneInput(512);
  startTime = millis();

  traffic = new Tone.Player('sounds/traffic.mp3').toMaster();
  birds = new Tone.Player('sounds/birds.mp3').toMaster();

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
}

function draw() {
  background(255);
  textSize(12);

  timer = millis() - startTime;
  if (timer > triggerTimerThreshold) {
    singleTrigger = true;
  }


  if (soundReady) {
    fill(0);
    noStroke();
    text("LOUDNESS " + nf(loudness, 1, 2), width / 2 + 25, 375);
    text("MFCCs", +10, 375);

    if (loudness > loudnessThreshold) {
      fill(0, 255, 0);
    } else {
      fill(122);
    }

    if (singleTrigger == false) {
      fill(255, 0, 0);
      // saveData()
    }

    stroke(0);
    ellipse(width / 2 + 175, 375, loudness * 3, loudness * 3);

    fill(0, 255, 0);
    for (var i = 0; i < 13; i++) {
      rect(i * (15) + 100, 375, 10, mfcc[i] * 5);
    }
  }

  //TEST
  if (mouseIsPressed && (loudness > loudnessThreshold) && singleTrigger) {
    trainSound();
  } else if (nSamples > 0 && (loudness > loudnessThreshold) && singleTrigger) {
    // return guess of what the sound is
    fill(0, 255, 0);
    if (loudness > loudnessThreshold) {

      test = machine.classify(mfcc);
      singleTrigger = false;
      startTime = millis();
      predictionAlpha = 255;
    }
  }


  noStroke();
  fill(0, 255, 0, predictionAlpha);
  textSize(126);
  text(test, width / 3, height / 2);

  noStroke();
  fill(0);
  textSize(12);
  text("press [0-9] to change current class --- hold mouse to record samples", 10, 15);
  textSize(12);
  text("trainingClass: " + currentClass, 10, 35);
  text(" nSamples: " + nSamples, width - 350, 35);

  if (predictionAlpha > 0) predictionAlpha -= 5;
}

function touchStarted() {
  trainSound();
}

function trainSound() {
  //train the sound 
  machine.learn(mfcc, currentClass);
  nSamples++;

  fill(255, 0, 0);
  noStroke();
  ellipse(width - 25, 25, 25, 25);

  singleTrigger = false;
  startTime = millis();
}

function soundDataCallback(soundData) {
  soundReady = true;
  mfcc = soundData.mfcc;
  loudness = soundData.loudness.total;

  var peaked = false;

  for (var i = 0; i < 13; i++) {
    normalized[i] = map(mfcc[i], -10, 30, 0, 1);
  }
}



function saveData() {
  // saveJSON(JSON.stringify(machine.db()), 'data.json')
  // var data = database.ref('data');
  // data.push(JSON.stringify(machine.db()), finished)
  var soundData = JSON.stringify(machine.db());


  db.collection("sounds").add({
      soundData
    })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });

  function finished(err) {
    if (err) {
      console.log("ooops, something went wrong.");
      console.log(err);
    } else {
      console.log('Data saved successfully');

    }
  }
}