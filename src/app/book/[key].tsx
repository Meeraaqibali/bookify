import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '@/context/ThemeContext';
import { space, radius } from '@/constants/theme';

export default function BookDetails() {
  const { key, title, author, cover } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [imgError, setImgError] = useState(false);
  const [description, setDescription] = useState('Loading description...');
  const [textUrl, setTextUrl] = useState<string | null>(null);
  const [fetchingDesc, setFetchingDesc] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [searchingBook, setSearchingBook] = useState(true);

  let coverUrl = cover && cover !== 'null' && cover !== '' ? `https://covers.openlibrary.org/b/id/${cover}-L.jpg` : null;

  useEffect(() => {
    async function fetchDescription() {
      if (!key) { setFetchingDesc(false); return; }
      try {
        const res = await fetch(`https://openlibrary.org${key}.json`);
        const json = await res.json();
        setDescription(json.description ? (typeof json.description === 'string' ? json.description : json.description.value) : 'No description available.');
      } catch (e) { setDescription('Could not load description.'); }
      setFetchingDesc(false);
    }

    async function fetchTextUrl() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        // Search Gutendex for the book
        const gutendex = await fetch(`https://gutendex.com/books?search=${encodeURIComponent(title as string)}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        const json = await gutendex.json();
        
        if (json.results && json.results.length > 0) {
          const formats = json.results[0].formats;
          // Look for txt or html files
          const fileUrl = formats['text/plain; charset=utf-8'] || 
                          formats['text/plain; charset=us-ascii'] || 
                          formats['text/plain'] || 
                          formats['text/html'];
          if (fileUrl) setTextUrl(fileUrl);
        }
      } catch (e) { console.log("Text search failed or timed out."); }
      setSearchingBook(false);
    }

    fetchDescription(); 
    fetchTextUrl();
  }, [key, title]);

  const handleRead = () => {
    if (textUrl) {
      router.push({ pathname: '/book/reader', params: { title, textUrl } });
    } else {
      Alert.alert("Not Available", "This book is not in the free public domain library yet.");
    }
  };

  const handleDownload = async () => {
    if (!textUrl) {
      Alert.alert("Not Available", "This book cannot be downloaded.");
      return;
    }
    setDownloading(true);
    try {
      const fileUri = FileSystem.documentDirectory + `${title}.txt`;
      await FileSystem.downloadAsync(textUrl, fileUri);
      Alert.alert("Success!", "Book saved for offline reading.");
    } catch (e) { Alert.alert("Error", "Failed to download."); }
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
          {coverUrl && !imgError ? (
            <Image source={{ uri: coverUrl }} style={{ width: 200, height: 300, borderRadius: radius.md, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 15 }} contentFit="cover" onError={() => setImgError(true)} />
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
        <Pressable onPress={handleRead} style={{ flex: 1, backgroundColor: textUrl ? colors.accent : colors.card, paddingVertical: 14, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {searchingBook ? <ActivityIndicator color="#000" /> : <Ionicons name="book" size={20} color={textUrl ? "#000" : colors.textDim} />}
          <Text style={{ color: textUrl ? '#000' : colors.textDim, fontWeight: '800', fontSize: 16 }}>Read</Text>
        </Pressable>

        <Pressable onPress={handleDownload} disabled={downloading || !textUrl} style={{ flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: textUrl ? colors.text : colors.card, paddingVertical: 14, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {downloading ? <ActivityIndicator color={colors.text} /> : <Ionicons name="download-outline" size={20} color={textUrl ? colors.text : colors.textDim} />}
          <Text style={{ color: textUrl ? colors.text : colors.textDim, fontWeight: '700', fontSize: 16 }}>Download</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: space.md }}>About this book</Text>
        {fetchingDesc ? <ActivityIndicator color={colors.accent} style={{ alignSelf: 'flex-start' }} /> : (
          <Text style={{ color: colors.textDim, fontSize: 15, lineHeight: 26 }}>{description}</Text>
        )}
      </View>
    </ScrollView>
  );
}
