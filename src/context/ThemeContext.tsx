import React, { createContext, useContext, useState } from 'react';
import { colors as baseColors } from '@/constants/theme';

const ThemeContext = createContext({
  colors: baseColors,
  setAccent: (color: string) => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccent] = useState(baseColors.accent);
  const colors = { ...baseColors, accent };

  return (
    <ThemeContext.Provider value={{ colors, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
