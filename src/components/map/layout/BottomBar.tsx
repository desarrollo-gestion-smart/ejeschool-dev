import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useResponsive from '../../../types/useResponsive';

type Props = { children?: React.ReactNode; collapsed?: boolean; onToggle?: () => void };

export default function BottomBar({ children, collapsed = false }: Props) {
  const insets = useSafeAreaInsets();
  const { footerHeight } = useResponsive();
  const [contentHeight, setContentHeight] = useState(0);
  const handleHeight = 44;
  const expandedHeight = (contentHeight || footerHeight) + insets.bottom;
  const targetHeight = collapsed ? handleHeight + insets.bottom : expandedHeight;
  const anim = useRef(new Animated.Value(targetHeight)).current;

  useEffect(() => {
    const to = collapsed ? handleHeight + insets.bottom : expandedHeight;
    Animated.spring(anim, { toValue: to, useNativeDriver: false, damping: 18, stiffness: 120 }).start();
  }, [collapsed, expandedHeight, insets.bottom, anim]);

  const containerStyle = useMemo(() => [{ height: anim, paddingBottom: insets.bottom }], [anim, insets.bottom]);

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.inner} onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 50,
    zIndex: 1000,
    overflow: 'hidden',
    left: 0,
    right: 0,
    bottom: 0,

  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    
    
  },
});
