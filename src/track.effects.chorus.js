track.prototype.chorus = function(rate, fb, delay) {
  var self = this;

  if(arguments.length == 0) {
    self._chorusEffectIndex = self._removeFromChain(self._chorusEffectIndex);
  } else {
    if(self._chorusEffectIndex == null) {

      self._chorus = new tuna.Chorus({
        rate: rate,
        feedback: fb || 0.2,
        delay: (delay * clock.noteLength() * (clock.bpmResolution / 16)) || 0.0,
        bypass: 0
      });

      self._chorusEffectIndex = self._addToChain(self._chorus.input, self._chorus);
    } else {
      self._chorus.rate = rate;
      self._chorus.feedback = fb;
      self._chorus.delay = delay * clock.noteLength() * (clock.bpmResolution / 16);
    }
  }

  return self;
}