import React from 'react';

type Props = {
  component: React.ComponentType<any>;
  size?: number;
  color?: string;
  style?: any;
};

export default function SvgIcon({ component: Comp, size = 24, color, style }: Props) {
  const colorProps = color ? { fill: color, stroke: color } : {};
  return React.createElement(Comp as any, { width: size, height: size, style, ...colorProps });
}

