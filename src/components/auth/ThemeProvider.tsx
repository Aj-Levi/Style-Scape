// ThemeProvider.tsx (Client Component)
'use client';

import { useZustandStore } from "@/lib/stores/ZustandStore";
import { useEffect } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTheme } = useZustandStore();
  
  useEffect(() => {
    document.body.dataset.theme = currentTheme;
  }, [currentTheme]);
  
  return <>{children}</>;
}
