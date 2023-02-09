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
    TEST_SESSION_COOKIE: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..uVYWk4VOIhaxlTQp.sHc7QiUM0Fdz9pogTe3-Q3Z8XqrJBjSu_-pP_N_qkGfrVHQ7_L-sI7WLPqqIYEd_zXZd6KQH69g--skZx0xG-f_p5PeTjPXt1UgNb3QuyMpMjv07v9zC3YUoovRX8zW1bDEsTr7Zqjcf5YwbDiyAatCsLg-q4jMwaAb_h24z5U6uwkM5vw-2jZ1VV5Nxg7eBTyabTeL_A0M3GFwtYDkEmJlN.Uv3WANjmyTJiPzUvV9OfAA'
  },
});
