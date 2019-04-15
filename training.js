// training functions
function trainSound() {
  // train the sound

  if (loudness > loudnessThreshold && singleTrigger) {
    machine.learn(mfcc, currentClass);
    totalNumSamples++;
    currentNumSamples++;
    console.log(currentNumSamples);
    fill(255, 0, 0);
    noStroke();
    ellipse(width - 400, 35, 25, 25);

    singleTrigger = false;
    startTime = millis();

    console.log('training');
  }
}

function forgetPreviousRecording() {
  machine.db().splice(0, currentNumSamples);
  totalNumSamples -= currentNumSamples;
}

function soundDataCallback(soundData) {
  soundReady = true;
  mfcc = soundData.mfcc;
  loudness = soundData.loudness.total;

  for (let i = 0; i < 13; i++) {
    normalized[i] = map(mfcc[i], -10, 30, 0, 1);
  }
}

function saveData() {
  const soundData = JSON.stringify(machine.db());

  const sounds = db.collection('sounds');
  sounds
    .doc('latest')
    .set({
      soundData,
    })
    .then(function(doc) {
      console.log('Success');
      document.getElementById('save-success').style.display = 'block';
    })
    .catch(function(error) {
      console.log('Error getting document:', error);
    });

  function finished(err) {
    if (err) {
      console.log('ooops, something went wrong.');
      console.log(err);
    } else {
      console.log('Data saved successfully');
    }
  }
}
