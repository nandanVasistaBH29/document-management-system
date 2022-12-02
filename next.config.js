const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  swSrc: "service-worker.js",
});

const nextConfig = withPWA({
  // next config
});
module.exports = nextConfig;
