import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
};


export default function TopBar({ title }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, height: 140 + insets.top },
      ]}
    >
      <Text style={styles.title}>{title || ''}</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#5702acff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    
  },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', paddingHorizontal: 36, paddingVertical: 16 },
});
