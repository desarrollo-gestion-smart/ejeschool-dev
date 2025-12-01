// components/SvgIcon.tsx  → VERSIÓN FINAL 100% FUNCIONAL
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

type Props = {
  component: React.ComponentType<any>;
  size?: number | string;
  color?: string;           // opcional: pinta todo de un color (fill + stroke)
  style?: StyleProp<ViewStyle>;
  stroke?: string;          // opcional: pinta el borde de un color
  strokeWidth?: number;     // opcional: ancho del borde
  // Aquí está la magia: acepta cualquier prop que acepte un <Svg> de react-native-svg
  [key: string]: any;
};

const SvgIcon = ({ 
  component: SvgComponent, 
  size = 24, 
  stroke,
  color, 
  style, 
  ...restProps   // ← esto recibe stroke, fill, strokeWidth, opacity, etc.
}: Props) => {

  // Si pasas "color", lo aplicamos a fill y stroke (comodidad)
  const colorProps = color ? { fill: color } : {};
  const strokeProps = stroke ? { stroke: stroke } : {};
  return (
    <SvgComponent
      stroke={stroke}
      width={size}
      height={size}
      style={[{ width: size, height: size }, style]}
      {...colorProps}
      {...strokeProps}
      {...restProps}   // ← aquí llegan stroke="#fff", strokeWidth={3}, etc.
    />
  );
};

export default SvgIcon;