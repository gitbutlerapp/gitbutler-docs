import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  eslint: {
    ignoreDuringBuilds: true
  },
  compress: true,
  swcMinify: true,
  cleanDistDir: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "docs.gitbutler.com"
      }
    ]
  },
  webpack: (config) => {
    config.module.noParse = [/typescript\/lib\/typescript.js/]

    return config
  }
}

export default createMDX()(config)
