var AudioContext = (window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext);

var context = new AudioContext();

function TimeSingleton(){
  var self = this;
  self.playing = false;
  self.tracks = [];
  self.tempo = 120;
  self.lookahead = 25.0;
  self.scheduleahead = 0.1;
  self.nexttick = 0;
  self.bpmResolution = 32;

  self.start = function() {

    // the context clock doesn't start until we create a buffer source (why??) so let's fake-do that
    self._temporaryBuffer = context.createBufferSource();
    delete self._temporaryBuffer;

    self.playing = true;
    self.schedule();
  }

  self.stop = function() {
    self.playing = false;
    window.clearTimeout(self.timerId);
  }

  self.schedule = function() {

    // is there a note coming up before the next?
    while ( self.nexttick < context.currentTime + self.scheduleahead ) {
      // loop through the tracks & trigger them if they are waiting
      for(var i = 0; i < self.tracks.length; i++) {
        // hit the schedule callback for tracks
        for(var j = 0; j < self.tracks[i]._schedulers.length; j++) {
          self.tracks[i]._schedulers[j].tick(self.nexttick);
        }
      }
      // get the next tick
      self.nexttick += self.noteLength();
    }

    self.timerId = window.setTimeout(self.schedule, self.lookahead);
  }

  self.noteLength = function() {
    return ( 60.0 / self.tempo ) / (self.bpmResolution / 4);
  }

  self.addTrack = function(track) {
    self.tracks.push(track);
  }
}



function Master() {
  var self = this;
  self.destination = context.destination;
}




// sound loading

function loadSounds(filenames, cb) {
  bufferLoader = new BufferLoader( context, filenames, function(list){ cb(list); } );
  bufferLoader.load();
}




// go forth

var clock = new TimeSingleton();
var master = new Master();

clock.start();
console.log('Lissajous has started up.');
console.log('If you\'re new here, try making a new track: t = new track().');