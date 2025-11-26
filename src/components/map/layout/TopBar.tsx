import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useResponsive from '../../../types/useResponsive';

type Props = {
  title?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
};

export default function TopBar({ title, right, left }: Props) {
  const insets = useSafeAreaInsets();
  const { headerHeight } = useResponsive();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, height: headerHeight + insets.top },
      ]}
    >
      <View style={styles.side}>{left}</View>
      <Text style={styles.title}>{title || ''}</Text>
      <View style={styles.side}>{right}</View>
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
    zIndex: 10,
    backgroundColor: '#6D28D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  side: { width: 48, alignItems: 'center', justifyContent: 'center' },
});
