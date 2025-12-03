// src/stt/mockSttService.js
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

class MockSttService {
  constructor({ simulatedLatency = 120 } = {}) {
    this.simulatedLatency = simulatedLatency;
  }

  async transcribeBuffer(audioBuffer, timeout = 300) {
    const text = String(audioBuffer || '').trim();
    const latency = this.simulatedLatency + Math.floor(Math.random() * 120);

    if (latency > timeout) {
      await wait(timeout);
      const err = new Error('STT timeout');
      err.code = 'STT_TIMEOUT';
      throw err;
    }
    await wait(latency);

    const words = text.split(/\s+/).filter(Boolean);
    let confidence = 0.9;
    if (words.length > 3) confidence = 0.85;
    if (text.length === 0) confidence = 0.0;
    if (text.includes('[lowconf]')) confidence = 0.4;

    return { text, confidence };
  }
}

module.exports = MockSttService;
