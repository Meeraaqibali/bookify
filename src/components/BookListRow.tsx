import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { space, radius } from '@/constants/theme';

export default function BookListRow({ book, index }: { book: any, index: number }) {
  const { colors } = useTheme();
  const [imgError, setImgError] = useState(false);

  // Use Gutendex formats and authors
  const coverUrl = book.formats?.['image/jpeg'];
  const authorName = book.authors?.[0]?.name || 'Unknown Author';
  
  // Find the text URL
  const textKey = Object.keys(book.formats || {}).find(k => k.includes('text/plain') || k.includes('text/html'));
  const textUrl = textKey ? book.formats[textKey] : null;

  return (
    <Pressable 
      onPress={() => router.push({
        pathname: '/book/[key]',
        params: { 
          key: book.id.toString(), 
          title: book.title, 
          author: authorName, 
          cover: coverUrl || '',
          textUrl: textUrl || ''
        }
      })}
      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.md, paddingVertical: space.sm }}
    >
      <Text style={{ color: colors.textDim, fontSize: 16, fontWeight: '600', width: 24 }}>{index + 1}</Text>
      
      {coverUrl && !imgError ? (
        <Image 
          source={{ uri: coverUrl }} 
          style={{ width: 50, height: 75, borderRadius: radius.sm, backgroundColor: colors.card }} 
          onError={() => setImgError(true)}
        />
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
