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
  const { key, title, author, cover } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  
  const [imgError, setImgError] = useState(false);
  const [description, setDescription] = useState('Loading description...');
  const [textUrl, setTextUrl] = useState<string | null>(null);
  const [fetchingDesc, setFetchingDesc] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [searchingBook, setSearchingBook] = useState(true);

  let coverUrl = cover && cover !== 'null' && cover !== '' ? `https://covers.openlibrary.org/b/id/${cover}-L.jpg` : null;

  useEffect(() => {
    // Check if already downloaded
    async function checkDownloaded() {
      const downloads = await getDownloads();
      if (downloads.find(b => b.key === key)) setDownloaded(true);
    }
    checkDownloaded();

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
        const cleanTitle = title ? String(title).split(/[:;]/)[0].trim() : '';
        const cleanAuthor = author ? String(author).split(' ').pop() : '';
        const query = encodeURIComponent(`${cleanTitle} ${cleanAuthor}`.trim());
        const gutendex = await fetch(`https://gutendex.com/books?search=${query}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        const json = await gutendex.json();
        
        if (json.results && json.results.length > 0) {
          const bestMatch = json.results.find((r: any) => r.formats['text/plain; charset=utf-8'] || r.formats['text/plain'] || r.formats['text/html']);
          if (bestMatch) {
            const formats = bestMatch.formats;
            const fileUrl = formats['text/plain; charset=utf-8'] || formats['text/plain'] || formats['text/html'];
            if (fileUrl) setTextUrl(fileUrl);
          }
        }
      } catch (e) { console.log("Text search failed."); }
      setSearchingBook(false);
    }

    fetchDescription(); 
    fetchTextUrl();
  }, [key, title, author]);

  const handleRead = () => {
    if (textUrl) {
      router.push({ pathname: '/book/reader', params: { title, textUrl } });
    } else {
      Alert.alert("Copyrighted", "This book is copyrighted. Try a classic!");
    }
  };

  const handleDownload = async () => {
    if (!textUrl) return;
    setDownloading(true);
    try {
      await saveBookOffline(title as string, author as string, coverUrl, textUrl, key as string);
      setDownloaded(true);
      Alert.alert("Success!", "Book saved to your Library for offline reading.");
    } catch (e) { 
      Alert.alert("Error", "Failed to download. (Note: Web browsers block downloads, use Expo Go or the APK)."); 
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
          <Text style={{ color: textUrl ? '#000' : colors.textDim, fontWeight: '800', fontSize: 16 }}>{searchingBook ? 'Finding...' : 'Read'}</Text>
        </Pressable>

        <Pressable onPress={handleDownload} disabled={downloading || !textUrl || downloaded} style={{ flex: 1, backgroundColor: downloaded ? 'rgba(232, 163, 61, 0.2)' : 'transparent', borderWidth: 1, borderColor: downloaded ? colors.accent : (textUrl ? colors.text : colors.card), paddingVertical: 14, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {downloading ? <ActivityIndicator color={colors.text} /> : <Ionicons name={downloaded ? "checkmark-circle" : "download-outline"} size={20} color={downloaded ? colors.accent : (textUrl ? colors.text : colors.textDim)} />}
          <Text style={{ color: downloaded ? colors.accent : (textUrl ? colors.text : colors.textDim), fontWeight: '700', fontSize: 16 }}>{downloaded ? 'Saved' : 'Download'}</Text>
        </Pressable>
      </View>

      {!searchingBook && !textUrl && (
        <View style={{ marginHorizontal: space.lg, marginTop: space.md, padding: space.md, backgroundColor: 'rgba(229, 72, 77, 0.1)', borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(229, 72, 77, 0.3)' }}>
          <Text style={{ color: '#E5484D', fontSize: 13, textAlign: 'center', fontWeight: '600' }}>This book is copyrighted. Try a classic like 'Frankenstein'!</Text>
        </View>
      )}

      <View style={{ paddingHorizontal: space.lg, marginTop: space.xl }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: space.md }}>About this book</Text>
        {fetchingDesc ? <ActivityIndicator color={colors.accent} /> : <Text style={{ color: colors.textDim, fontSize: 15, lineHeight: 26 }}>{description}</Text>}
      </View>
    </ScrollView>
  );
}
