const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
    baseUrl:'http://localhost:3000',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  env: {
    SCIENTIST_USER: 'test@test.com',
    SCIENTIST_PW: '!test1234',
    TEST_SESSION_COOKIE: process.env.TEST_SESSION_COOKIE
  },
});
