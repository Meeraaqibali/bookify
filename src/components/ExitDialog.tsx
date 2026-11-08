import { Modal, Pressable, Text, View, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { radius, space } from '@/constants/theme';

export default function ExitDialog({
  visible, onCancel, onConfirm,
}: { visible: boolean; onCancel: () => void; onConfirm: () => void }) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        onPress={onCancel}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: 300, backgroundColor: colors.bgElevated,
            borderRadius: radius.xl, padding: space.lg, alignItems: 'center',
            borderWidth: 1, borderColor: colors.border,
          }}
        >
          <Image source={require('@/assets/images/icon.png')} style={{ width: 64, height: 64, borderRadius: radius.lg, marginBottom: space.md }} />
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Exit Bookify?</Text>
          <Text style={{ color: colors.textDim, fontSize: 14, textAlign: 'center', marginTop: space.xs, marginBottom: space.lg }}>
            Your reading progress is saved.
          </Text>
          <View style={{ flexDirection: 'row', gap: space.sm, width: '100%' }}>
            <Pressable onPress={onCancel} style={{ flex: 1, paddingVertical: 12, borderRadius: radius.md, backgroundColor: colors.card, alignItems: 'center' }}>
              <Text style={{ color: colors.text, fontWeight: '600' }}>Cancel</Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={{ flex: 1, paddingVertical: 12, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: 'center' }}>
              <Text style={{ color: colors.bg, fontWeight: '700' }}>Exit</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
