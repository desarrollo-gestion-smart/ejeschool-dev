// src/components/GoBack.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigationUtils } from '../../types/useNavigationUtils';

export function GoBack() {
  const { to } = useNavigationUtils();

  return (
    <TouchableOpacity style={styles.button} onPress={() => to('Home')}>
      <Text style={styles.text}>← Volver</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
});
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};
