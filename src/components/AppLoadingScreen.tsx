import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import { colors, space } from '@/constants/theme';

export default function AppLoadingScreen() {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.05, duration: 800, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.9, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center', zIndex: 9999 }]}>
      <Animated.View style={{ transform: [{ scale }], opacity, alignItems: 'center' }}>
        <Image 
          source={require('@/assets/images/icon.png')} 
          style={{ width: 120, height: 120, borderRadius: 30 }} 
        />
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', marginTop: space.lg, letterSpacing: 1 }}>
          Bookify
        </Text>
      </Animated.View>
    </View>
  );
}
