/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    turbopack: {}, // Silence Turbopack warning for webpack config
    // `serverComponentsExternalPackages` moved out of `experimental` in newer Next.js
    serverExternalPackages: ['@prisma/client'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ddtdjzntsgbevivyuhrg.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        // Exclude Node.js built-in modules from client-side bundle
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                tls: false,
                net: false,
                fs: false,
                path: false,
                crypto: false,
                dns: false,
            };
        }
        return config;
    },
};

export default nextConfig;
