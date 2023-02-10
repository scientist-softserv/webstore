require('dotenv').config({ path: `.env.local`, override: true });

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
      config.env = {
        ...process.env,
        ...config.env
      }
      return config 
    },
  },
});
