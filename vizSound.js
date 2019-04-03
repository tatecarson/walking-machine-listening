 function vizSound() {

   if (soundReady) {
     //  console.log(loudnessThreshold)
     fill(0);
     noStroke();
     text("LOUDNESS " + nf(loudness, 1, 2), 10, 400 - 25);
     text("MFCCs", +10, 375 - 25);

     if (loudness > loudnessThreshold) {
       fill(0, 255, 0);
     } else {
       fill(122);
     }

     if (singleTrigger == false) {
       fill(255, 0, 0);
     }

     stroke(0);
     ellipse(width / 2 + 160, 375, loudness * 3, loudness * 3);

     fill(0, 255, 0);
     for (var i = 0; i < 13; i++) {
       rect(i * (15) + 100, 375, 10, mfcc[i] * 5);
     }
   }
 }