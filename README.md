Context-Aware Interrupt Handler

This project implements a custom interrupt handler for voice-based agents. The goal is to prevent the agent from being interrupted by small acknowledgement words while it is speaking.

Features

Ignores filler/acknowledgement words during agent speech
(e.g., “yeah”, “ok”, “hmm”, “right”)

Allows the same words when the agent is silent

Detects clear interrupt commands
(e.g., “stop”, “wait”, “no”, “hold on”)

Handles mixed inputs such as “yeah wait a second”

Includes fallback handling for STT timeouts

Fully tested with Jest

Project Structure
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

Installation
npm install

Run Demo
npm run demo

Run Tests
npm test

Configuration

Edit src/config/interrupt-config.js to adjust:

ignore words

interrupt words

STT timeout

confidence threshold

Proof

Demo video clips can be placed in the proof/ folder as required.