'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function AdSenseScript() {
  // Track script loading once per page
  useEffect(() => {
    
    if (typeof window !== 'undefined') {
      window._adsenseScriptLoaded = window._adsenseScriptLoaded || false;
    }
    return () => {};
  }, []);

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5453021366629473"
      crossOrigin="anonymous"
    />
  );
}