import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { space, radius } from '@/constants/theme';

export default function BookCard({ book }: { book: any }) {
  const [imgError, setImgError] = useState(false);
  const { colors } = useTheme();

  // Gutendex provides the cover URL directly in formats
  const coverUrl = book.formats?.['image/jpeg'];
  const authorName = book.authors?.[0]?.name || 'Unknown Author';
  
  // Find the text link right now so we can pass it to the details page
  const textKey = Object.keys(book.formats || {}).find(k => k.includes('text/plain') || k.includes('text/html'));
  const textUrl = textKey ? book.formats[textKey] : null;

  const handlePress = () => {
    router.push({
      pathname: '/book/[key]',
      params: {
        key: book.id,
        title: book.title,
        author: authorName,
        cover: coverUrl || '',
        textUrl: textUrl || ''
      }
    });
  };

  return (
    <Pressable onPress={handlePress} style={{ width: 120, marginRight: space.md }}>
      {coverUrl && !imgError ? (
        <Image
          source={{ uri: coverUrl }}
          style={{ width: 120, height: 180, borderRadius: radius.md, backgroundColor: colors.card }}
          contentFit="cover"
          transition={200}
          onError={() => setImgError(true)}
        />
      ) : (
        <View style={{ width: 120, height: 180, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
          <Text style={{ color: colors.accent, fontSize: 40, fontWeight: '800' }}>{book.title.charAt(0)}</Text>
        </View>
      )}
      <Text numberOfLines={2} style={{ color: colors.text, fontSize: 13, fontWeight: '600', marginTop: space.sm }}>{book.title}</Text>
      <Text numberOfLines={1} style={{ color: colors.textDim, fontSize: 11, marginTop: 2 }}>{authorName}</Text>
    </Pressable>
  );
}
