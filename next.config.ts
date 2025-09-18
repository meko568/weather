import type { NextConfig } from "next";

const repoName = "weather";

const nextConfig: NextConfig = {
  // Export static HTML for GitHub Pages
  output: "export",
  // Ensure URLs work when hosted under /weather
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  // GitHub Pages doesn't support Next Image Optimization
  images: { unoptimized: true },
  // Helps static hosting serve index.html per folder
  trailingSlash: true,
};

export default nextConfig;
