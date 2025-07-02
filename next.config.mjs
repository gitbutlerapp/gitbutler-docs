import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  compress: true,
  swcMinify: true,
  cleanDistDir: true,
  images: {
    remotePatterns: [
      {
        hostname: "docs.gitbutler.com"
      },
      {
        protocol: "https",
        hostname: "gitbutler-docs-images-public.s3.us-east-1.amazonaws.com"
      }
    ],
    localPatterns: [
      {
        pathname: "/img/**"
      }
    ]
  }
}

export default createMDX()(config)
