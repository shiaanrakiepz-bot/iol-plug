"use client";

import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "./toast-provider";
import { HubProvider } from "./hub-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <HubProvider>{children}</HubProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
