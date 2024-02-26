/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },

      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/audio", // Adjust the path as needed
          outputPath: "static/audio", // Adjust the path as needed
          name: "[name].[ext]",
          esModule: false,
        },
      });
    }

    return config;
  },
};

module.exports = nextConfig;
