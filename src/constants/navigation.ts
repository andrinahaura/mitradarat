import { Brand } from '@/constants/theme';

/**
 * Header of every pushed screen in every tab (references 1 and 3): white bar, dark
 * back arrow, centered semibold title. Tab roots use the blue `TabHeader` instead.
 */
export const stackScreenOptions = {
  headerTintColor: Brand.text,
  headerBackButtonDisplayMode: 'minimal',
  headerTitleAlign: 'center',
  headerStyle: { backgroundColor: Brand.surface },
  headerTitleStyle: { color: Brand.text, fontWeight: '600', fontSize: 17 },
  contentStyle: { backgroundColor: Brand.background },
  // Native iOS push and pop; swipe back from anywhere on the screen, not only the edge.
  animation: 'default',
  gestureEnabled: true,
  fullScreenGestureEnabled: true,
  animationMatchesGesture: true,
} as const;
