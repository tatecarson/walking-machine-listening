let audioObject;
const MicrophoneInput = function MicrophoneInput(bufferSize) {
  if (
    window.hasOwnProperty('webkitAudioContext') &&
    !window.hasOwnProperty('AudioContext')
  ) {
    window.AudioContext = webkitAudioContext;
  }

  if (
    navigator.hasOwnProperty('webkitGetUserMedia') &&
    !navigator.hasOwnProperty('getUserMedia')
  ) {
    navigator.getUserMedia = webkitGetUserMedia;
    if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor')) {
      AudioContext.prototype.createScriptProcessor =
        AudioContext.prototype.createJavaScriptNode;
    }
  }

  this.context = new AudioContext();
  StartAudioContext(this.context, '#container');
  this.synthesizer = {};
  this.synthesizer.out = this.context.createGain();

  this.meyda = Meyda.createMeydaAnalyzer({
    audioContext: this.context,
    source: this.synthesizer.out,
    bufferSize,
    featureExtractors: ['mfcc', 'loudness'],
    callback: soundDataCallback,
  });
  audioObject = this;
  this.initializeMicrophoneSampling();
};

MicrophoneInput.prototype.initializeMicrophoneSampling = function() {
  var errorCallback = function errorCallback (err) { //eslint-disable-line
    // We should fallback to an audio file here, but that's difficult on mobile
    if (!md.mobile()) {
      // document.getElementById('recorded-walk').style.display = 'none';
      const recordedWalk = document.getElementById('recorded-walk');
      const stream = audioObject.context.createMediaElementSource(recordedWalk);
      stream.connect(audioObject.context.destination);
      audioObject.meyda.setSource(stream);
      audioObject.meyda.start();
    }
    console.log('at error');
  };

  try {
    navigator.getUserMedia =
      navigator.webkitGetUserMedia || navigator.getUserMedia;
    const constraints = {
      video: false,
      audio: true,
    };
    const successCallback = function successCallback(mediaStream) {
      window.mediaStream = mediaStream;
      // document.getElementById('elvisSong').style.display = 'none';
      console.group('Meyda');
      console.log('User allowed microphone access.');
      console.log('Initializing AudioNode from MediaStream');
      const source = audioObject.context.createMediaStreamSource(
        window.mediaStream
      );
      console.log('Setting Meyda Source to Microphone');
      audioObject.meyda.setSource(source);
      audioObject.meyda.start();
      Tone.Transport.start();
      console.log('Transport ', Tone.Transport.state);
      console.groupEnd();
    };

    try {
      console.log('Asking for permission...');
      navigator.getUserMedia(constraints, successCallback, errorCallback);
    } catch (e) {
      const p = navigator.mediaDevices.getUserMedia(constraints);
      p.then(successCallback);
      p.catch(errorCallback);
    }
  } catch (e) {
    errorCallback();
  }
};

MicrophoneInput.prototype.get = function(features) {
  return audioObject.meyda.get(features);
};
