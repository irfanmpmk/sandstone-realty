import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A package-lock.json in a parent folder would otherwise be taken as the workspace root.
  turbopack: { root: __dirname },
  // PGlite ships WebAssembly and data files; load it from node_modules instead of bundling.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
