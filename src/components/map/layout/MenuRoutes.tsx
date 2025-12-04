import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  children?: React.ReactNode;
  collapsed?: boolean;
  animated?: boolean;
};

export default function MenuRoutes(props: Props) {
  const insets = useSafeAreaInsets();
<<<<<<< HEAD
  const screenH = Dimensions.get('window').height;
  const ratio = props.collapsed ? 0.42 : 0.72;
  const FIXED_HEIGHT = Math.round(screenH * ratio) + insets.bottom;
=======
  const FIXED_HEIGHT = Math.round(Dimensions.get('window').height * 0.32 ) + insets.bottom;
>>>>>>> pruebas/dev

  return (
    <View style={[styles.container, { height: FIXED_HEIGHT }] }>
      <View style={styles.contentWrapper}>{props.children}</View>
      <View style={{ height: insets.bottom }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentWrapper: {
    width: '100%',
    paddingHorizontal: 12,
    flex: 1,
  }
});
