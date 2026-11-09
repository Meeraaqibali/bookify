import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Image as RNImage } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import { getDownloads, removeDownload, DownloadedBook } from '@/lib/downloads';
import { space, radius } from '@/constants/theme';

export default function Library() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [downloads, setDownloads] = useState<DownloadedBook[]>([]);

  // Reload the library every time you open the tab
  useFocusEffect(
    useCallback(() => {
      getDownloads().then(setDownloads);
    }, [])
  );

  const handleDelete = async (key: string, uri: string) => {
    await removeDownload(key, uri);
    setDownloads(downloads.filter(b => b.key !== key));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingBottom: space.xl }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>Your Library</Text>
        <Pressable><Ionicons name="add" size={28} color={colors.text} /></Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.md, gap: space.sm, marginTop: space.lg, marginBottom: space.lg }}>
        {['Downloaded', 'Playlists', 'Authors', 'Albums'].map((filter, i) => (
          <View key={filter} style={{ backgroundColor: i === 0 ? colors.accent : colors.card, paddingHorizontal: space.md, paddingVertical: 6, borderRadius: 20 }}>
            <Text style={{ color: i === 0 ? colors.bg : colors.text, fontWeight: '600', fontSize: 13 }}>{filter}</Text>
          </View>
        ))}
      </ScrollView>

      <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700', paddingHorizontal: space.md, marginBottom: space.md }}>Downloaded Books</Text>

      {downloads.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Ionicons name="download-outline" size={60} color={colors.card} />
          <Text style={{ color: colors.textDim, marginTop: space.md }}>No downloads yet.</Text>
          <Text style={{ color: colors.textFaint, fontSize: 12, marginTop: 4 }}>Download a classic book to read offline.</Text>
        </View>
      ) : (
        downloads.map((book) => (
          <Pressable 
            key={book.key} 
            onPress={() => router.push({ pathname: '/book/reader', params: { title: book.title, textUrl: book.localUri } })}
            style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.md, paddingVertical: space.sm }}
          >
            {book.coverUrl ? (
               <Image source={{ uri: book.coverUrl }} style={{ width: 60, height: 90, borderRadius: radius.sm, backgroundColor: colors.card }} />
            ) : (
               <View style={{ width: 60, height: 90, borderRadius: radius.sm, backgroundColor: colors.card }} />
            )}
            
            <View style={{ flex: 1, marginLeft: space.md }}>
              <Text numberOfLines={2} style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>{book.title}</Text>
              <Text numberOfLines={1} style={{ color: colors.textDim, fontSize: 13, marginTop: 4 }}>{book.author}</Text>
              <Text style={{ color: colors.accent, fontSize: 11, marginTop: 4, fontWeight: '600' }}>READ OFFLINE</Text>
            </View>

            <Pressable onPress={() => handleDelete(book.key, book.localUri)} style={{ padding: space.sm }}>
              <Ionicons name="trash-outline" size={20} color={colors.textDim} />
            </Pressable>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
