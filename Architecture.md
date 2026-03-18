# Voice Confidence Mode: System Architecture (Web)

## 1. Executive Summary
This document outlines the system architecture for "Voice Confidence Mode," a privacy-first, draft-based voice interaction flow explicitly built for the ChatGPT Web Application ecosystem. The architecture prioritizes user control, discretion, and quick recoverability from transcription errors, especially in shared or public workspaces.

## 2. High-Level System Architecture

### 2.1 Client Application (Web Browser)
The React web client is the primary interface, requiring updates to support a draft-first voice paradigm.
*   **UI/UX Layer:**
    *   **Contextual Onboarding Nudges:** CSS-driven awareness banners for feature discovery.
    *   **Draft & Edit View:** A text editor component mimicking native behavior that populates real-time transcription and allows manual keyboard interventions.
    *   **Rewrite & Transform Module:** Displays LLM-generated prompt improvements ("Say it smarter") in an absolute overlay.
*   **Browser/Hardware Interactions:**
    *   **Audio Capture:** Uses HTML5 `MediaStream` and the Web Speech API for microphone access with clear browser-level visual privacy indicators.
    *   **Environment Safety:** Defaults to visually heavy text responses rather than automatic loud Text-to-Speech (TTS) playback handling.
*   **State Management:**
    *   Manages states: `Idle` -> `Recording` -> `Processing/Transcribing` -> `Review/Edit` -> `Sending` -> `Response`.
*   **Telemetry Client:**
    *   Instrumentation for funnel events (`exposure`, `mic click`, `record start`, `review`, `send`) for A/B testing and CSAT reporting.

### 2.2 API Gateway & Network Layer
Handles the bidirectional flow between the browser client and backend AI services.
*   **Audio Streaming Endpoint:** Low-latency WebSockets streaming audio chunk buffers to the STT service.

### 2.3 Backend Services
*   **Speech-to-Text (STT) Engine:** Support for automatic language detection and mixed-language parsing (e.g., Hinglish).
*   **Draft Processing Pipeline:** A lightweight LLM call to process the raw STT transcript and generate refined, structured queries.
*   **Core Execution Engine:** The standardized inference engine that processes the finalized draft.

### 2.4 Data & Privacy Layer
*   **Privacy Controller:** Purges audio streams upon browser tab change (`visibilitychange`/`blur`).
*   **User Preferences Store:** Uses `localStorage` or session caching to dictate preferences for voice behavior in the browser.

## 3. Core Workflows

### 3.1 The Voice Search Journey Flow
1.  **Entry & Nudge:** On the GPT landing screen, the user sees a tooltip nudge: "Next-gen voice search (speed + simplicity)".
2.  **Voice Capture Trigger:** User clicks the mic to "Start voice capture". 
3.  **STT & Processing:** Audio is passed through the Speech-to-text model modifying the field to draft text. System turns to "Breaking Down" processing state.
4.  **Refinement Decision:** 
    *   **Path A (Yes):** User types via keyboard to "Edit / fine-tune voice input" manually. 
    *   **Path B (No):** The updated query text is confirmed and proceeds.
5.  **"Say it smarter. Say it stronger." Prompting:** The system generates AI rewrite suggestions. 
6.  **"Tap and Transform" Module:** 
    *   User clicks "Tap and Transform".
    *   Selects an intelligent refinement suggestion replacing the text input contents.
7.  **Final Execution:** The finalized query is "ready to run/send".

### 3.2 The Response & Playback Flow
1.  **Response Generation:** Core Engine returns the text output.
2.  **Playback Decision Rule:** Default strictly to Text-Only mode. Suppress any automated audio to avoid socially uncomfortable situations in offices/public desktop spaces.

## 4. Phase-by-Phase Implementation Plan

### Phase 1: Foundation & Core "Speak-to-Draft"
*   **Objective:** Establish the browser-first voice capability to build user trust.
*   **Deliverables:** Web Voice Capture UI integration, mocked Speech API hooking, unified text-box behavior.

### Phase 2: AI Refinement & "Tap and Transform"
*   **Objective:** Add intelligent enhancements to lower user cognitive load over the web.
*   **Deliverables:** Integration of "System Breaking Down" loading elements, LLM rewrite routing, and absolute positioning CSS UI modals.

### Phase 3: Discretion & Contextual Playback
*   **Objective:** Ensure the browser environment completely silences voice feedback and tracks security events.
*   **Deliverables:** Window tab blur event listeners triggering draft purging; locking responses to visual output only.

### Phase 4: Experimentation & Rollout
*   **Objective:** Validate performance and feature adoption on web configurations.
*   **Deliverables:** A/B testing flag encapsulation, local storage checking mechanics for the contextual nudge.

## 5. Future Scalability & Considerations
*   **In-Browser Processing:** Transitioning basic VAD/STT algorithms directly to WebAssembly (WASM) execution frameworks inside chrome to securely manage logic natively without cloud loops.
*   **Keyboard Shortcuts:** Integrating "Hold Spacebar-to-talk" hotkey architecture tailored specifically to laptop/desktop power users.
