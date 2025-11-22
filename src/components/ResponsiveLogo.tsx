import React, { useMemo } from 'react';
import { View, Image, StyleSheet, useWindowDimensions, ImageSourcePropType, ViewStyle } from 'react-native';

type Props = {
  source: ImageSourcePropType;
  sizePercent?: number;
  maxWidth?: number;
  maxHeight?: number;
  borderRadiusFactor?: number;
  containerStyle?: ViewStyle | ViewStyle[];
};

export default function ResponsiveLogo({
  source,
  sizePercent = 0.5,
  maxWidth = 200,
  maxHeight = 220,
  borderRadiusFactor = 0.4,
  containerStyle,
}: Props) {
  const { width } = useWindowDimensions();
  const w = Math.min(maxWidth, width * sizePercent);
  const h = Math.min(maxHeight, width * (sizePercent * 1.1));
  const br = w * borderRadiusFactor;

  const dynamic = useMemo(
    () => StyleSheet.create({ wrapper: { width: w, height: h, borderRadius: br } }),
    [w, h, br]
  );

  return (
    <View style={[styles.logoWrapper, dynamic.wrapper, containerStyle] }>
      <Image source={source} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrapper: {
    shadowColor: '#110c0cff',
    shadowOffset: { width: 0, height: 5 },
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.3,
    elevation: 10,
    borderRadius: 80,
  },
  logo: { width: '100%', height: '100%' },
});