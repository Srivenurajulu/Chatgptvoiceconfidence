import React from 'react';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { VoiceSearchEntry } from './src/components/VoiceSearchEntry';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <VoiceSearchEntry />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end', // Aligns the DraftEditView at the bottom like a normal keyboard
  },
});
