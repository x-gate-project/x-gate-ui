/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const { version } = require('./package.json');
const nextConfig = {
  i18n,
  env: {
    VERSION: version,
  },
  images: {
    domains: ['ipfs.io'],
  },
};

module.exports = nextConfig;
