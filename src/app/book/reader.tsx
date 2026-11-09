import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StatusBar as RNStatusBar } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { space } from '@/constants/theme';

export default function Reader() {
  const { title, textUrl } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialScrollY, setInitialScrollY] = useState(0);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `@bookify_scroll_${textUrl}`;

  useEffect(() => {
    async function fetchText() {
      if (!textUrl) { setLoading(false); return; }
      
      // 1. Load saved scroll position
      try {
        const savedY = await AsyncStorage.getItem(storageKey);
        if (savedY) setInitialScrollY(parseFloat(savedY));
      } catch (e) {}

      // 2. Load the book text
      try {
        let txt = '';
        if (textUrl.toString().startsWith('file://')) {
          txt = await FileSystem.readAsStringAsync(textUrl as string);
        } else {
          const res = await fetch(textUrl as string);
          txt = await res.text();
        }
        
        // Clean HTML and fix spacing
        const cleanText = txt.replace(/<[^>]*>?/gm, '').replace(/\r\n/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();
        setText(cleanText);
      } catch (e) { 
        setText('Failed to load the text.'); 
      }
      setLoading(false);
    }
    fetchText();

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [textUrl, storageKey]);

  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    
    // Debounce: Only save to AsyncStorage every 1 second of scrolling
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    
    saveTimeout.current = setTimeout(() => {
      AsyncStorage.setItem(storageKey, currentY.toString()).catch(() => {});
    }, 1000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF9F6' }}>
      {/* FIX: Status bar turns dark (black icons) so they are visible on the light background */}
      <StatusBar style="dark" backgroundColor="#FAF9F6" translucent={false} />

      <View style={{ paddingTop: insets.top + space.md, paddingHorizontal: space.md, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E5E5', paddingBottom: space.md }}>
        <Pressable onPress={() => router.back()} style={{ padding: space.sm }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text numberOfLines={1} style={{ color: '#333', fontSize: 18, fontWeight: '700', flex: 1, marginLeft: space.sm }}>{title}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E8A33D" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView 
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ padding: space.lg, paddingBottom: 100 }}
          onContentSizeChange={() => {
            // Once text is loaded, jump to the saved position
            if (initialScrollY > 0 && scrollViewRef.current) {
              scrollViewRef.current.scrollTo({ y: initialScrollY, animated: false });
            }
          }}
        >
          <Text style={{ color: '#333', fontSize: 18, lineHeight: 32, fontFamily: 'serif' }}>
            {text.length > 0 ? text : 'Text not available.'}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
