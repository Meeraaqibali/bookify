import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { ThemeProvider } from '@/context/ThemeContext';
import ExitDialog from '@/components/ExitDialog';
import AppLoadingScreen from '@/components/AppLoadingScreen';
import { useExitOnBack } from '@/hooks/useExitOnBack';
import { colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { exitVisible, cancelExit, confirmExit } = useExitOnBack();
  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
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
        if (Platform.OS === 'android') {
          // Forces the native window background to dark
          await SystemUI.setBackgroundColorAsync(colors.bg);
          // Forces the navigation buttons to be white (light style) on the dark background
          await NavigationBar.setButtonStyleAsync('light');
        }
        
        await SplashScreen.hideAsync();
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    }
    prepare();
  }, []);

  if (!isAppReady) {
    return <AppLoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
