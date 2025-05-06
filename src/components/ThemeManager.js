import React, { useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { useSettings } from '../context/SettingsContext';

const ThemeManager = () => {
  const { settings } = useSettings();
  const { setColorMode } = useColorMode();

  // Aplicar o tema quando as configurações mudarem
  useEffect(() => {
    if (settings.theme) {
      setColorMode(settings.theme);
    }
  }, [settings.theme, setColorMode]);

  return null; // Este componente não renderiza nada
};

export default ThemeManager; 