import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
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
  placeholder = 'Type or speak your message...',
}) => {
  const [draftText, setDraftText] = useState('');
  
  // Phase 2 states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLLMFetching, setIsLLMFetching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const {
    isRecording,
    isProcessing, // Represents STT processing ("System Breaking Down")
    transcribedText,
    startRecording,
    stopRecording,
  } = useVoiceToText();

  useEffect(() => {
    if (transcribedText) {
      setDraftText((prev) => (prev ? prev + ' ' + transcribedText : transcribedText));
    }
  }, [transcribedText]);

  const handleMicTap = () => {
    isRecording ? stopRecording() : startRecording();
  };

  // Phase 2: Fetch LLM rewrite suggestions
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
      {/* Phase 2: System Breaking Down UI */}
      {isProcessing ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color="#888" />
          <Text style={styles.processingText}>System Breaking Down...</Text>
        </View>
      ) : isRecording && (
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
        editable={!isRecording && !isProcessing}
      />

      <View style={styles.actionRow}>
        {/* Phase 2: Say it smarter button */}
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

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonActive]}
            onPress={handleMicTap}
            disabled={isProcessing}
          >
            <Text style={styles.micIcon}>{isRecording ? '⏹' : '🎤'}</Text>
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
  container: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eaeaea' },
  processingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'center' },
  processingText: { color: '#888', fontSize: 13, marginLeft: 8 },
  recordingIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff3b30', marginRight: 6 },
  recordingText: { color: '#ff3b30', fontSize: 12, fontWeight: '600' },
  input: { minHeight: 60, maxHeight: 120, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 12, fontSize: 16, backgroundColor: '#fafafa', textAlignVertical: 'top' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  rightActions: { flexDirection: 'row', alignItems: 'center' },
  aiButton: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#e8f7f2', borderRadius: 16, borderWidth: 1, borderColor: '#d1efe5' },
  aiButtonText: { color: '#0d8265', fontWeight: '600', fontSize: 14 },
  micButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  micButtonActive: { backgroundColor: '#ff3b30' },
  micIcon: { fontSize: 20, color: '#fff' },
  sendButton: { marginLeft: 12, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#007aff', borderRadius: 20 },
  sendText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
