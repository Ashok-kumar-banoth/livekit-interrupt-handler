// src/audio/interruptHandler.js
const EventEmitter = require('events');
const config = require('../config/interrupt-config');

class InterruptHandler extends EventEmitter {
  constructor({ ttsController, sttService }) {
    super();
    this.ttsController = ttsController;
    this.sttService = sttService;
    this.agentState = 'SILENT';
    this._setupTTSListeners();
  }

  _setupTTSListeners() {
    if (!this.ttsController) return;
    this.ttsController.on('ttsStart', () => { this.agentState = 'SPEAKING'; });
    this.ttsController.on('ttsEnd', () => { this.agentState = 'SILENT'; });
    this.ttsController.on('ttsStopped', () => { this.agentState = 'SILENT'; });
  }

  async handleVAD(audioBuffer) {
    try {
      const sttPromise = this.sttService.transcribeBuffer(audioBuffer, config.STT_TIMEOUT_MS);
      const sttResult = await sttPromise;
      const rawText = (sttResult && sttResult.text) ? sttResult.text.trim().toLowerCase() : '';
      const confidence = sttResult.confidence || 0;

      if (!rawText) return this._onSTTEmpty(confidence);

      return this._processTranscript(rawText, confidence);
    } catch (err) {
      return this._onSTTTimeout(err);
    }
  }

  _onSTTEmpty(confidence = 0) {
    if (this.agentState === 'SPEAKING') {
      this.emit('ignoredAck', { reason: 'emptyTranscript' });
      return;
    } else {
      this.emit('ambiguousInput', { reason: 'emptyTranscript' });
      return;
    }
  }

  _onSTTTimeout(err) {
    if (this.agentState === 'SPEAKING') {
      this.emit('ignoredAck', { reason: 'sttTimeout' });
      return;
    } else {
      this.emit('ambiguousInput', { reason: 'sttTimeout' });
      return;
    }
  }

  _processTranscript(rawText, confidence) {
    const words = rawText.split(/\s+/).map(w => w.replace(/[^\w-]/g, '')).filter(Boolean);
    const nonEmptyWords = words;
    const allIgnored = nonEmptyWords.length > 0 && nonEmptyWords.every(w => config.IGNORE_LIST.includes(w));
    const containsInterrupt = nonEmptyWords.some(w => config.INTERRUPT_LIST.includes(w));
    const containsNonIgnore = nonEmptyWords.some(w => !config.IGNORE_LIST.includes(w));

    if (confidence < config.MIN_CONFIDENCE) {
      if (this.agentState === 'SPEAKING') {
        this.emit('ignoredAck', { reason: 'lowConfidence', confidence, transcript: rawText });
        return;
      } else {
        this.emit('ambiguousInput', { reason: 'lowConfidence', confidence, transcript: rawText });
        return;
      }
    }

    if (this.agentState === 'SPEAKING') {
      if (allIgnored) {
        this.emit('ignoredAck', { transcript: rawText, confidence });
        return;
      }
      if (containsInterrupt || containsNonIgnore) {
        return this._triggerInterrupt(rawText, confidence);
      }
    } else {
      return this._handleUserUtterance(rawText, confidence);
    }
  }

  _triggerInterrupt(rawText, confidence) {
    if (this.ttsController && typeof this.ttsController.stop === 'function') {
      this.ttsController.stop();
    }
    this.agentState = 'SILENT';
    this.emit('interruption', { transcript: rawText, confidence });
  }

  _handleUserUtterance(rawText, confidence) {
    this.emit('userUtterance', { transcript: rawText, confidence });
  }
}

module.exports = InterruptHandler;
