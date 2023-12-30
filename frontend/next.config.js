const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: [
      "localhost",
      "localhost:8000",
      "localhost:8080",
      "8000",
      "8080",
      "127.0.0.1",
      "backend",
      "backend:80",
      "backend:8000",
      "backend:8080",
    ],
  },
};

module.exports = nextConfig;
