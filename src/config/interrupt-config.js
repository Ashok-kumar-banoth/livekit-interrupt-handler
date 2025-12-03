// src/config/interrupt-config.js
module.exports = {
  IGNORE_LIST: [
    'yeah', 'ok', 'okay', 'hmm', 'uh', 'uh-huh', 'uhuh', 'mm', 'mhm', 'yep', 'yah', 'right', 'fine'
  ],
  INTERRUPT_LIST: [
    'stop', 'wait', 'no', 'hold', 'pause', 'cancel', 'cut', 'stopit'
  ],
  IGNORE_MAX_WORDS: 4,
  STT_TIMEOUT_MS: 300,
  VAD_BUFFER_MS: 300,
  MIN_CONFIDENCE: 0.55
};
