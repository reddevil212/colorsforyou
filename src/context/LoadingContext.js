'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Loader from '@/components/loader/page';

const LoadingContext = createContext({
  isPageLoading: false,
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }) {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Set loading state
    const handleStartLoading = () => {
      setIsPageLoading(true);
    };

    // Finish loading after 700ms minimum to prevent flashing
    const handleCompleteLoading = () => {
      setTimeout(() => {
        setIsPageLoading(false);
      }, 700);
    };

    handleStartLoading();
    handleCompleteLoading();
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isPageLoading, setIsPageLoading }}>
      {isPageLoading && <Loader />}
      {children}
    </LoadingContext.Provider>
  );
}