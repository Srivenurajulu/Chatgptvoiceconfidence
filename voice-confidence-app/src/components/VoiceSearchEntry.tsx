import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ContextualNudgeTooltip } from './ContextualNudgeTooltip';
import { DraftEditView } from './DraftEditView';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
}

export const VoiceSearchEntry = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: 'Welcome to EchoBot!\nYour smart AI assistant.\nHow can I help you today?', 
      sender: 'bot' 
    }
  ]);
  const [hasCompletedSearch, setHasCompletedSearch] = useState(false);

  const handleSend = (text: string) => {
    setHasCompletedSearch(true);
    
    // Add User Message
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: 'user' }]);
    
    // Simulate AI Response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), text: "I've received your query! I can certainly help you with that right now.", sender: 'bot' }
      ]);
    }, 1000);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={[styles.messageText, msg.sender === 'user' ? styles.userText : styles.botText]}>{msg.text}</Text>
          </View>
        ))}
        
        {messages.length === 1 && (
          <View style={styles.pillsContainer}>
             <View style={styles.pill}><Text style={styles.pillText}>Ask me a question</Text></View>
             <View style={styles.pill}><Text style={styles.pillText}>Get help with...</Text></View>
             <View style={styles.pill}><Text style={styles.pillText}>Explore features</Text></View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <ContextualNudgeTooltip 
          visible={!hasCompletedSearch} 
          message="Next-gen voice search (speed + simplicity)" 
        />
        <DraftEditView onSend={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f6f6f6',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  chatContent: {
    paddingBottom: 40,
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#10a37f',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  botText: {
    color: '#333',
  },
  userText: {
    color: '#fff',
  },
  pillsContainer: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  pill: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  pillText: {
    color: '#555',
    fontWeight: '500',
  },
  bottomContainer: {
    width: '100%',
    backgroundColor: '#fff',
  }
});
