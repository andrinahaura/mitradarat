/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * MitraDarat palette from design.md: MitraDarat blue (the v1 main color) for actions,
 * slate-indigo ink, cool light-gray canvas with white cards (as in the reference
 * designs). Green and red only carry status meaning (live data, laik / tidak laik,
 * report status).
 */
export const Brand = {
  primary: '#2350E6',
  primaryPressed: '#1C43C7',
  primarySoft: '#EAF0FF',
  accent: '#F5A623',
  accentSoft: '#FFF4E0',
  success: '#16A34A',
  successSoft: '#E7F7EE',
  danger: '#E5484D',
  text: '#1A2138',
  textSecondary: '#5F6677',
  textMuted: '#98A0AE',
  textOnPrimary: '#FFFFFF',
  border: '#E8ECF2',
  /** Input outlines; a step darker than card borders so fields read as tappable. */
  inputBorder: '#D8DEE8',
  background: '#F4F6FA',
  surface: '#FFFFFF',
  /** Slate-indigo fill for high-contrast pills. */
  surfaceContrast: '#1A2138',
  /** 5% slate-indigo, the neutral icon-tile fill. */
  neutralTint: 'rgba(26, 33, 56, 0.05)',
} as const;

/**
 * One radius scale for every screen. `card` is for cards, panels and sheets;
 * `control` for buttons, inputs, chips and icon buttons; `large` for tiles inside
 * cards; `full` only for true circles (dots, avatars, map markers).
 */
export const Radius = {
  small: 6,
  medium: 8,
  large: 12,
  card: 14,
  control: 10,
  /** Beranda only (reference 4): white panels, gray cards inside them, and the gray sheet. */
  panel: 20,
  inner: 14,
  sheet: 24,
  full: 999,
} as const;

/** Side inset of every screen. */
export const Gutter = 20;

export const Shadow = {
  /** Resting cards: barely there, it only lifts white cards off the gray canvas. */
  card: '0 1px 3px rgba(16, 24, 40, 0.05)',
  /** Surfaces floating over the map or content: search bar, sheet, map buttons. */
  softCard: '0 8px 24px -6px rgba(16, 24, 40, 0.14)',
  button: '0 8px 20px -6px rgba(35, 80, 230, 0.4)',
} as const;

/** Content card: white, hairline border and a faint resting shadow. */
export const Card = {
  backgroundColor: Brand.surface,
  borderRadius: Radius.card,
  borderWidth: 1,
  borderColor: Brand.border,
  boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
} as const;

/** Primary button: solid blue, no glow. */
export const PrimaryButton = {
  height: 50,
  paddingHorizontal: 24,
  borderRadius: Radius.control,
  backgroundColor: Brand.primary,
  alignItems: 'center',
  justifyContent: 'center',
} as const;

/** Secondary button: white with an outline, blue text. */
export const SecondaryButton = {
  height: 50,
  paddingHorizontal: 24,
  borderRadius: Radius.control,
  borderWidth: 1,
  borderColor: Brand.inputBorder,
  backgroundColor: Brand.surface,
  alignItems: 'center',
  justifyContent: 'center',
} as const;

/** Text input: white field with a visible outline. */
export const PillInput = {
  minHeight: 50,
  paddingHorizontal: 16,
  borderRadius: Radius.control,
  borderWidth: 1,
  borderColor: Brand.inputBorder,
  backgroundColor: Brand.surface,
} as const;

/** White 44 round button with a hairline border (back, save, inbox). */
export const IconButton = {
  width: 44,
  height: 44,
  borderRadius: Radius.full,
  borderWidth: 1,
  borderColor: Brand.border,
  backgroundColor: Brand.surface,
  alignItems: 'center',
  justifyContent: 'center',
} as const;

/**
 * Type roles on the iOS system font. Bold headings, regular-weight body at sizes
 * that stay readable for older riders (body 15, nothing under 12).
 */
export const Type = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.5 },
  headlineLarge: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.4 },
  headline: { fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.2 },
  headlineSmall: { fontSize: 16, lineHeight: 22, fontWeight: '600', letterSpacing: -0.15 },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontSize: 15, lineHeight: 20, fontWeight: '600' },
  labelSmall: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  eyebrow: { fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
} as const;

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
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
