import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import BookCard from '@/components/BookCard';
import { space } from '@/constants/theme';

export default function CategoryScreen() {
  const { slug, title } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`https://gutendex.com/books?topic=${encodeURIComponent(slug as string)}&sort=popular`);
        const json = await res.json();
        setBooks(json.results || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    fetchCategory();
  }, [slug]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + space.md, paddingHorizontal: space.md, flexDirection: 'row', alignItems: 'center', marginBottom: space.lg }}>
        <Pressable onPress={() => router.back()} style={{ padding: space.sm, backgroundColor: colors.card, borderRadius: 99, marginRight: space.md }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>{title}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={{ paddingHorizontal: space.md, paddingBottom: 100 }}
          columnWrapperStyle={{ gap: space.sm, marginBottom: space.md }}
          renderItem={({ item }) => <BookCard book={item} />}
        />
      )}
    </View>
  );
}
