"use client";

import { NetworkModeProvider } from "@/lib/contexts/NetworkModeContext";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import { SWRConfigProvider } from "@/lib/contexts/SWRConfigContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfigProvider>
      <HeroUIProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <NetworkModeProvider>
                {children}
              </NetworkModeProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </HeroUIProvider>
    </SWRConfigProvider>
  );
}
