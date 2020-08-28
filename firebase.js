// Initialize Firebase
function fb() {
  const config = {
    apiKey: "AIzaSyAUEtLAmlw_UgLwq8GkwN__0rslE4YYCo4",
    authDomain: "sounds-aware.firebaseapp.com",
    databaseURL: "https://sounds-aware.firebaseio.com",
    projectId: "sounds-aware",
    storageBucket: "sounds-aware.appspot.com",
    messagingSenderId: "21783369081",
    appId: "1:21783369081:web:6d5499806f2c92b5e8cba8"
  };
  firebase.initializeApp(config);
  db = firebase.firestore();
  const docRef = db.collection('sounds').doc('latest');
  docRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
        console.log('Document data:', doc.data());
        data = doc.data();
        machine = new kNear(k, data.soundData) // eslint-disable-line
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })
    .catch(function(error) {
      console.log('Error getting document:', error);
    });
}
