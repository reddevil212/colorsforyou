'use client';

import { useEffect, useRef } from 'react';

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  style = { display: 'block' }
}) {
  const adRef = useRef(null);
  const adId = useRef(`ad-${Math.random().toString(36).substring(2, 9)}`);
  const initialized = useRef(false);

  useEffect(() => {
    // Only try to initialize if adsbygoogle is loaded
    const initAd = () => {
      if (!initialized.current && adRef.current && window.adsbygoogle) {
        // Check if this specific element already has ads
        if (!adRef.current.dataset.adInitialized) {
          try {
            initialized.current = true;
            adRef.current.dataset.adInitialized = 'true';
            adRef.current.id = adId.current;
            
            // Push to adsbygoogle
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (err) {
            console.error('AdSense error:', err);
          }
        }
      }
    };

    // We need a small delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      if (window.adsbygoogle) {
        initAd();
      } else {
        window.addEventListener('adsenseLoaded', initAd);
      }
    }, 200);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('adsenseLoaded', initAd);
    };
  }, []);

  return (
    <div className="ad-container my-4">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-5492056952455482"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}