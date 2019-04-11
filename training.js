// training functions 
function trainSound() {
  //train the sound 


  if ((loudness > loudnessThreshold) && singleTrigger) {
    machine.learn(mfcc, currentClass);
    totalNumSamples++;
    currentNumSamples++;
    console.log(currentNumSamples);
    fill(255, 0, 0);
    noStroke();
    ellipse(width - 400, 35, 25, 25);

    singleTrigger = false;
    startTime = millis();

    console.log('training')
  }

}

function forgetPreviousRecording() {
  machine.db().splice(0, currentNumSamples)
  totalNumSamples = totalNumSamples - currentNumSamples
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
  var soundData = JSON.stringify(machine.db());


  // db.collection("sounds").add({
  //     soundData
  //   })
  //   .then(function (docRef) {
  //     // TODO: write success message to the screen so you can tell you clicked the button
  //     console.log("Document written with ID: ", docRef.id);
  //   })
  //   .catch(function (error) {
  //     console.error("Error adding document: ", error);
  //   });

  var sounds = db.collection("sounds");
  sounds.doc('latest').set({
    soundData
  }).then(function (doc) {
    console.log("Success");
    document.getElementById('save-success').style.display = 'block'
  }).catch(function (error) {
    console.log("Error getting document:", error);
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