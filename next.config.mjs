/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/articles/[slug]': ['./content/articles/**/*'],
  },
}

export default nextConfig
