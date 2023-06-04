import React, { useContext, createContext, useState } from 'react';
import { defaultTheme } from '@react-native-material/core';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  const updateTheme = (text, primary, background, border, secondary, error) => {
    const def = defaultTheme.palette;
    const textColor = text
      ? {
          caption: { ...defaultTheme.typography.caption, color: text },
          body2: { ...defaultTheme.typography.body2, color: text },
        }
      : {
          caption: defaultTheme.typography.caption,
          body2: defaultTheme.typography.body2,
        };
    const primaryColor = primary
      ? { main: primary, on: def.primary.on }
      : def.primary;
    const secondaryColor = secondary
      ? { main: secondary, on: def.secondary.on }
      : def.secondary;
    const backgroundColor = background
      ? { main: background, on: def.background.on }
      : def.background;
    const borderColor = border
      ? { main: border, on: border }
      : {
          primary: '#C6B18E',
          on: '#3C84A1',
        };
    const errorColor = error ? { main: error, on: def.error.on } : def.error;
    const updatedTheme = {
      ...defaultTheme,
      typography: {
        ...defaultTheme.typography,
        ...textColor,
      },
      palette: {
        ...defaultTheme.palette,
        primary: primaryColor,
        secondary: secondaryColor,
        background: backgroundColor,
        border: borderColor,
        error: errorColor,
      },
    };
    setTheme(updatedTheme);
  };

  const resetTheme = () => {
    const def = defaultTheme.palette;
    const textColor = {
      caption: defaultTheme.typography.caption,
      body2: defaultTheme.typography.body2,
    };
    const primaryColor = def.primary;
    const secondaryColor = def.secondary;
    const backgroundColor = def.background;
    const borderColor = {
      primary: '#C6B18E',
      on: '#3C84A1',
    };
    const errorColor = def.error;
    const updatedTheme = {
      ...defaultTheme,
      typography: {
        ...defaultTheme.typography,
        ...textColor,
      },
      palette: {
        ...defaultTheme.palette,
        primary: primaryColor,
        secondary: secondaryColor,
        background: backgroundColor,
        border: borderColor,
        error: errorColor,
      },
    };
    setTheme(updatedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCustomTheme must be used within a ThemeProvider');
  }
  return context;
};
