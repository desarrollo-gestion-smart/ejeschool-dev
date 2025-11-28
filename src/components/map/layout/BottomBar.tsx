import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useResponsive from '../../../types/useResponsive';

type Props = {
  children?: React.ReactNode;
  collapsed?: boolean;
  animated?: boolean;
};

export default function BottomBar(props: Props) {
  const insets = useSafeAreaInsets();
  const { vh } = useResponsive();
  const FIXED_HEIGHT = vh(35) + insets.bottom;

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
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 16,
    flex: 1,
  }
});
