// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs')
const SENTRY_DSN = process.env.SENTRY_DSN

let nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // ref: https://nextjs.org/docs/pages/api-reference/next-config-js/eslint
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
let sentryWebpackPluginOptions = {}
if (SENTRY_DSN) {
  nextConfig = {
    ...nextConfig,
    sentry: {
      // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
      // for client-side builds. (This will be the default starting in
      // `@sentry/nextjs` version 8.0.0.) See
      // https://webpack.js.org/configuration/devtool/ and
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
      // for more information.
      hideSourceMaps: true,
    },
  }

  sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, configFile, stripPrefix, urlPrefix, include, ignore

    silent: true, // Suppresses all logs
    project: process.env.SENTRY_PROJECT,
    org: process.env.SENTRY_ORG,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
  }

  module.exports = withSentryConfig(
    nextConfig,
    sentryWebpackPluginOptions
  )
}
