/** @type {import('next').NextConfig} */

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/hunt\.gg\.zip\/(models|posters)\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'assets-cache',
        expiration: {
          maxEntries: 60, // cache only the latest 60 entries
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /\/app\/claim\/.*\/page/, // match /app/claim/[any-result]/page
      handler: 'CacheFirst',
      options: {
        cacheName: 'claim-pages-cache',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    }
  ],
});

module.exports = withPWA({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
      },
    ],
  },
});
