/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
  },
  webpack: (config, { isServer, dev }) => {
    config.module.rules.push({
      test: /\.mp3$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'assets/sounds/[name].[ext]',
          publicPath: `/_next/static/sounds/`,
          outputPath: `${isServer ? "../" : ""}static/sounds/`,
          esModule: false,
        },
      },
    });
    return config;
  },
}

module.exports = nextConfig
