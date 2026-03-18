import { useState, useCallback, useEffect } from 'react';

// Re-implementing a simple mock STT service here to keep Phase 2 standalone
const mockStreamAudioToSTT = async (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Here is your transcribed text.");
    }, 1200);
  });
};

export const useVoiceToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  
  const startRecording = useCallback(() => {
    setIsRecording(true);
    setTranscribedText('');
    setIsProcessing(false);
  }, []);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    setIsProcessing(true); // Triggers "System Breaking Down" UI

    try {
      const result = await mockStreamAudioToSTT();
      setTranscribedText(result);
    } catch (error) {
      console.error('STT Error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    isRecording,
    isProcessing,
    transcribedText,
    startRecording,
    stopRecording,
  };
};
