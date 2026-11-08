import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import { router } from 'expo-router';

export function useExitOnBack() {
  const [visible, setVisible] = useState(false);
  const openRef = useRef(false);
  openRef.current = visible;

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (openRef.current) {
        setVisible(false);
        return true;
      }
      if (router.canGoBack()) return false;

      setVisible(true);
      return true;
    });
    return () => sub.remove();
  }, []);

  const cancel  = useCallback(() => setVisible(false), []);
  const confirm = useCallback(() => BackHandler.exitApp(), []);

  return { exitVisible: visible, cancelExit: cancel, confirmExit: confirm };
}
