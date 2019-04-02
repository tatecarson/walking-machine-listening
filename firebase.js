// Initialize Firebase
function fb() {
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

}