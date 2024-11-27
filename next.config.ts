import type { NextConfig } from "next";

const repoName = process.env.REPO_NAME;
const basePath = repoName ? `/${repoName}` : undefined;

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath,
};

export default nextConfig;
