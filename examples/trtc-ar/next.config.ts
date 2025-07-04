import type { NextConfig } from 'next';

const baseConfig: NextConfig = {
  transpilePackages: ['tdesign-react'],
  images: {
    unoptimized: true,
  },
  webpack: (config, options) => {
    const { isServer } = options;
    config.module.rules.push({
      test: /\.(glb|hdr|mp4|mov|mp3|wav|webm)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/images/',
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name].[hash:8].[ext]',
          },
        },
      ],
    });
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 1024 * 1024,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
      },
    };
    return config;
  },
};

const nextConfig: NextConfig = {
  ...baseConfig,
  output: 'export',
};

export default nextConfig;
