**Context-Aware Interrupt Handler**

This project implements an interrupt-handling layer for voice agents. The goal is to prevent accidental interruptions when the user makes small acknowledgement sounds, while still allowing intentional interruption commands.

The system classifies user speech into:

-->Acknowledgements → ignored when the agent is speaking

-->Interrupt commands → immediately stop agent speech

-->Normal user input → processed when the agent is silent

-->Timeout / low confidence inputs → handled safely without breaking the flow

This matches the assignment requirement of selective interrupt handling without modifying the VAD pipeline.

**Features**

-->Ignores filler words while the agent is speaking
(yeah, ok, hmm, right, etc.)

-->Treats the same words as valid input when the agent is silent

-->Detects clear interruption commands
(stop, wait, no, hold on, etc.)

-->Detects mixed utterances (e.g., “yeah wait a second”)

-->Handles STT timeouts gracefully

-->Fully covered by automated Jest tests

**Folder Structure**
src/
  audio/
    interruptHandler.js
    ttsController.js
    vadSimulator.js
  stt/
    mockSttService.js
  config/
    interrupt-config.js

test/
  interruptHandler.test.js

index.js
README.md
package.json

**The console will show events such as:**

ignoredAck
userUtterance
interruption
ambiguousInput

These demonstrate all required cases:
1.Filler ignored during agent speech
2.Filler accepted when agent is silent
3.Clear interruption
4.Mixed interruptio

**Configuration**
You can adjust:
-->acknowledgement words
-->interrupt words
-->STT timeout
-->confidence threshold
in:
src/config/interrupt-config.js

Example:
IGNORE_LIST: ["yeah", "ok", "hmm"],
INTERRUPT_LIST: ["stop", "wait", "no"],
MIN_CONFIDENCE: 0.55
