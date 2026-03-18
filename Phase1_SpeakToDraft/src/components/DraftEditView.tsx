import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useVoiceToText } from './hooks/useVoiceToText';
import { trackEvent } from './services/telemetry';

interface DraftEditViewProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

/**
 * DraftEditView
 * Phase 1: Foundation & Core "Speak-to-Draft" Component.
 * Natively replaces the traditional typing bar with a voice-first draft editor.
 */
export const DraftEditView: React.FC<DraftEditViewProps> = ({
  onSend,
  placeholder = 'Type or speak your message...',
}) => {
  const [draftText, setDraftText] = useState('');
  
  const {
    isRecording,
    isProcessing,
    transcribedText,
    startRecording,
    stopRecording,
    permissionsGranted,
  } = useVoiceToText();

  // Effect to append transcribed text as it comes in from the hook
  useEffect(() => {
    if (transcribedText) {
      setDraftText((prev) => {
        // Simple append for Phase 1. Real implementation might replace chunks.
        const separator = prev.length > 0 ? ' ' : '';
        return prev + separator + transcribedText;
      });
    }
  }, [transcribedText]);

  const handleMicTap = () => {
    trackEvent('mic_tap', { state: isRecording ? 'stop' : 'start' });
    
    if (isRecording) {
      stopRecording();
    } else {
      if (permissionsGranted) {
        startRecording();
        trackEvent('record_start');
      } else {
        console.warn('Microphone permissions not granted');
      }
    }
  };

  const handleSend = () => {
    if (!draftText.trim()) return;
    
    trackEvent('send_message', { length: draftText.length });
    onSend(draftText);
    setDraftText(''); // Reset on send
  };

  return (
    <View style={styles.container}>
      {/* Visual Privacy Indicator */}
      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.redDot} />
          <Text style={styles.recordingText}>Listening...</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        value={draftText}
        onChangeText={setDraftText}
        placeholder={placeholder}
        multiline
        editable={!isRecording} // prevent manual typing while actively speaking
      />

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.micButton, isRecording && styles.micButtonActive]}
          onPress={handleMicTap}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.micIcon}>{isRecording ? '⏹' : '🎤'}</Text>
          )}
        </TouchableOpacity>

        {draftText.length > 0 && !isRecording && (
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3b30',
    marginRight: 6,
  },
  recordingText: {
    color: '#ff3b30',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    minHeight: 60,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    textAlignVertical: 'top',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 12,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: '#ff3b30',
  },
  micIcon: {
    fontSize: 20,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#007aff',
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
