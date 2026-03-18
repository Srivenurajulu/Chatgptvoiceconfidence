import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Platform
} from 'react-native';

interface RewriteSuggestionsModalProps {
  visible: boolean;
  suggestions: string[];
  onClose: () => void;
  onApply: (selectedText: string) => void;
}

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
      setSelectedIndex(null); // Reset selection
    }
  };

  // On Web, absolute positioning handles overlays more reliably than Native Modal sometimes
  const containerStyle = Platform.OS === 'web' 
    ? [styles.overlay, styles.webOverlay] 
    : styles.overlay;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={containerStyle}>
        <View style={styles.bottomSheet}>
          <View style={styles.header}>
            <Text style={styles.title}>AI Rewrite Suggestions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeHitBox}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={suggestions}
            keyExtractor={(_, index) => index.toString()}
            style={{flexGrow: 0}}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  webOverlay: {
    position: 'fixed' as any,
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeHitBox: {
    padding: 8,
  },
  closeButton: {
    fontSize: 20,
    color: '#888',
    fontWeight: 'bold',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderRadius: 8,
  },
  selectedRow: {
    backgroundColor: '#f4fbf9',
    borderColor: '#d1efe5',
    borderWidth: 1,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 16,
  },
  radioButtonActive: {
    borderColor: '#10a37f',
    backgroundColor: '#10a37f',
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  applyButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
  },
  applyButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
