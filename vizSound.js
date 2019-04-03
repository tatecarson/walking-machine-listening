 function vizSound() {

   if (soundReady) {

     fill(0);
     noStroke();
     text("MFCCs", +10, displayHeight - 320);
     text("LOUDNESS " + nf(loudness, 1, 2), 10, displayHeight - 300);

     if (loudness > loudnessThreshold) {
       fill(0, 255, 0);
     } else {
       fill(122);
     }

     if (singleTrigger == false) {
       fill(255, 0, 0);
     }

     stroke(0);
     ellipse(width / 2 + 160, displayHeight - 300, loudness * 3, loudness * 3);

     fill(0, 255, 0);
     for (var i = 0; i < 13; i++) {
       rect(i * (15) + 100, displayHeight - 300, 10, mfcc[i] * 5);
     }

   }
 }