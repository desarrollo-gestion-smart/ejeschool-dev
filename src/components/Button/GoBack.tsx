// src/components/GoBack.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigationUtils } from '../../types/useNavigationUtils';

export function GoBack() {
  const { to } = useNavigationUtils();

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={() => to('InitialLogins')}>
      <Text style={styles.text}>{'<'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    zIndex: 1000,
    top: 20,
    left: 20,
    backgroundColor: '#fff',
    width: 40,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '100%',
  },
  text: {
    fontWeight: '500',
    lineHeight: 38,
    fontSize: 30,
    color: '#c4c4c4',
  },
});