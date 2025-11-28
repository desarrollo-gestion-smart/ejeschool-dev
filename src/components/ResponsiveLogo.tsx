import React, { useMemo } from 'react';
import { View, Image, StyleSheet, useWindowDimensions, ImageSourcePropType, ViewStyle } from 'react-native';

type Props = {
  source: ImageSourcePropType | React.ComponentType<any>;
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

  const maybeSvgComp = source as React.ComponentType<any>;
  const isSvgComponent = typeof maybeSvgComp === 'function' || (typeof maybeSvgComp === 'object' && !!maybeSvgComp);

  return (
    <View style={[dynamic.wrapper, containerStyle]}>
      {isSvgComponent ? (
        // Render SVG component (react-native-svg-transformer)
        (maybeSvgComp as any) ? React.createElement(maybeSvgComp as any, { width: w, height: h }) : null
      ) : (
        // Fallback to bitmap Image source
        <Image source={source as ImageSourcePropType} style={[dynamic.wrapper]} />
      )}
    </View>
  );
}
