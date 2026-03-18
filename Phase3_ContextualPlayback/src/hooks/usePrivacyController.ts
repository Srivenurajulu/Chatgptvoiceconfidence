import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface PrivacyControllerProps {
  isRecording: boolean;
  onClearDraft: () => void;
  onCancelRecording: () => void;
}

/**
 * Phase 3: Discretion & Privacy Controller
 * Automatically clears active recordings or un-submitted draft texts 
 * when the app goes into the background to prevent accidental data leaks or unauthorized mic usage in public.
 */
export const usePrivacyController = ({
  isRecording,
  onClearDraft,
  onCancelRecording,
}: PrivacyControllerProps) => {
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (isRecording) {
          onCancelRecording();
          console.warn('[PrivacyController] Forcefully cancelled active recording due to app background event.');
        }
        
        onClearDraft();
        console.warn('[PrivacyController] Cleared un-submitted draft text for discretion.');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isRecording, onClearDraft, onCancelRecording]);
};
