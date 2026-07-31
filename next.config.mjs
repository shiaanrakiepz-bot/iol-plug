/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lint is run separately via `npm run lint`. We don't want a stray lint
  // warning to block a production build during a live presentation.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
