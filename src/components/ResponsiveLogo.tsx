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
  maxWidth = 150,
  maxHeight = 140,
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
    <View style={[styles.logoContainer, containerStyle]}>
      <Image source={source} style={[styles.logo, dynamic.wrapper]} />
    </View>
  );
}

const styles = StyleSheet.create({
   logoContainer: {
    shadowColor: '#110c0cff',
    shadowOffset: { width: 0, height: 10 },
    justifyContent: 'center',
    alignSelf: 'center',
    shadowOpacity: 0.3,
    elevation: 10,
    borderRadius: 80,
    marginBottom: 20,
  },
  logo: { width: 3, height: 3 },
});