# Phase 1 Implementation: Foundation & Core "Speak-to-Draft"

This directory contains the isolated Phase 1 React Native implementation for the Voice Confidence Mode. It handles the core foundation of a text-first draft experience.

## Contained Deliverables
*   **`src/components/DraftEditView.tsx`**: The core text input replacement component. It features the prominent microphone, visual recording/privacy indicators (red dot, "Listening..."), and handles asynchronous text append.
*   **`src/hooks/useVoiceToText.ts`**: The custom hook managing microphone state, permission checks, and asynchronous communication with the STT backend.
*   **`src/services/mockSTT.ts`**: A simulated backend STT streaming pipeline that creates realistic network latency.
*   **`src/services/telemetry.ts`**: Integration hooks for required funnel validation metrics (`mic_tap`, `record_start`, `send_message`).

## Moving Forward
Next, Phase 2 will introduce the "System Breaking Down" processing state and the "Tap and Transform" Rewrite Suggestions Module based on LLM processing.
