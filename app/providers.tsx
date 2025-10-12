"use client";

import { NetworkModeProvider } from "@/lib/contexts/NetworkModeContext";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ThemeProvider>
        <NetworkModeProvider>
          {children}
        </NetworkModeProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
