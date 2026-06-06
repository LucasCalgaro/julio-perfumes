"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // opcional: evita refetch imediato
          },
        },
      }),
  );

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextThemesProvider>
  );
};

export default Providers;
