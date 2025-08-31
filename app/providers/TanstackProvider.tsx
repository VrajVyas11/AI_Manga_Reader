"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
interface TanstackProviderProps {
  children: React.ReactNode
}

function TanstackProvider({ children }: TanstackProviderProps) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export default TanstackProvider;
