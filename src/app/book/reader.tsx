import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import { space } from '@/constants/theme';

export default function Reader() {
  const { title, textUrl } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchText() {
      if (!textUrl) { setLoading(false); return; }
      try {
        let txt = '';
        if (textUrl.toString().startsWith('file://')) {
          // Offline local file
          txt = await FileSystem.readAsStringAsync(textUrl as string);
        } else {
          // Online remote file
          const res = await fetch(textUrl as string);
          txt = await res.text();
        }
        
        // Clean HTML and fix spacing
        const cleanText = txt.replace(/<[^>]*>?/gm, '').replace(/\r\n/g, '\n').replace(/\n\s*\n/g, '\n\n').trim();
        setText(cleanText);
      } catch (e) { 
        console.error(e);
        setText('Failed to load the text.'); 
      }
      setLoading(false);
    }
    fetchText();
  }, [textUrl]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF9F6' }}>
      <View style={{ paddingTop: insets.top + space.md, paddingHorizontal: space.md, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E5E5', paddingBottom: space.md }}>
        <Pressable onPress={() => router.back()} style={{ padding: space.sm }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text numberOfLines={1} style={{ color: '#333', fontSize: 18, fontWeight: '700', flex: 1, marginLeft: space.sm }}>{title}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E8A33D" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingBottom: 100 }}>
          <Text style={{ color: '#333', fontSize: 18, lineHeight: 32, fontFamily: 'serif' }}>
            {text.length > 0 ? text : 'Text not available.'}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
