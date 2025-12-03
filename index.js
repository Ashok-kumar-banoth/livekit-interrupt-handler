// index.js
const MockTTSController = require('./src/audio/ttsController');
const MockSttService = require('./src/stt/mockSttService');
const InterruptHandler = require('./src/audio/interruptHandler');
const VadSimulator = require('./src/audio/vadSimulator');

const tts = new MockTTSController();
const stt = new MockSttService({ simulatedLatency: 120 });
const handler = new InterruptHandler({ ttsController: tts, sttService: stt });
const vad = new VadSimulator();

handler.on('ignoredAck', (info) => {
  console.log(`[EVENT] ignoredAck ->`, info);
});
handler.on('interruption', (info) => {
  console.log(`[EVENT] interruption ->`, info);
});
handler.on('userUtterance', (info) => {
  console.log(`[EVENT] userUtterance ->`, info);
});
handler.on('ambiguousInput', (info) => {
  console.log(`[EVENT] ambiguousInput ->`, info);
});

vad.on('vad', async ({ audio }) => {
  console.log(`[VAD] detected audio: "${audio}"`);
  try {
    await handler.handleVAD(audio);
  } catch (e) {
    console.error('handler error', e);
  }
});

const seq = [
  { delayMs: 500, action: () => tts.play('Now I will explain step one of the system. Please listen carefully.') },
  { delayMs: 1100, action: () => vad.emit('vad', { audio: 'yeah' }) },
  { delayMs: 3000, action: () => console.log('\n--- agent silent: user says "yeah" ---') },
  { delayMs: 3200, action: () => vad.emit('vad', { audio: 'yeah' }) },
  { delayMs: 5200, action: () => tts.play('Counting down: one two three four five six seven...') },
  { delayMs: 5600, action: () => vad.emit('vad', { audio: 'no stop' }) },
  { delayMs: 8200, action: () => tts.play('I will continue with more content now. Keep listening please.') },
  { delayMs: 8700, action: () => vad.emit('vad', { audio: 'yeah wait a second' }) },
  { delayMs: 11200, action: () => tts.play('Finally, some closing remarks.') },
  { delayMs: 11600, action: () => vad.emit('vad', { audio: '' }) },
  { delayMs: 14000, action: () => console.log('\nDemo finished.') }
];

for (const item of seq) {
  setTimeout(() => {
    if (item.action) item.action();
  }, item.delayMs);
}
