import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform
} from 'react-native';
import { useVoiceToText } from '../hooks/useVoiceToText';
import { RewriteSuggestionsModal } from './RewriteSuggestionsModal';
import { fetchRewriteSuggestions } from '../services/mockLLM';

interface DraftEditViewProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export const DraftEditView: React.FC<DraftEditViewProps> = ({
  onSend,
  placeholder = 'Type a message or tap mic to speak...',
}) => {
  const [draftText, setDraftText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLLMFetching, setIsLLMFetching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const {
    isRecording,
    isProcessing,
    transcribedText,
    startRecording,
    stopRecording,
  } = useVoiceToText();

  // Populate draft text carefully when transcription finishes
  useEffect(() => {
    if (transcribedText) {
      setDraftText((prev) => (prev ? prev + ' ' + transcribedText : transcribedText));
    }
  }, [transcribedText]);

  const handleMicTap = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSayItSmarter = async () => {
    if (!draftText.trim()) return;
    setIsLLMFetching(true);
    try {
      const results = await fetchRewriteSuggestions(draftText);
      setSuggestions(results);
      setIsModalVisible(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLLMFetching(false);
    }
  };

  const handleApplySuggestion = (selectedText: string) => {
    setDraftText(selectedText);
    setIsModalVisible(false);
  };

  const handleSend = () => {
    if (!draftText.trim()) return;
    onSend(draftText);
    setDraftText('');
  };

  return (
    <View style={styles.container}>
      {isProcessing ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color="#888" />
          <Text style={styles.processingText}>System Breaking Down...</Text>
        </View>
      ) : isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.redDot} />
          <Text style={styles.recordingText}>Listening... (Tap mic to stop)</Text>
        </View>
      )}

      <TextInput
        style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
        value={draftText}
        onChangeText={setDraftText}
        placeholder={placeholder}
        multiline
        editable={!isRecording && !isProcessing}
        onSubmitEditing={handleSend} // Allows hitting Enter to send on web
      />

      <View style={styles.actionRow}>
        <View style={styles.leftActions}>
          {draftText.length > 0 && !isRecording && !isProcessing && (
            <TouchableOpacity 
              style={styles.aiButton} 
              onPress={handleSayItSmarter}
              disabled={isLLMFetching}
            >
              {isLLMFetching ? (
                <ActivityIndicator size="small" color="#10a37f" />
              ) : (
                <Text style={styles.aiButtonText}>✨ Say it smarter</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.rightActions}>
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

      <RewriteSuggestionsModal
        visible={isModalVisible}
        suggestions={suggestions}
        onClose={() => setIsModalVisible(false)}
        onApply={handleApplySuggestion}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eaeaea' },
  processingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'center' },
  processingText: { color: '#888', fontSize: 13, marginLeft: 8 },
  recordingIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff3b30', marginRight: 6 },
  recordingText: { color: '#ff3b30', fontSize: 13, fontWeight: '600' },
  input: { minHeight: 60, maxHeight: 120, borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 12, fontSize: 16, backgroundColor: '#fafafa', textAlignVertical: 'top' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  leftActions: { flex: 1, alignItems: 'flex-start' },
  rightActions: { flexDirection: 'row', alignItems: 'center' },
  aiButton: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#e8f7f2', borderRadius: 16, borderWidth: 1, borderColor: '#d1efe5' },
  aiButtonText: { color: '#0d8265', fontWeight: 'bold', fontSize: 14 },
  micButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  micButtonActive: { backgroundColor: '#ff3b30' },
  micIcon: { fontSize: 20, color: '#fff' },
  sendButton: { marginLeft: 12, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#007aff', borderRadius: 20 },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
