"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryAppProvider({ children }: QueryProviderProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
}
