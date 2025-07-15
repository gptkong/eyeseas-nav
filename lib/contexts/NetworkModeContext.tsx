'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NetworkMode } from '@/lib/types';

interface NetworkModeContextType {
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  toggleNetworkMode: () => void;
}

const NetworkModeContext = createContext<NetworkModeContextType | undefined>(undefined);

export function NetworkModeProvider({ children }: { children: React.ReactNode }) {
  const [networkMode, setNetworkModeState] = useState<NetworkMode>('external');

  // Load network mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('networkMode') as NetworkMode;
    if (savedMode && (savedMode === 'internal' || savedMode === 'external')) {
      setNetworkModeState(savedMode);
    }
  }, []);

  // Save network mode to localStorage when it changes
  const setNetworkMode = (mode: NetworkMode) => {
    setNetworkModeState(mode);
    localStorage.setItem('networkMode', mode);
  };

  const toggleNetworkMode = () => {
    const newMode = networkMode === 'internal' ? 'external' : 'internal';
    setNetworkMode(newMode);
  };

  return (
    <NetworkModeContext.Provider value={{ networkMode, setNetworkMode, toggleNetworkMode }}>
      {children}
    </NetworkModeContext.Provider>
  );
}

export function useNetworkMode() {
  const context = useContext(NetworkModeContext);
  if (context === undefined) {
    throw new Error('useNetworkMode must be used within a NetworkModeProvider');
  }
  return context;
}
