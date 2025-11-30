import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  style?: ViewStyle | ViewStyle[];
  text?: string;
  textColor?: string;
  icon?: React.ComponentType<any>;
  iconColor?: string;
};

export default function AvatarBadge({
  size = 36,
  backgroundColor = '#FFFFFF',
  borderColor,
  borderWidth = 0,
  style,
  text,
  textColor = '#111111',
  icon,
  iconColor,
}: Props) {
  const radius = size / 2;
  const wrapper = {
    width: size,
    height: size,
    borderRadius: radius,
    backgroundColor,
    borderColor,
    borderWidth,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle;

  const IconComp = icon as React.ComponentType<any> | undefined;

  return (
    <View style={[wrapper, style]}>
      {IconComp ? (
        React.createElement(IconComp, { width: size * 0.9, height: size * 0.9, fill: iconColor })
      ) : (
        text ? <Text style={[styles.text, { color: textColor, fontSize: Math.max(12, size * 0.4) }]}>{text}</Text> : null
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: { fontWeight: '700' },
});

