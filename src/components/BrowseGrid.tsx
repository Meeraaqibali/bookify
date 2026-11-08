import { View, Text, FlatList, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { space, radius } from '@/constants/theme';

const GRID_COLORS = ['#E13300', '#1E3264', '#8D67AB', '#E8115B', '#148A08', '#503750'];

export default function BrowseGrid({ categories }: { categories: any[] }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginTop: space.xl }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', paddingHorizontal: space.md, marginBottom: space.md }}>Browse all</Text>
      <FlatList
        data={categories} numColumns={2} scrollEnabled={false} keyExtractor={(item) => item.slug}
        contentContainerStyle={{ paddingHorizontal: space.sm }} columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: space.sm }}
        renderItem={({ item, index }) => (
          <Pressable style={{ flex: 1, backgroundColor: GRID_COLORS[index % GRID_COLORS.length], height: 90, borderRadius: radius.md, marginBottom: space.sm, marginHorizontal: space.xs, padding: space.sm, justifyContent: 'flex-start' }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '800' }}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
