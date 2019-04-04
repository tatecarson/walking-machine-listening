 function vizSound() {

   if (soundReady) {
     if (loudness > loudnessThreshold) {
       fill(0, 255, 0);
     } else {
       fill(122);
     }

     if (singleTrigger == false) {
       fill(255, 0, 0);
     }

     fill(0);
     noStroke();
     text("MFCCs", +10, displayHeight - 500);
     fill(0, 255, 0);
     for (var i = 0; i < 13; i++) {
       rect(i * (15) + 100, displayHeight - 500, 10, mfcc[i] * 5);
     }

     //  text("LOUDNESS " + nf(loudness, 1, 2), 10, displayHeight - 445);
   }
 }