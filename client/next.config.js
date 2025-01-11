/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    })
    config.module.rules.push({
      test: /\.m?ts$|\.tsx?$/,
      // exclude: /node_modules/,
      use: {
        loader: "ts-loader",
        options: {
          onlyCompileBundledFiles: true,
        },
      },
    })
    return config
  },
}

module.exports = nextConfig
