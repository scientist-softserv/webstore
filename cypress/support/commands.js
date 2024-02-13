// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { scientistApiBaseURL } from './e2e'

// add a command to login that uses a session, so the user will remain logged in throughout the test file vs. needing to log in before each example.
// source: https://github.com/nextauthjs/next-auth/discussions/2053#discussioncomment-1191016
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
  cy.intercept('/api/auth/session', { fixture: 'session.json' }).as('session')

  // Set the cookie for cypress.
  // It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
  // This cookie also may need to be refreshed intermittently if it expires
  cy.setCookie('next-auth.session-token', Cypress.env('TEST_SESSION_COOKIE'))
  })
})

// intercepts requests and creates potential cases for loading, error, data, and empty data
// required params are action, defaultFixture, requestURL
// optional params such as data, loading, and error can be passed depending on the creation of test cases that are related to that specific api call
Cypress.Commands.add('customApiIntercept', ({
  action, alias, data, defaultFixture, emptyFixture, error, errorCaseStatusCode, loading, requestURL
}) => {
  cy.intercept(action, scientistApiBaseURL + requestURL, (req) => {
    switch (true) {
      // reply with an empty response: both data and error will be undefined.
      case loading: req.reply()
      break

      // error will be defined
      case error: req.reply({ statusCode: errorCaseStatusCode || 500 })
      break

      // reply with a request body- default status code is 200
      case data: req.reply({ fixture: defaultFixture })
      break

      // reply with the empty fixture is there is one, and the default as a backup. Allows us to isolate one api call at a time that may potentially respond with empty data.
      case !data: req.reply({ fixture: emptyFixture || defaultFixture })
      break

      default: req.reply({ fixture: defaultFixture })
      break
    }
  }).as(alias || 'customIntercept')
})

Cypress.Commands.add('useFilteredWares', () => {
  cy.intercept(/\/wares\.json\?per_page=2000&q.*/, (req) => {
    req.url = req.url.replace(/per_page=\d+/, `per_page=${Cypress.env('API_PER_PAGE')}`)
    req.continue()
  })
})

Cypress.Commands.add('waitForElement', (selector) => {
  cy.get(selector).should('exist')
})
