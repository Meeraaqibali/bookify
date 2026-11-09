import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { saveBookOffline, getDownloads } from '@/lib/downloads';
import { space, radius } from '@/constants/theme';

export default function BookDetails() {
  const { key, title, author, cover, textUrl: initialTextUrl } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const [imgError, setImgError] = useState(false);
  const [description, setDescription] = useState('Loading description...');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  
  // Because we pass the text URL directly, we know immediately if it works
  const textUrl = initialTextUrl as string;
  const hasText = textUrl && textUrl !== '';

  useEffect(() => {
    async function checkDownloaded() {
      const downloads = await getDownloads();
      if (downloads.find(b => b.key === key)) setDownloaded(true);
    }
    checkDownloaded();

    async function fetchDescription() {
      // Try to get a real description from Open Library using the title
      try {
        const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(String(title))}&limit=1`);
        const json = await res.json();
        if (json.docs && json.docs.length > 0 && json.docs[0].key) {
           const detailRes = await fetch(`https://openlibrary.org${json.docs[0].key}.json`);
           const detailJson = await detailRes.json();
           if (detailJson.description) {
             setDescription(typeof detailJson.description === 'string' ? detailJson.description : detailJson.description.value);
             return;
           }
        }
        setDescription('No description available for this classic book.');
      } catch (e) { setDescription('Could not load description.'); }
    }
    fetchDescription(); 
  }, [key, title]);

  const handleRead = () => {
    if (hasText) {
      router.push({ pathname: '/book/reader', params: { title, textUrl } });
    }
  };

  const handleDownload = async () => {
    if (!hasText) return;
    setDownloading(true);
    try {
      await saveBookOffline(title as string, author as string, cover as string, textUrl, key as string);
      setDownloaded(true);
      Alert.alert("Success!", "Book saved to your Library for offline reading.");
    } catch (e) { 
      Alert.alert("Error", "Failed to download. Try again.");
    }
    setDownloading(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 120 }}>
      <LinearGradient colors={[colors.accent, colors.bg]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.6 }} style={{ paddingBottom: space.xl, paddingTop: insets.top + space.md }}>
        <View style={{ paddingHorizontal: space.md }}>
          <Pressable onPress={() => router.back()} style={{ padding: space.sm, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 99, alignSelf: 'flex-start' }}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </Pressable>
        </View>

        <View style={{ alignItems: 'center', marginTop: space.xl }}>
          {cover && !imgError ? (
            <Image source={{ uri: cover as string }} style={{ width: 200, height: 300, borderRadius: radius.md, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 15 }} contentFit="cover" onError={() => setImgError(true)} />
          ) : (
            <View style={{ width: 200, height: 300, borderRadius: radius.md, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', elevation: 15 }}>
              <Text style={{ color: colors.accent, fontSize: 80, fontWeight: '800' }}>{title?.toString().charAt(0)}</Text>
            </View>
          )}
          <Text style={{ color: colors.text, fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: space.xl, paddingHorizontal: space.md }}>{title}</Text>
          <Text style={{ color: colors.text, fontSize: 16, marginTop: space.xs, opacity: 0.8 }}>{author || 'Unknown Author'}</Text>
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: space.lg, marginTop: space.sm, flexDirection: 'row', gap: space.md }}>
        <Pressable onPress={handleRead} disabled={!hasText} style={{ flex: 1, backgroundColor: hasText ? colors.accent : colors.card, paddingVertical: 14, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Ionicons name="book" size={20} color={hasText ? "#000" : colors.textDim} />
          <Text style={{ color: hasText ? '#000' : colors.textDim, fontWeight: '800', fontSize: 16 }}>Read</Text>
        </Pressable>

        <Pressable onPress={handleDownload} disabled={downloading || !hasText || downloaded} style={{ flex: 1, backgroundColor: downloaded ? 'rgba(232, 163, 61, 0.2)' : 'transparent', borderWidth: 1, borderColor: downloaded ? colors.accent : (hasText ? colors.text : colors.card), paddingVertical: 14, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {downloading ? <ActivityIndicator color={colors.text} /> : <Ionicons name={downloaded ? "checkmark-circle" : "download-outline"} size={20} color={downloaded ? colors.accent : (hasText ? colors.text : colors.textDim)} />}
          <Text style={{ color: downloaded ? colors.accent : (hasText ? colors.text : colors.textDim), fontWeight: '700', fontSize: 16 }}>{downloaded ? 'Saved' : 'Download'}</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: space.md }}>About this book</Text>
        <Text style={{ color: colors.textDim, fontSize: 15, lineHeight: 26 }}>{description}</Text>
      </View>
    </ScrollView>
  );
}
