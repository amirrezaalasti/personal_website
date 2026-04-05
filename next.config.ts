import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.fei.uni-hannover.de",
        pathname: "/fileadmin/**",
      },
    ],
  },
};

export default nextConfig;
