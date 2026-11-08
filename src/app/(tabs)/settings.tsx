import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { space, radius } from '@/constants/theme';

const THEMES = [
  { name: 'Amber (Books)', color: '#E8A33D' },
  { name: 'Spotify Green', color: '#1DB954' },
  { name: 'Ocean Blue', color: '#2E77D0' },
  { name: 'Crimson Red', color: '#E5484D' },
];

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { colors, setAccent } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 100 }}>
      
      {/* Premium Header with Gradient */}
      <LinearGradient colors={[colors.accent, colors.bg]} style={{ paddingTop: insets.top + space.xl, paddingBottom: space.xl, alignItems: 'center' }}>
        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', marginBottom: space.md, borderWidth: 4, borderColor: colors.accent }}>
          <Ionicons name="person" size={50} color={colors.textDim} />
        </View>
        <Text style={{ color: colors.bg, fontSize: 26, fontWeight: '900' }}>Book Lover</Text>
        <Text style={{ color: colors.bg, opacity: 0.8, fontSize: 14, fontWeight: '600' }}>Free Plan • 42 Books Read</Text>
      </LinearGradient>

      <View style={{ paddingHorizontal: space.md, marginTop: space.lg }}>
        
        {/* Stats Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: space.xl }}>
          <View style={{ alignItems: 'center', flex: 1, backgroundColor: colors.card, padding: space.md, borderRadius: radius.md, marginRight: space.sm }}>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>14</Text>
            <Text style={{ color: colors.textDim, fontSize: 12 }}>Books Read</Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1, backgroundColor: colors.card, padding: space.md, borderRadius: radius.md, marginLeft: space.sm }}>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>5h</Text>
            <Text style={{ color: colors.textDim, fontSize: 12 }}>Reading Time</Text>
          </View>
        </View>

        {/* Theme Selector */}
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: space.md }}>Accent Color</Text>
        {THEMES.map((theme) => (
          <Pressable 
            key={theme.name} onPress={() => setAccent(theme.color)}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, padding: space.md, borderRadius: radius.md, marginBottom: space.sm }}
          >
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: theme.color, marginRight: space.md }} />
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>{theme.name}</Text>
            {colors.accent === theme.color && <View style={{ marginLeft: 'auto' }}><Ionicons name="checkmark-circle" size={24} color={theme.color} /></View>}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
