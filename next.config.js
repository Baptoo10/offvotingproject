// next.config.js

const solcLoader = require("solc-loader");

const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.sol$/,
      use: "solc-loader",
    });
    return config;
  },
};

module.exports = nextConfig;
