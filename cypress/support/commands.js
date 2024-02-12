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

/**
 * This command intercepts requests and returns the given stubbed response
 *
 * @param {string} alias - the alias to give the intercept (convention is to
 * use the function name)
 * @param {string} data - the fixture to return as the response data
 * @param {object} error - the error object to return as the response error
 * @param {string} requestURL - the URL to intercept
 *
 * @returns {object} - the stubbed response
 */
Cypress.Commands.add('customApiIntercept', ({
  alias, data, error, requestURL
}) => {
  cy.intercept(`${scientistApiBaseURL}${requestURL}`, (req) => {
    const response = {
      data: data && { fixture: data },
      error,
    }

    // falling back to an empty object mimics the loading state
    return req.reply(response.data || response.error || {})
  }).as(alias || 'customIntercept')
})
