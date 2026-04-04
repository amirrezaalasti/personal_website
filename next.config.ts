import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath =
  isProd && repoName
    ? `/${repoName}`
    : isProd
      ? "/personal_website"
      : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
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
