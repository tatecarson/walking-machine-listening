function guessSound() {
  if (loudness > loudnessThreshold && singleTrigger) {
    // return guess of what the sound is
    fill(0, 255, 0);
    if (loudness > loudnessThreshold) {
      soundGuess = machine.classify(mfcc); //eslint-disable-line
      singleTrigger = false;
      startTime = millis();
      predictionAlpha = 255;
    }
  }
}
