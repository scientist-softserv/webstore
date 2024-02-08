const dotenvFlowPlugin = require('cypress-dotenv-flow')
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      config = dotenvFlowPlugin(config)
      config.env = {
        ...process.env,
        ...config.env
      }
      return config
    },
  },
  env: {
    TEST_SCIENTIST_USER: 'test@test.com',
    TEST_SCIENTIST_PW: '!test1234',
    NEXT_PUBLIC_PROVIDER_NAME: process.env.NEXT_PUBLIC_PROVIDER_NAME,
    NEXT_PUBLIC_PROVIDER_ID: process.env.NEXT_PUBLIC_PROVIDER_ID,
    NEXT_PUBLIC_TOKEN: process.env.NEXT_PUBLIC_TOKEN,
    // importing the `API_PER_PAGE` variable from the constants file throws
    // errors since this file doesn't follow ES6 syntax. if the value is
    // changed in constants, it needs to be updated here too
    API_PER_PAGE: 2000,
  },
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/results-[hash].xml',
    toConsole: true,
  },
})
