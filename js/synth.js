const source = new Tone.Synth();
source.toMaster();

// var threshold = Tone.GreaterThan(0.5);
const follower = new Tone.Follower();
source.connect(follower);
// follower.connect(threshold);

  var player = new Tone.Player({
    "url" : "../selfosc0.mp3",
    "playbackRate" : 1.5,
    "loop" : false,
    "autostart": false,
    // "loopStart" : 0.5,
    // "loopEnd" : 0.7,
  }).toMaster();

  // player.playbackRate(2);

  const notes = [
    'C4', 'E4', 'G4',
    'C5', 'E5', 'G5'
  ];

var index = 6;

Tone.Transport.scheduleRepeat(time => {
  repeat(time);
}, "8n");

Tone.Transport.bpm.value = 160;

function repeat(time) {
  // let note = notes[index % notes.length];
  // source.triggerAttackRelease(note, '8n', time);
  // player.playbackRate(1+(index % notes.length)/notes.length);
  player.start(time, 1+ (index % notes.length), '4n');
  // player.playbackRate(1);

  index++;
}

Tone.Transport.start();

setTimeout(() => {
  Tone.Transport.stop();
}, 5000);


function trigSound() {
  Tone.start();
}
