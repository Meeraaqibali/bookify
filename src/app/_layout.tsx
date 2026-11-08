import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/context/ThemeContext';
import ExitDialog from '@/components/ExitDialog';
import { useExitOnBack } from '@/hooks/useExitOnBack';
import { colors } from '@/constants/theme';

function AppContent() {
  const { exitVisible, cancelExit, confirmExit } = useExitOnBack();
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'slide_from_right',
        }}
      />
      <ExitDialog visible={exitVisible} onCancel={cancelExit} onConfirm={confirmExit} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
