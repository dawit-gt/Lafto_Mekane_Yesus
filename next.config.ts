import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The members list used to live at /family.
    return [{ source: "/family", destination: "/members", permanent: true }];
  },
};

export default nextConfig;