import { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/context/ThemeContext';
import ExitDialog from '@/components/ExitDialog';
import AppLoadingScreen from '@/components/AppLoadingScreen';
import { useExitOnBack } from '@/hooks/useExitOnBack';
import { colors } from '@/constants/theme';

// Keep the native splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Hide the native splash screen immediately so our custom animation shows
        await SplashScreen.hideAsync();
        
        // Simulate loading time (e.g., fetching user data, fonts, etc.)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    }
    prepare();
  }, []);

  // Show the custom animated loading screen
  if (!isAppReady) {
    return <AppLoadingScreen />;
  }

  // Show the actual app
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
