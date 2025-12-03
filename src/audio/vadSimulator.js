// src/audio/vadSimulator.js
const EventEmitter = require('events');

class VadSimulator extends EventEmitter {
  constructor() {
    super();
  }

  scheduleSequence(sequence = []) {
    for (const item of sequence) {
      setTimeout(() => {
        this.emit('vad', { audio: item.audio });
      }, item.delayMs);
    }
  }
}

module.exports = VadSimulator;
