const path = require('path');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  images: {
    domains: ['images.unsplash.com'],
  },

  webpack: (config) => {
    config.resolve.alias['@components'] = path.join(
      __dirname,
      'components'
    );

    return config;
  },
};

module.exports = withMDX(nextConfig);