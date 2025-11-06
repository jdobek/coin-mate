/**
 * Coin Mate App Colors
 * Global color swatches used throughout the app
 */

import { Platform } from 'react-native';

export const AppColors = {
  white: '#FFFFFF',
  greyLight: '#F3F3F3',
  greyMedium: '#D0D0D0',
  greyDark: '#6E6E6E',
  greyAccent: '#D0D5DC',
  black: '#000000',
  greenLight: '#D2F4E4',
  green: '#27B470',
  redLight: '#FFE7E7',
  red: '#FF4242',
} as const;

// Legacy Colors export for compatibility (can be removed later if not needed)
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/**
 * Coin Mate App Fonts
 * Google Fonts: Orelega One, Inter Tight, Inter
 */
export const AppFonts = {
  orelegaOne: 'OrelegaOne-Regular',
  interTight: 'InterTight-Regular',
  inter: 'Inter-Regular',
} as const;

// Legacy Fonts export for compatibility (can be removed later if not needed)
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
