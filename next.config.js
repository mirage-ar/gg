/** @type {import('next').NextConfig} */
const nextConfig = {
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
  
  module.exports = nextConfig;
  