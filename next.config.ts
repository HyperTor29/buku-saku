import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimasi webpack
  webpack: (config, { isServer, nextRuntime }) => {
    // Hanya gunakan fallback di client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
    }

    // Optimalkan bundle size
    if (!isServer && nextRuntime !== 'edge') {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\\\/]node_modules[\\\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              maxSize: 244000, // ~244KB
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              maxSize: 244000, // ~244KB
            },
          },
        },
      };
    }

    return config;
  },
  // Optimasi caching
  generateBuildId: async () => {
    // Gunakan timestamp sebagai build ID untuk menghindari konflik
    return Date.now().toString();
  },
  // Konfigurasi experimental dalam satu objek
  experimental: {
    typedRoutes: false,
    // Tambahkan opsi optimasi tambahan
    cpus: 1, // Batasi jumlah CPU untuk konsistensi
  },
  // Konfigurasi Turbopack (stabil di Next.js 15)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  // Optimasi untuk build dan caching
  trailingSlash: false,
  reactStrictMode: true,
  // swcMinify removed as it's not a recognized option
  // Optimasi image
  images: {
    unoptimized: true, // Untuk build yang lebih cepat, nonaktifkan optimisasi gambar
  },
};

export default nextConfig;