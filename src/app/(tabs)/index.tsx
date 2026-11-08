import { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import MixCard from '@/components/MixCard';
import BookListRow from '@/components/BookListRow';
import { SkeletonBookCard, SkeletonRow } from '@/components/Skeleton';
import { space, radius } from '@/constants/theme';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const MIXES = [
  { title: 'Sci-Fi Classics', subtitle: 'Dystopian futures', slug: 'science_fiction', imageUrl: 'https://covers.openlibrary.org/b/id/12695562-L.jpg' },
  { title: 'Psychology 101', subtitle: 'Understanding the mind', slug: 'psychology', imageUrl: 'https://covers.openlibrary.org/b/id/240727-S.jpg' },
  { title: 'Wealth & Power', subtitle: 'Economics and business', slug: 'economics', imageUrl: 'https://covers.openlibrary.org/b/id/13267557-S.jpg' },
];

const CATEGORIES = [
  { title: 'Fantasy', slug: 'fantasy' }, { title: 'Mystery & Detective', slug: 'mystery_and_detective_stories' },
  { title: 'Classic Literature', slug: 'classics' }, { title: 'Romance', slug: 'romance' },
];

const AUTHORS = [
  { name: 'Jane Austen', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg/440px-CassandraAusten-JaneAusten%28c.1810%29_hires.jpg' },
  { name: 'Charles Dickens', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Dickens_Gurney_head.jpg/440px-Dickens_Gurney_head.jpg' },
  { name: 'Mark Twain', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Mark_Twain_by_AF_Bradley.jpg/440px-Mark_Twain_by_AF_Bradley.jpg' },
  { name: 'Mary Shelley', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/RothwellMaryShelley.jpg/440px-RothwellMaryShelley.jpg' },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [data, setData] = useState<Record<string, any[]>>({});
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    async function fetchBooks() {
      const newData: Record<string, any[]> = {};
      try {
        const trendRes = await fetch('https://openlibrary.org/subjects/trending.json?limit=5');
        const trendJson = await trendRes.json();
        setTrending((trendJson.works || []).filter((w:any) => w.cover_id));
      } catch (e) {}

      await Promise.allSettled(CATEGORIES.map(async (cat) => {
        try {
          const res = await fetch(`https://openlibrary.org/subjects/${cat.slug}.json?limit=20`);
          const json = await res.json();
          newData[cat.title] = (json.works || []).filter((w: any) => w.cover_id);
        } catch (e) { newData[cat.title] = []; }
      }));
      setData(newData); setLoading(false);
    }
    fetchBooks();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + space.md, paddingBottom: 120 }}>
      
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800', paddingHorizontal: space.md, letterSpacing: -0.5 }}>
        {greeting}
      </Text>

      {/* Jump Back In Grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: space.sm, marginTop: space.lg, justifyContent: 'space-between' }}>
        {MIXES.map((mix, i) => (
          <Pressable key={i} onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: mix.slug, title: mix.title } })} style={{ width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.sm, marginBottom: space.sm, overflow: 'hidden' }}>
            <Image source={{ uri: mix.imageUrl }} style={{ width: 56, height: 56 }} />
            <Text numberOfLines={2} style={{ color: colors.text, fontSize: 13, fontWeight: '700', flex: 1, paddingHorizontal: space.sm }}>{mix.title}</Text>
          </Pressable>
        ))}
      </View>

      {/* Made for You */}
      <View style={{ marginTop: space.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md, marginBottom: space.md }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>Made for you</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.md }}>
          {MIXES.map((mix, i) => <MixCard key={i} {...mix} />)}
        </ScrollView>
      </View>

      {/* Top Authors */}
      <View style={{ marginTop: space.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md, marginBottom: space.md }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>Top Authors</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.md, gap: space.lg }}>
          {AUTHORS.map((author, i) => (
            <View key={i} style={{ alignItems: 'center' }}>
              <Image source={{ uri: author.img }} style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.card }} />
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600', marginTop: space.sm }}>{author.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Trending Books */}
      <View style={{ marginTop: space.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md, marginBottom: space.sm }}>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>Trending Books</Text>
        </View>
        {loading ? <><SkeletonRow /><SkeletonRow /></> : trending.map((book, index) => <BookListRow key={book.key} book={book} index={index} />)}
      </View>

      {/* Category Carousels */}
      {CATEGORIES.map((cat) => (
        <View key={cat.slug} style={{ marginTop: space.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md, marginBottom: space.md }}>
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', letterSpacing: -0.5 }}>{cat.title}</Text>
            <Pressable onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: cat.slug, title: cat.title } })}>
              <Text style={{ color: colors.textDim, fontSize: 14, fontWeight: '600' }}>More &gt;</Text>
            </Pressable>
          </View>
          {loading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.md }}>
              <SkeletonBookCard /><SkeletonBookCard /><SkeletonBookCard />
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.md }}>
              {(data[cat.title] || []).map((book) => (
                <View key={book.key} style={{ marginRight: space.md }}>
                  <Pressable onPress={() => router.push({ pathname: '/book/[key]', params: { key: book.key, title: book.title, author: book.authors?.[0]?.name, cover: book.cover_id } })}>
                     <Image source={{ uri: `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` }} style={{ width: 120, height: 180, borderRadius: radius.md, backgroundColor: colors.card }} />
                     <Text numberOfLines={2} style={{ color: colors.text, fontSize: 13, fontWeight: '600', marginTop: space.sm }}>{book.title}</Text>
                     <Text numberOfLines={1} style={{ color: colors.textDim, fontSize: 11, marginTop: 2 }}>{book.authors?.[0]?.name}</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
