import type { NextConfig } from "next";

/**
 * GitHub Pages project URLs are https://<user>.github.io/<repo>/ — static assets must live under
 * that same prefix or the browser requests /_next/... at the domain root and gets 404.
 * Vercel (and local dev) serve at /, so basePath stays empty when VERCEL is set or not production.
 */
const isProd = process.env.NODE_ENV === "production";
const onVercel = Boolean(process.env.VERCEL);
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];

const basePath =
  !isProd || onVercel
    ? ""
    : repoName
      ? `/${repoName}`
      : "/personal_website";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  transpilePackages: ["react-force-graph-2d", "force-graph", "react-kapsule"],
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
