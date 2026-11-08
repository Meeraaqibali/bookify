import { Text, View, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import BookCard from './BookCard';
import { space } from '@/constants/theme';

export default function BookCarousel({ title, slug, books, loading }: any) {
  const { colors } = useTheme();
  
  return (
    <View style={{ marginTop: space.xl }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md, marginBottom: space.md }}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700' }}>{title}</Text>
        <Pressable onPress={() => router.push({ pathname: '/category/[slug]', params: { slug, title } })}>
          <Text style={{ color: colors.textDim, fontSize: 14, fontWeight: '600' }}>More &gt;</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginLeft: space.md, alignSelf: 'flex-start' }} />
      ) : (
        <FlatList 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          data={books} 
          keyExtractor={(item) => item.key} 
          contentContainerStyle={{ paddingHorizontal: space.md }} 
          renderItem={({ item }) => <BookCard book={item} />} 
        />
      )}
    </View>
  );
}
