import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFeatureFlag } from '../services/experimentation';
import { ContextualNudgeTooltip } from './ContextualNudgeTooltip';

// Mock imports for the conceptual unified component
const DraftEditView = ({ onSend }: { onSend: () => void }) => (
  <View style={styles.mockView}><Text>DraftEditView (New)</Text></View>
);
const LegacyVoiceView = () => (
  <View style={styles.mockView}><Text>Legacy Voice UI (Control)</Text></View>
);

/**
 * Phase 4: Unified Entry Wrapper
 * Conditionally renders either the legacy voice UI or the new Voice Confidence Mode
 * based on the A/B testing feature flag. Also controls tooltip visibility.
 */
export const VoiceSearchEntry = () => {
  const isConfidenceModeEnabled = useFeatureFlag('enable_voice_confidence_mode');
  
  // In production, this boolean is saved to AsyncStorage/UserPrefs
  const [hasCompletedSearch, setHasCompletedSearch] = useState(false);

  // If the user is in the Control group, render the old UI
  if (!isConfidenceModeEnabled) {
    return <LegacyVoiceView />;
  }

  // User is in the Treatment group. Render new UI + Nudge if required.
  return (
    <View style={styles.container}>
      <ContextualNudgeTooltip 
        visible={!hasCompletedSearch} 
        message="Next-gen voice search (speed + simplicity)" 
      />
      <DraftEditView onSend={() => setHasCompletedSearch(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mockView: {
    padding: 20,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
  }
});
