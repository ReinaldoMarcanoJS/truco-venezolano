import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fdhttrhgakwfdzhipssf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatars/**',
      },
    ],
  }
};


// ## Error Type
// Runtime Error

// ## Error Message
// Invalid src prop (https://fdhttrhgakwfdzhipssf.supabase.co/storage/v1/object/public/avatars/avatars/4928bb9e-e464-4bfe-bf6a-20e34d0b0f98-1757261037686.jpg) on `next/image`, hostname "fdhttrhgakwfdzhipssf.supabase.co" is not configured under images in your `next.config.js`
// See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host


//     at Sidebar (components/Sidebar.tsx:138:15)
//     at MyHeader (components/Header.tsx:9:13)
//     at ProtectedPage (app/protected/lobby/page.tsx:135:9)

// ## Code Frame
//   136 |             {/* Perfil */}
//   137 |             <div className="flex flex-col items-center mt-10 mb-6 relative">
// > 138 |               <Image
//       |               ^
//   139 |                 src={photo}
//   140 |                 width={80}
//   141 |                 height={80}

// Next.js version: 15.5.0 (Turbopack)


export default nextConfig;
