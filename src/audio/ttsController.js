// src/audio/ttsController.js
const EventEmitter = require('events');

class MockTTSController extends EventEmitter {
  constructor() {
    super();
    this.isPlaying = false;
    this._currentTimeout = null;
    this._playId = 0;
  }

  play(text) {
    if (this.isPlaying) {
      this.stop();
    }
    this.isPlaying = true;
    this.emit('ttsStart', { text, id: ++this._playId });
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const duration = 300 + Math.max(80, 80 * words);
    this._currentTimeout = setTimeout(() => {
      this.isPlaying = false;
      this.emit('ttsEnd', { text, id: this._playId });
    }, duration);
    return this._playId;
  }

  stop() {
    if (this.isPlaying) {
      clearTimeout(this._currentTimeout);
      this.isPlaying = false;
      this.emit('ttsStopped');
      this.emit('ttsEnd', { text: '[stopped]', id: this._playId });
    }
  }

  getState() {
    return this.isPlaying ? 'SPEAKING' : 'SILENT';
  }
}

module.exports = MockTTSController;
