import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ContextualNudgeTooltipProps {
  visible: boolean;
  message: string;
}

/**
 * Phase 4: Contextual Nudge
 * Renders a tooltip pointing to the new Voice Search entry point 
 * to drive feature discovery among the Beta cohort.
 */
export const ContextualNudgeTooltip: React.FC<ContextualNudgeTooltipProps> = ({ 
  visible, 
  message 
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{message}</Text>
      </View>
      <View style={styles.arrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    marginBottom: 4,
    marginRight: 16, // Align relative to the mic button
  },
  bubble: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: 200,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  arrow: {
    width: 0, 
    height: 0, 
    backgroundColor: 'transparent', 
    borderStyle: 'solid', 
    borderLeftWidth: 6, 
    borderRightWidth: 6, 
    borderTopWidth: 6, 
    borderLeftColor: 'transparent', 
    borderRightColor: 'transparent', 
    borderTopColor: '#333',
    marginRight: 16,
  }
});
