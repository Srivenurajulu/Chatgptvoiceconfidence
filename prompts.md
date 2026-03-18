# Voice Confidence Mode: Implementation Prompts (Web Focused)

This document contains ready-to-use prompts for developers to feed into AI coding assistants (like Cursor, Copilot, or ChatGPT) to accelerate the web codebase implementation phase-by-phase. All mobile, iOS, and Android logic bindings have been explicitly excised.

## Phase 1: Foundation & Core "Speak-to-Draft"

**AI Developer Prompt (For UI & STT Web State):**
> "I need to build the foundation for a 'Voice Confidence Mode' acting as a web text input replacement. Please generate the code for a React component (`DraftEditView`) that natively replaces the traditional typing bar and includes a prominent microphone button.
> 
> Requirements:
> 1. When the user clicks the mic, securely request browser microphone permissions securely mapped to standard Web APIs (mock the transcription response output for now). 
> 2. The transcribed text must asynchronously append to the text input field, allowing the user to type over it or delete it before pressing 'Send'. 
> 3. Add foundational browser console tracking for `mic_click`, `record_start`, and `send` events."

---

## Phase 2: AI Refinement & "Tap and Transform"

**AI Developer Prompt (For Web UI & Loading State):**
> "Let's implement the 'Tap and Transform' UI for the web. 
> 1. Create a subtle 'System Breaking Down' loading spinner for when the STT finishes but the backend LLM hasn't returned rewrite suggestions. 
> 2. Build an absolutely positioned modal/overlay component (`RewriteSuggestionsModal`) that takes an array of 3 string suggestions and gracefully mounts over the underlying chat box. 
> 3. Display these strings with selectable radio buttons. When the user clicks 'Apply', it should replace the text in our React `DraftEditView`."

**LLM Backend System Prompt (For the "Say It Smarter" Feature):**
> **System Function:** You are an AI assistant built to help working professionals refine raw voice notes before they are executed. The user will provide a dictated transcript.
> 
> **Task:** Generate exactly 3 distinct, concise rewrite suggestions for the user's input.
> - **Suggestion 1:** Fix STT errors/punctuation, keeping the exact original intent.
> - **Suggestion 2:** Make the query more direct and action-oriented.
> - **Suggestion 3:** Make it highly formal and professional.
> 
> Return the response strictly as a valid JSON array of 3 strings."

---

## Phase 3: Discretion & Contextual Playback

**AI Developer Prompt (For Browser Tab Privacy):**
> "We need to ensure the web application is acoustically discreet and privacy-preserving in an office browser environment. 
> 1. Write an event listener hook that monitors the standard browser's `visibilitychange` window event or `document.hasFocus()`. 
> 2. If the user intentionally switches tabs or minimizes the browser while actively recording or holding an unsubmitted draft, dynamically forcefully clear the `DraftEditView` text and terminate any active general `MediaStreams` to prevent data leaks.
> 3. Enforce that all AI responses default strictly to text-only output, suppressing any auto-play audio responses."

---

## Phase 4: Experimentation & Rollout

**AI Developer Prompt (For Web A/B Flags & Session Storage Nodes):**
> "We are preparing for a targeted rollout. 
> 1. Wrap the new Voice Confidence Mode entry points in a remote config flag called `enable_voice_confidence_mode`. If false, render the legacy web UI. 
> 2. Build a `ContextualNudgeTooltip` CSS-powered component pointing to the new microphone button with the text 'Next-gen voice search'. 
> 3. This tooltip should exclusively render if the feature flag is true AND the user hasn't successfully completed a voice search before (ensure you store and read this check against `window.localStorage`)."
