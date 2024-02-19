// Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the remix server. The CLI will eventually
// stop passing in HOST, so we can remove this workaround after the next major release.
if (
  process.env.HOST &&
  (!process.env.SHOPIFY_APP_URL ||
    process.env.SHOPIFY_APP_URL === process.env.HOST)
) {
  process.env.SHOPIFY_APP_URL = process.env.HOST;
  delete process.env.HOST;
}

module.exports = {
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",
  serverModuleFormat: "cjs",
  dev: { port: process.env.HMR_SERVER_PORT || 8002 },
  future: {},
  browserNodeBuiltinsPolyfill: {
    modules: {
      net: true,
      tls: true,
      timers: true,
      events: true,
      stream: true,
      buffer: true,
      string_decoder: true,
      process: true,
      crypto: true,
      zlib: true,
      util: true,
      url: true,
    },
  },
};
