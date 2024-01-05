/** @type {import('next').NextConfig} */

// const withPWA = require("@ducanh2912/next-pwa").default({
//   dest: "public",
// });

module.exports = {
  images: {
    remotePatterns: [
      {
        // TODO: remove img from the path
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        // pathname: "/account123/**",
      },
    ],
  },
};
