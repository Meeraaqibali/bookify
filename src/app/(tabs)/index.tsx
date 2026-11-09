import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable, StatusBar as RNStatusBar, Platform, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import MixCard from '@/components/MixCard';
import BookListRow from '@/components/BookListRow';
import BookCard from '@/components/BookCard'; // <--- THIS WAS MISSING
import { SkeletonBookCard, SkeletonRow } from '@/components/Skeleton';
import { space, radius } from '@/constants/theme';
import { Image } from 'expo-image';
import { router } from 'expo-router';

const MIXES = [
  { title: 'Sci-Fi Classics', subtitle: 'Dystopian futures', topic: 'science fiction', imageUrl: 'https://covers.openlibrary.org/b/id/12695562-L.jpg' },
  { title: 'Psychology 101', subtitle: 'Understanding the mind', topic: 'psychology', imageUrl: 'https://covers.openlibrary.org/b/id/240727-S.jpg' },
  { title: 'Wealth & Power', subtitle: 'Economics and business', topic: 'economics', imageUrl: 'https://covers.openlibrary.org/b/id/13267557-S.jpg' },
];

const CATEGORIES = [
  { title: 'Fantasy', topic: 'fantasy' }, { title: 'Mystery & Detective', topic: 'mystery' },
  { title: 'Classic Literature', topic: 'literature' }, { title: 'Romance', topic: 'romance' },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [data, setData] = useState<Record<string, any[]>>({});
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) : 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const fetchWithTimeout = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return await res.json();
    } catch (e) {
      clearTimeout(timeoutId);
      return null;
    }
  };

  const loadData = async () => {
    const newData: Record<string, any[]> = {};
    
    const trendJson = await fetchWithTimeout('https://gutendex.com/books?sort=popular');
    if (trendJson && trendJson.results) setTrending(trendJson.results.slice(0, 5));

    for (const cat of CATEGORIES) {
      const catJson = await fetchWithTimeout(`https://gutendex.com/books?topic=${encodeURIComponent(cat.topic)}&sort=popular`);
      newData[cat.title] = catJson && catJson.results ? catJson.results.slice(0, 20) : [];
    }
    
    setData(newData); 
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.bg }} 
      contentContainerStyle={{ paddingTop: topInset + space.md, paddingBottom: space.xl }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
    >
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800', paddingHorizontal: space.md, letterSpacing: -0.5 }}>
        {greeting}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: space.sm, marginTop: space.lg, justifyContent: 'space-between' }}>
        {MIXES.map((mix, i) => (
          <Pressable key={i} onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: mix.topic, title: mix.title } })} style={{ width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.sm, marginBottom: space.sm, overflow: 'hidden' }}>
            <Image source={{ uri: mix.imageUrl }} style={{ width: 56, height: 56 }} />
            <Text numberOfLines={2} style={{ color: colors.text, fontSize: 13, fontWeight: '700', flex: 1, paddingHorizontal: space.sm }}>{mix.title}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: space.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md, marginBottom: space.md }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>Made for you</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.md }}>
          {MIXES.map((mix, i) => <MixCard key={i} {...mix} />)}
        </ScrollView>
      </View>

      <View style={{ marginTop: space.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md, marginBottom: space.sm }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>Trending Books</Text>
        </View>
        {loading ? <><SkeletonRow /><SkeletonRow /></> : (trending.length > 0 ? trending.map((book, index) => <BookListRow key={book.id} book={book} index={index} />) : <Text style={{ color: colors.textDim, paddingHorizontal: space.md }}>Network slow. Pull down to refresh.</Text>)}
      </View>

      {CATEGORIES.map((cat) => (
        <View key={cat.topic} style={{ marginTop: space.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md, marginBottom: space.md }}>
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>{cat.title}</Text>
            <Pressable onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: cat.topic, title: cat.title } })}>
              <Text style={{ color: colors.textDim, fontSize: 14, fontWeight: '600' }}>More &gt;</Text>
            </Pressable>
          </View>
          {loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.md }}>
              <SkeletonBookCard /><SkeletonBookCard /><SkeletonBookCard />
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.md }}>
              {(data[cat.title] || []).length > 0 ? (data[cat.title] || []).map((book) => (
                <View key={book.id} style={{ marginRight: space.md }}>
                  <BookCard book={book} />
                </View>
              )) : <Text style={{ color: colors.textDim, paddingLeft: space.md }}>No books found.</Text>}
            </ScrollView>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
