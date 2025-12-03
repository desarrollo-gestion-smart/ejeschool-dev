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
  const FIXED_HEIGHT = Math.round(Dimensions.get('window').height * 0.42) + insets.bottom;

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
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    
  },
  contentWrapper: {
    width: '100%',
    paddingHorizontal: 12,
    flex: 1,
  }
});
