import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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