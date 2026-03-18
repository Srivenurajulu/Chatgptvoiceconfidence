/**
 * Mock Speech-to-Text Service
 * Simulates a network call to an STT backend that returns transcribed text
 * with a slight delay to mimic real-world network latency.
 */
export const mockStreamAudioToSTT = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("This is a simulated transcription. Voice dictation is working and the text is editable.");
    }, 1200); // simulate 1.2s delay for parsing
  });
};
