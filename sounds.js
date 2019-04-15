/**
 * Based off of: github.com/generative-music/pieces-alex-bainter/blob/master/packages/piece-eno-machine/src/piece.js
 *
 */

// TODO: add some sort of long string like sounds that are sampled
// TODO: fix performance cracking problems on mobile

const OCTAVES = [1, 2, 3, 4, 5];
const MIN_REPEAT_S = 10;
const MAX_REPEAT_S = 60;

// Nexus.tune.createJIScale(1 / 1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 8 / 5, 5 / 3, 15
// / 8); La Monte Young's WTP
Nexus.tune.createJIScale(
  1 / 1, // Eb
  567 / 512, // E
  9 / 8, // F
  147 / 128, // F#
  21 / 16, // G
  1323 / 1024, // G#
  189 / 128, // A
  3 / 2, // Bb
  49 / 32, // B
  7 / 4, // C
  441 / 256, // C#
  63 / 32, // D
  2 / 1 // Eb
);

// Convert to note names so its easier to use
const tuning = {
  Eb: Nexus.note(0),
  E: Nexus.note(2),
  F: Nexus.note(3),
  'F#': Nexus.note(4),
  G: Nexus.note(5),
  'G#': Nexus.note(6),
  A: Nexus.note(7),
  Bb: Nexus.note(8),
  B: Nexus.note(9),
  C: Nexus.note(10),
  'C#': Nexus.note(11),
  D: Nexus.note(12),
};
// ET Eb4
Nexus.tune.root = 311.127 / 2;
const magicChord = [
  tuning.E,
  tuning['F#'],
  tuning.A,
  tuning.B,
  tuning.D,
  tuning.E,
  tuning.G,
  tuning.A,
];
const NOTES = Tonal.Array.rotate(1, magicChord).reduce(
  (withOctaves, note) =>
    withOctaves.concat(OCTAVES.map(octave => `${note}${octave}`)),
  []
);

const instrumentInit = () => {
  let volume = new Tone.Volume(-6);
  let reverb = new Tone.JCReverb({
    roomSize: 0.5,
    wet: 0.2,
  }).chain(volume, Tone.Master);
  let delay = new Tone.FeedbackDelay({
    wet: 0.5,
    delayTime: 5,
    feedback: 0.8,
  }).connect(reverb);
  let piano = new Tone.FMSynth({
    harmonicity: 8,
    modulationIndex: 2,
    oscillator: {
      type: 'sine',
    },
    envelope: {
      attack: 0.01,
      decay: 2,
      sustain: 0.3,
      release: 4,
    },
    modulation: {
      type: 'square',
    },
    modulationEnvelope: {
      attack: 0.002,
      decay: 0.2,
      sustain: 0,
      release: 0.2,
    },
  }).connect(delay);

  const dispose = () => {
    if (piano !== undefined && piano !== null) {
      piano.dispose();
      piano = null;
    }
    if (volume !== undefined && volume !== null) {
      volume.dispose();
      volume = null;
    }
    if (reverb !== undefined && reverb !== null) {
      reverb.dispose();
      reverb = null;
    }
    if (delay !== undefined && delay !== null) {
      delay.dispose();
      delay = null;
    }
  };
  return {
    piano,
    volume,
    reverb,
    delay,
    dispose,
  };
};

NOTES.forEach(note => {
  const interval = _.random(MIN_REPEAT_S, MAX_REPEAT_S);
  const delay = _.random(0, MAX_REPEAT_S - MIN_REPEAT_S);
  const start = _.random(0.6, 3);
  const playNote = () => instrument.piano.triggerAttack(note, `+${start}`);
  Tone.Transport.scheduleRepeat(playNote, interval, `+${delay}`);
});

// FIXME: getting an undefined type
const soundTypes = {
  geo: ['wind', 'other-weather', 'rain'],
  bio: ['insects', 'birds', 'larger-animal'],
  anthro: ['cars', 'construction', 'human-speech', 'AC', 'airplanes'],
};

let anthroFlag = true;
const soundUpdates = () => {
  let soundGuessType;
  Object.keys(soundTypes).forEach(tags => {
    if (soundTypes[tags].includes(soundGuess)) {
      soundGuessType = tags;
    }
  });

  // TODO: get other features from meyda?
  // if made by humans turn the music almost all the way off
  // TODO: if made by earth use loudness and values of mfccs to control
  // modulationindex and harmonicity

  // FIXME: getting a clicking sound when changing volumes
  console.log(instrument.volume.volume.value);
  if (soundGuessType === 'anthro' && anthroFlag) {
    instrument.volume.volume.rampTo(-40, 4);
    console.count('anthro');
    anthroFlag = false;
  } else if (soundGuessType === 'geo') {
    instrument.volume.volume.value = map(loudness, 0, 24, -50, -6);

    console.log('geo');
    anthroFlag = true;
  } else if (soundGuessType === 'bio') {
    anthroFlag = true;
    console.log('bio');
  }
};
