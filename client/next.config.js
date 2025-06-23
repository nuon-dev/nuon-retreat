const path = require("path")

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  compiler: {
    styledComponents: true,
  },

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
    config.resolve.alias["@"] = path.resolve(__dirname, "src")
    return config
  },
}

module.exports = nextConfig
