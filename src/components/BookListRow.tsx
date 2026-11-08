import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { space, radius } from '@/constants/theme';

export default function BookListRow({ book, index }: { book: any, index: number }) {
  const { colors } = useTheme();
  
  const coverUrl = book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : null;
  const authorName = book.authors?.[0]?.name || 'Unknown Author';

  return (
    <Pressable 
      onPress={() => router.push({
        pathname: '/book/[key]',
        params: { key: book.key, title: book.title, author: authorName, cover: book.cover_id || '' }
      })}
      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.md, paddingVertical: space.sm }}
    >
      <Text style={{ color: colors.textDim, fontSize: 16, fontWeight: '600', width: 24 }}>{index + 1}</Text>
      
      {coverUrl ? (
        <Image source={{ uri: coverUrl }} style={{ width: 50, height: 75, borderRadius: radius.sm, backgroundColor: colors.card }} />
      ) : (
        <View style={{ width: 50, height: 75, borderRadius: radius.sm, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.accent, fontSize: 20, fontWeight: '800' }}>{book.title.charAt(0)}</Text>
        </View>
      )}

      <View style={{ flex: 1, marginLeft: space.md, justifyContent: 'center' }}>
        <Text numberOfLines={1} style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>{book.title}</Text>
        <Text numberOfLines={1} style={{ color: colors.textDim, fontSize: 13, marginTop: 4 }}>{authorName}</Text>
      </View>

      <Pressable hitSlop={10} style={{ padding: space.sm }}>
        <Ionicons name="download-outline" size={24} color={colors.accent} />
      </Pressable>
    </Pressable>
  );
}
