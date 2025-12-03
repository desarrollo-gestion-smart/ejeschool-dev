// src/components/map/CancelRouteButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
  status?: 'boarded' | 'not_boarded';
  label?: string;
};

export default function CancelRouteButton({ onPress, status, label }: Props) {
  const bg = status === 'boarded' ? '#10B981' : status === 'not_boarded' ? '#EF4444' : '#242e42';
  const textLabel = label ?? (status === 'boarded' ? 'Abordo' : status === 'not_boarded' ? 'No abordo' : 'Cancelar Recogida');
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{textLabel}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#242e42',
    paddingVertical: 10,
    marginBottom: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
