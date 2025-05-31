/** @type {import('next').NextConfig} */
const nextConfig = {
   output: 'export',
   
   // Add this to ensure proper link handling in the static export
   trailingSlash: true,
   
   // Ensure links work properly in a static export
   images: {
     unoptimized: true,
   },

   
};

export default nextConfig;
