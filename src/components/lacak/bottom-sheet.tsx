import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Motion } from '@/constants/motion';
import { BottomTabInset, Brand, Radius, Spacing } from '@/constants/theme';

export type SheetSnap = 'half' | 'full';

/** Sheet heights include the strip hidden behind the tab bar. */
export function useSheetHeights() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bottomOffset = BottomTabInset + insets.bottom;
  return {
    half: Math.round(height * 0.44),
    full: height - insets.top - Spacing.six - Spacing.four,
    bottomOffset,
  };
}

type BottomSheetProps = {
  snap: SheetSnap;
  onSnapChange: (snap: SheetSnap) => void;
  /** Changing this scrolls the content back to the top, e.g. when another stop opens. */
  contentKey: string;
  children: ReactNode;
};

const VELOCITY_TO_SNAP = 0.5;

/**
 * The sheet is always laid out at full height and slides with `translateY` on the
 * native driver, so dragging and snapping stay smooth over the map.
 */
export function BottomSheet({ snap, onSnapChange, contentKey, children }: BottomSheetProps) {
  const { half, full, bottomOffset } = useSheetHeights();
  /** How far the sheet is pushed down from full height when it rests at half. */
  const halfOffset = full - half;
  const [offset] = useState(() => new Animated.Value(halfOffset));
  const scroll = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    Animated.spring(offset, {
      toValue: snap === 'full' ? 0 : halfOffset,
      useNativeDriver: true,
      ...Motion.sheetSpring,
    }).start();
  }, [snap, halfOffset, offset]);

  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [contentKey]);

  const panResponder = useMemo(() => {
    let start = halfOffset;
    // Up to full height; down to a little below half.
    const clamp = (value: number) => Math.max(0, Math.min(full - half * 0.8, value));
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 6,
      onPanResponderGrant: () => {
        offset.stopAnimation((value) => {
          start = value;
        });
      },
      onPanResponderMove: (_, gesture) => offset.setValue(clamp(start + gesture.dy)),
      onPanResponderRelease: (_, gesture) => {
        const current = clamp(start + gesture.dy);
        let next: SheetSnap;
        if (gesture.vy < -VELOCITY_TO_SNAP) next = 'full';
        else if (gesture.vy > VELOCITY_TO_SNAP) next = 'half';
        else next = current < halfOffset / 2 ? 'full' : 'half';
        Animated.spring(offset, {
          toValue: next === 'full' ? 0 : halfOffset,
          velocity: gesture.vy,
          useNativeDriver: true,
          ...Motion.sheetSpring,
        }).start();
        onSnapChange(next);
      },
    });
  }, [half, full, halfOffset, offset, onSnapChange]);

  return (
    <Animated.View style={[styles.sheet, { height: full, transform: [{ translateY: offset }] }]}>
      <View {...panResponder.panHandlers} style={styles.handleArea}>
        <View style={styles.handle} />
      </View>
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        // At half height the lower part of the sheet is off screen; the padding keeps
        // the last rows reachable by scrolling.
        contentContainerStyle={{
          paddingBottom: bottomOffset + Spacing.three + (snap === 'half' ? halfOffset : 0),
        }}>
        <Reanimated.View key={contentKey} entering={Motion.enter}>
          {children}
        </Reanimated.View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Brand.background,
    borderTopLeftRadius: Radius.card,
    borderTopRightRadius: Radius.card,
    boxShadow: '0 -4px 24px rgba(15, 23, 42, 0.12)',
    overflow: 'hidden',
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: Radius.full,
    backgroundColor: '#CBD5E1',
  },
});
