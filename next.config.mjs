/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/mockup", destination: "/mockup/index.html" }];
  },
};
export default nextConfig;
