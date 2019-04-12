 function vizSound() {

   if (soundReady) {
     if (loudness > loudnessThreshold) {
       fill(0, 255, 0);
       for (var i = 0; i < 13; i++) {
         rect(i * (15) + 100, 100, 10, mfcc[i] * 5);
       }
     } else {
       fill(122);
     }

   }
   // 
 }