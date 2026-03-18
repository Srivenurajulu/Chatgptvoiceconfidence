# Phase 3 Implementation: Discretion & Contextual Playback

This directory isolates the Phase 3 implementation, focusing strictly on privacy controls, social comfort logic, and environment-aware acoustic safety.

## Contained Deliverables
*   **`src/hooks/useAudioEnvironment.ts`**: Simulates the native bridging logic required to detect if a Bluetooth or wired headset is connected to the mobile device. This state dictates whether audio answers are permitted.
*   **`src/hooks/usePrivacyController.ts`**: Subscribes to React Native's system `AppState` changes. If a user pushes the app to the background context while typing or recording (e.g., someone suddenly walks up behind them), it securely purges the text state and cancels audio buffer recording to prevent accidental exposure of sensitive drafts.
*   **`src/services/PlaybackEngine.ts`**: The core Playback Decision Engine. It consumes the headphone connection state to determine whether the app should execute a Text-To-Speech (TTS) call aloud or strictly suppress all audio feedback in favor of a silent, text-only response block.

## Moving Forward
The final step, Phase 4, will handle wrapping all these isolated mechanisms (Phase 1, 2, and 3) behind feature flags and A/B Testing modules before exposing the flows to users.
