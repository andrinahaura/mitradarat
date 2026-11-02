import { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

/**
 * One motion language for the app: short fades for content that swaps, a gentle
 * layout glide when lists change, and a damped spring (no bounce) for sheets.
 */
export const Motion = {
  /** Panel or list content that replaces other content. */
  enter: FadeIn.duration(220),
  exit: FadeOut.duration(140),
  /** Items moving when a filter or accordion changes the list. */
  layout: LinearTransition.duration(220),
  /** Bottom sheets (React Native `Animated.spring`). Critically damped: settles without overshoot. */
  sheetSpring: { damping: 30, stiffness: 260, mass: 1, overshootClamping: true },
} as const;
