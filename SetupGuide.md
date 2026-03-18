# Voice Confidence Project Setup Guide (Web)

This guide details the technology stack, external dependencies, and sequential execution steps necessary to compile the isolated Voice Confidence phase directories into a cohesive browser-based web application runtime. All Native iOS/Android specific configurations have been stripped.

## 1. Web Technology Stack
The modules and UI implementations for the Voice Confidence project are constructed explicitly around a modern React browser ecosystem:

*   **Frontend Framework:** React DOM / React Native Web (Expo Web implementation)
*   **Language:** TypeScript
*   **Target Platforms:** Web Browsers (Chrome, Safari, Firefox, Edge)
*   **Architecture Pattern:** Component-driven design, decoupling heavy logical hooks from representational Web UI layers (`DraftEditView`, `RewriteSuggestionsModal` with fixed absolute CSS).

## 2. Required External Dependencies
To transition the current "mock" pipelines into actual production environments specifically for the web, native mobile packages are abandoned in favor of these standard integrations:

*   **Web Speech API** - An intrinsic browser API (`window.SpeechRecognition`) for capturing microphone permissions, executing, and streaming audio buffers without utilizing native Swift or Kotlin bindings.
*   **Web Audio Context** - Replaces `expo-av` or `react-native-audio-recorder-player` by natively converting raw signals directly on the laptop or device browser.
*   **Web Experimentation SDKs:** Standard JavaScript tracking platforms like `posthog-js`, `launchdarkly-react-client-sdk`, overriding mobile variants to manage flags from Phase 4's `experimentation.ts`.

## 3. How to Execute the Project Locally
Currently, the codebase is structurally isolated into 4 separate phase directories to demonstrate architectural planning. Ensure you are running Node.js.

To merge these phases and execute them in a live browser testing environment (localhost):

### Step A: Initialize the Root Web Application
Instantiate a clean Expo web scaffold containing solely the web dependency bundles:
```bash
npx create-expo-app voice-confidence-app -t expo-template-blank-typescript
cd voice-confidence-app
npx expo install react-dom react-native-web @expo/metro-runtime
```

### Step B: Consolidate the Implementation Modules
Move the abstracted Phase folders into your application's `src/` directory safely:
```bash
# Example sequential unification:
cp -R ../Phase1_SpeakToDraft/src/* ./src/
cp -R ../Phase2_TapAndTransform/src/* ./src/
cp -R ../Phase3_ContextualPlayback/src/* ./src/
cp -R ../Phase4_ExperimentationRollout/src/* ./src/
```

### Step C: Route the App Entry Point
Open the main app entry terminal (`App.tsx`) and set the core routing logic to invoke the final, unified `VoiceSearchEntry` architectural wrapper mapped in Phase 4.

```tsx
// App.tsx
import React from 'react';
import { View } from 'react-native';
import { VoiceSearchEntry } from './src/components/VoiceSearchEntry';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'flex-end' }}>
      {/* 
        This unified Web wrapper checks active A/B flags 
        and correctly routes the user to the DraftEditView interfaces.
      */}
      <VoiceSearchEntry />
    </View>
  );
}
```

### Step D: Compile and Run the Web Client
Compile the local web bundle to test the UI interactions dynamically in Google Chrome or Safari:
```bash
npm install
npm run web
```
This forces the backend bundler server to spawn immediately handling the interface. You can manually toggle the `enable_voice_confidence_mode` flag string directly inside the `src/services/experimentation.ts` mock service to natively switch views!
