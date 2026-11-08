import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { space, radius } from '@/constants/theme';

export function SkeletonBookCard() {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: 120, marginRight: space.md }}>
      <Animated.View style={{ width: 120, height: 180, borderRadius: radius.md, backgroundColor: colors.card, opacity }} />
      <Animated.View style={{ width: 90, height: 14, borderRadius: 4, backgroundColor: colors.card, marginTop: space.sm, opacity }} />
      <Animated.View style={{ width: 60, height: 12, borderRadius: 4, backgroundColor: colors.card, marginTop: space.xs, opacity }} />
    </View>
  );
}

export function SkeletonRow() {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: space.md }}>
      <Animated.View style={{ width: 50, height: 75, borderRadius: radius.sm, backgroundColor: colors.card, opacity }} />
      <View style={{ marginLeft: space.md, flex: 1 }}>
        <Animated.View style={{ width: '80%', height: 16, borderRadius: 4, backgroundColor: colors.card, opacity }} />
        <Animated.View style={{ width: '40%', height: 12, borderRadius: 4, backgroundColor: colors.card, marginTop: space.sm, opacity }} />
      </View>
    </View>
  );
}
