import { useWindowDimensions, PixelRatio, Platform } from 'react-native';

export default function useResponsive() {
  const { width, height } = useWindowDimensions();
  const baseW = 360;
  const baseH = 640;
  const scale = Math.min(width / baseW, height / baseH);
  const rs = (v: number) => Math.round(PixelRatio.roundToNearestPixel(v * scale));
  const vw = (p: number) => Math.round((width * p) / 100);
  const vh = (p: number) => Math.round((height * p) / 100);
  const headerHeight = Math.max(48, Math.min(rs(56), 64)) + (Platform.OS === 'ios' ? rs(4) : 0);
  const footerHeight = rs(64);
  const spacing = {
    xs: rs(4),
    sm: rs(8),
    md: rs(12),
    lg: rs(16),
    xl: rs(30),
  };
  return { width, height, scale, rs, vw, vh, headerHeight, footerHeight, spacing };
}