import { useState, useCallback, useEffect } from 'react';
import { mockStreamAudioToSTT } from '../services/mockSTT';

export const useVoiceToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Mock permission request on mount
  useEffect(() => {
    // In a real app: await check(PERMISSIONS.IOS.MICROPHONE);
    setPermissionsGranted(true);
  }, []);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setTranscribedText('');
    setIsProcessing(false);
  }, []);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    setIsProcessing(true);

    try {
      // Mock network call passing audio buffer to STT backend
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
    permissionsGranted,
  };
};
