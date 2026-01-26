import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface ParentalControlsContextType {
  enabled: boolean;
  pin: string | null;
  setEnabled: (enabled: boolean) => void;
  setPin: (pin: string) => void;
  verifyPin: (inputPin: string) => boolean;
  clearPin: () => void;
}

const ParentalControlsContext = createContext<ParentalControlsContextType | null>(null);

const STORAGE_KEY = 'parental_controls';

interface StoredSettings {
  enabled: boolean;
  pin: string | null;
}

export function ParentalControlsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(false);
  const [pin, setPinState] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const settings: StoredSettings = JSON.parse(stored);
        setEnabledState(settings.enabled);
        setPinState(settings.pin);
      } catch {
        // Invalid stored data, use defaults
      }
    }
  }, []);

  // Save settings to localStorage when they change
  const saveSettings = (newEnabled: boolean, newPin: string | null) => {
    const settings: StoredSettings = { enabled: newEnabled, pin: newPin };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  };

  const setEnabled = (newEnabled: boolean) => {
    setEnabledState(newEnabled);
    saveSettings(newEnabled, pin);
  };

  const setPin = (newPin: string) => {
    setPinState(newPin);
    saveSettings(enabled, newPin);
  };

  const verifyPin = (inputPin: string): boolean => {
    return pin === inputPin;
  };

  const clearPin = () => {
    setPinState(null);
    saveSettings(enabled, null);
  };

  return (
    <ParentalControlsContext.Provider value={{ enabled, pin, setEnabled, setPin, verifyPin, clearPin }}>
      {children}
    </ParentalControlsContext.Provider>
  );
}

export function useParentalControls() {
  const context = useContext(ParentalControlsContext);
  if (!context) {
    throw new Error('useParentalControls must be used within ParentalControlsProvider');
  }
  return context;
}
