// training functions 
function trainSound() {
  //train the sound 
  if ((loudness > loudnessThreshold) && singleTrigger) {
    machine.learn(mfcc, currentClass);
    nSamples++;

    fill(255, 0, 0);
    noStroke();
    ellipse(width - 400, 35, 25, 25);

    singleTrigger = false;
    startTime = millis();

    console.log('training')
  }

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