import { useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import BookCard from '@/components/BookCard';
import { space, radius } from '@/constants/theme';
import { router } from 'expo-router';

const ALL_CATEGORIES = [
  { title: 'Psychology', slug: 'psychology' }, { title: 'Science Fiction', slug: 'science_fiction' },
  { title: 'Economics', slug: 'economics' }, { title: 'Classic Literature', slug: 'classics' },
  { title: 'Fantasy', slug: 'fantasy' }, { title: 'Mystery', slug: 'mystery_and_detective_stories' },
  { title: 'Romance', slug: 'romance' }, { title: 'History', slug: 'history' },
  { title: 'Philosophy', slug: 'philosophy' }, { title: 'Biography', slug: 'biography' },
  { title: 'Science', slug: 'science' }, { title: 'Business', slug: 'business' },
  { title: 'Poetry', slug: 'poetry' }, { title: 'Short Stories', slug: 'short_stories' },
  { title: 'Horror', slug: 'horror' }, { title: 'Adventure', slug: 'adventure' },
];

const GRID_COLORS = ['#E13300', '#1E3264', '#8D67AB', '#E8115B', '#148A08', '#503750', '#B06239', '#0D73EC'];

export default function Search() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(text: string) {
    setQuery(text);
    if (text.length < 3) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(text)}&limit=30`);
      const json = await res.json();
      setResults(json.docs || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  const showResults = query.length >= 3;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + space.lg }}>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800', paddingHorizontal: space.md }}>Search</Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, marginHorizontal: space.md, marginTop: space.md, marginBottom: space.lg, borderRadius: radius.md, paddingHorizontal: space.sm, height: 48 }}>
        <Ionicons name="search" size={20} color={colors.textDim} />
        <TextInput style={{ flex: 1, color: colors.text, fontSize: 16, marginLeft: space.sm }} placeholder="What do you want to read?" placeholderTextColor={colors.textFaint} value={query} onChangeText={handleSearch} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: space.xl }} />
      ) : showResults ? (
        <FlatList
          key="search-results"
          data={results}
          keyExtractor={(item) => item.key}
          numColumns={3}
          contentContainerStyle={{ paddingHorizontal: space.md, paddingBottom: 150 }} // paddingBottom ensures it scrolls above the tab bar
          columnWrapperStyle={{ gap: space.sm, marginBottom: space.lg }}
          renderItem={({ item }) => <BookCard book={{ ...item, cover_id: item.cover_i, authors: [{ name: item.author_name?.[0] }] }} />}
          ListEmptyComponent={<Text style={{ color: colors.textDim, textAlign: 'center', marginTop: 40 }}>No books found.</Text>}
        />
      ) : (
        <FlatList
          key="browse-grid"
          data={ALL_CATEGORIES}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: space.sm, paddingBottom: 150 }} // paddingBottom ensures it scrolls above the tab bar
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: space.sm }}
          ListHeaderComponent={<Text style={{ color: colors.text, fontSize: 20, fontWeight: '700', paddingHorizontal: space.sm, marginBottom: space.md }}>Browse all</Text>}
          keyExtractor={(item) => item.slug}
          renderItem={({ item, index }) => (
            <Pressable 
              onPress={() => router.push({ pathname: '/category/[slug]', params: { slug: item.slug, title: item.title } })}
              style={{ flex: 1, backgroundColor: GRID_COLORS[index % GRID_COLORS.length], height: 100, borderRadius: radius.md, marginBottom: space.sm, marginHorizontal: space.xs, padding: space.sm, justifyContent: 'flex-start' }}
            >
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>{item.title}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
