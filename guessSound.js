  function guessSound() {

    if (mouseIsPressed && (loudness > loudnessThreshold) && singleTrigger) {
      trainSound();
    } else if (nSamples > 0 && (loudness > loudnessThreshold) && singleTrigger) {
      // return guess of what the sound is
      // NOTE: this is where you'll get the data to effect the sound
      fill(0, 255, 0);
      if (loudness > loudnessThreshold) {

        test = machine.classify(mfcc);
        singleTrigger = false;
        startTime = millis();
        predictionAlpha = 255;
      }
    }
  }