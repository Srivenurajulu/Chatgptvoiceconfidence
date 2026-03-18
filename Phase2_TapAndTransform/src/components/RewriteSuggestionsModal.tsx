import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';

interface RewriteSuggestionsModalProps {
  visible: boolean;
  suggestions: string[];
  onClose: () => void;
  onApply: (selectedText: string) => void;
}

/**
 * RewriteSuggestionsModal
 * Phase 2: AI Refinement ("Tap and Transform") Component.
 * Presents a bottom-sheet style list of AI-generated rewrite suggestions.
 */
export const RewriteSuggestionsModal: React.FC<RewriteSuggestionsModalProps> = ({
  visible,
  suggestions,
  onClose,
  onApply,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleApply = () => {
    if (selectedIndex !== null && suggestions[selectedIndex]) {
      onApply(suggestions[selectedIndex]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>
          <View style={styles.header}>
            <Text style={styles.title}>AI Rewrite Suggestions</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={suggestions}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => {
              const isSelected = selectedIndex === index;
              return (
                <TouchableOpacity
                  style={[styles.suggestionRow, isSelected && styles.selectedRow]}
                  onPress={() => setSelectedIndex(index)}
                >
                  <View style={[styles.radioButton, isSelected && styles.radioButtonActive]} />
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity
            style={[styles.applyButton, selectedIndex === null && styles.applyButtonDisabled]}
            disabled={selectedIndex === null}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Tap and Transform</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 20,
    color: '#888',
    padding: 4,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedRow: {
    backgroundColor: '#f9f9f9',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    marginTop: 2,
  },
  radioButtonActive: {
    borderColor: '#007aff',
    backgroundColor: '#007aff',
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  applyButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  applyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
