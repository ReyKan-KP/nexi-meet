/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mongoose"],
    missingSuspenseWithCSRBailout: false,
  },
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
  exclude: [
    /\.map$/, // Ignore all .map files
    /ReactToastify\.css\.map$/, // Ignore only ReactToastify.css.map
    /other-directory-to-ignore/,
    // Add more patterns to ignore other files or directories
  ],
};

export default nextConfig;
