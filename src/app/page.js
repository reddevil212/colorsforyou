'use client';
import Home from "@/app/home/page";
import { useEffect, useState } from "react";
import { useTheme } from '@/components/theme/ThemeProvider';
import Loader from "@/components/loader/page";
import { LoadingProvider } from "@/context/LoadingContext";
export default function Page() {
  const { theme } = useTheme();
  const [headerHeight, setHeaderHeight] = useState(80); // Default header height




  // Get header height on mount
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      const headerRect = header.getBoundingClientRect();
      setHeaderHeight(headerRect.bottom);
    }

    // Update on resize
    const handleResize = () => {
      const header = document.querySelector('header');
      if (header) {
        const headerRect = header.getBoundingClientRect();
        setHeaderHeight(headerRect.bottom);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
     
          <div className="relative mx-4 md:mx-8">
            {/* Left border - dotted with dynamic color */}
            <div className="fixed left-4 md:left-8 top-0 bottom-0 w-px border-l border-dotted border-theme"></div>

            {/* Right border - dotted with dynamic color */}
            <div className="fixed right-4 md:right-8 top-0 bottom-0 w-px border-l border-dotted border-theme"></div>

            {/* Top border - dotted with dynamic color */}
            <div className="fixed left-4 md:left-8 right-4 md:right-8 top-0 h-px border-t border-dotted border-theme"></div>

            {/* Horizontal line at header bottom - dotted with dynamic color */}
            <div
              className="fixed left-0 right-0 h-px border-t border-dotted border-theme"
              style={{ top: `${headerHeight}px` }}
            ></div>

            {/* Content with margin */}
            <div className="pt-4">
              <Home />
            </div>
          </div>
        
    </>
  );
}