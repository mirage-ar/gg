/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads-1716480673109.s3.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "abs.twimg.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "gg.zip",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;

// const withPWA = require("@ducanh2912/next-pwa").default({
//   dest: "public",
//   runtimeCaching: [
//     {
//       urlPattern: /^https:\/\/hunt\.gg\.zip\/(models|posters)\//,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'assets-cache',
//         expiration: {
//           maxEntries: 60, // cache only the latest 60 entries
//           maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
//         },
//       },
//     },
//     {
//       urlPattern: /\/app\/claim\/.*\/page/, // match /app/claim/[any-result]/page
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'claim-pages-cache',
//         expiration: {
//           maxEntries: 20,
//           maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
//         },
//       },
//     }
//   ],
// });

// module.exports = withPWA({
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "pbs.twimg.com",
//         port: "",
//       },
//     ],
//   },
// });


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "gg-zip",
    project: "gg",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
