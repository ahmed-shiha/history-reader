/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/articles/[slug]': ['./content/articles/**/*'],
    '/books/[slug]/[chapter]': ['./content/books/**/*'],
  },
}

export default nextConfig
