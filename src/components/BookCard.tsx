import { useState } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { space, radius } from '@/constants/theme';

export default function BookCard({ book }: { book: any }) {
  const [imgError, setImgError] = useState(false);
  const { colors } = useTheme();
  
  // Try cover_id first, then try ISBN, then give up
  let coverUrl = null;
  if (book.cover_id) {
    coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`;
  } else if (book.isbn && book.isbn.length > 0) {
    coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`;
  }

  const authorName = book.authors?.[0]?.name || book.author_name?.[0] || 'Unknown Author';

  return (
    <Link 
      href={{
        pathname: '/book/[key]',
        params: { 
          key: book.key, 
          title: book.title, 
          author: authorName,
          cover: book.cover_id || '',
          isbn: (book.isbn && book.isbn.length > 0) ? book.isbn[0] : ''
        }
      }} 
      asChild
    >
      <Text style={{ width: 120, marginRight: space.md, color: 'transparent' }}>
        <View>
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
              <Text numberOfLines={2} style={{ color: colors.textDim, fontSize: 10, textAlign: 'center', marginTop: 8 }}>Cover Not Found</Text>
            </View>
          )}
          <Text numberOfLines={2} style={{ color: colors.text, fontSize: 13, fontWeight: '600', marginTop: space.sm }}>{book.title}</Text>
          <Text numberOfLines={1} style={{ color: colors.textDim, fontSize: 11, marginTop: 2 }}>{authorName}</Text>
        </View>
      </Text>
    </Link>
  );
}
