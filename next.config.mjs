/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          canvas: false,
        };
      }
      config.externals = [...config.externals, "canvas", "jsdom"];
      return config;
    },
  };;

export default nextConfig;
  