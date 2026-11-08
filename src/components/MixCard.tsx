import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { space, radius } from '@/constants/theme';

export default function MixCard({ title, subtitle, imageUrl, slug }: any) {
  return (
    <Pressable 
      onPress={() => router.push({ pathname: '/category/[slug]', params: { slug, title } })}
      style={{ width: 160, height: 160, marginRight: space.md }}
    >
      <View style={{ flex: 1, borderRadius: radius.md, overflow: 'hidden' }}>
        <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: space.sm, paddingTop: 40 }}
        >
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '800' }} numberOfLines={2}>{title}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 }} numberOfLines={1}>{subtitle}</Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
}
