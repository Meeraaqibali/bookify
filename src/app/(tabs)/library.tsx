import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { space, radius } from '@/constants/theme';

export default function Library() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + space.lg, paddingBottom: 100 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.md }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>Your Library</Text>
        <Pressable><Ionicons name="add" size={28} color={colors.text} /></Pressable>
      </View>

      {/* Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.md, gap: space.sm, marginTop: space.lg }}>
        {['Playlists', 'Books', 'Authors', 'Downloaded', 'Albums'].map((filter, i) => (
          <View key={filter} style={{ backgroundColor: i === 0 ? colors.accent : colors.card, paddingHorizontal: space.md, paddingVertical: 6, borderRadius: 20 }}>
            <Text style={{ color: i === 0 ? colors.bg : colors.text, fontWeight: '600', fontSize: 13 }}>{filter}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Liked Books */}
      <Pressable style={{ flexDirection: 'row', alignItems: 'center', padding: space.md, marginTop: space.md }}>
        <View style={{ width: 60, height: 60, borderRadius: radius.md, backgroundColor: '#4A148C', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="heart" size={30} color="#FFF" />
        </View>
        <View style={{ marginLeft: space.md }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Liked Books</Text>
          <Text style={{ color: colors.textDim, fontSize: 13, marginTop: 2 }}>Playlist • 12 books</Text>
        </View>
      </Pressable>

      {/* Recently Read */}
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', paddingHorizontal: space.md, marginTop: space.lg, marginBottom: space.sm }}>Recently Read</Text>
      {[1, 2, 3].map((i) => (
        <Pressable key={i} style={{ flexDirection: 'row', alignItems: 'center', padding: space.md }}>
          <View style={{ width: 50, height: 75, borderRadius: radius.sm, backgroundColor: colors.card }} />
          <View style={{ marginLeft: space.md }}>
            <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>Placeholder Book {i}</Text>
            <Text style={{ color: colors.textDim, fontSize: 13, marginTop: 2 }}>Author Name</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}
