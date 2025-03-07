import type { NextConfig } from "next";
import { version } from './package.json';
const nextConfig: NextConfig = {
  env: {
    VERSION: version,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/send",
        permanent: true, // Use `true` for a 308 permanent redirect
      },
    ];
  },
};

export default nextConfig;