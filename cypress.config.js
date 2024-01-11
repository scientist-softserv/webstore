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
    NEXT_PUBLIC_PROVIDER_NAME: 'acme',
    NEXT_PUBLIC_PROVIDER_ID: '572'
  },
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/results-[hash].xml',
    toConsole: true,
  },
});
