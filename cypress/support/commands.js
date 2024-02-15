import { scientistApiBaseURL } from './e2e'

// add a command to login that uses a session, so the user will remain logged in throughout the test file vs. needing to log in before each example.
// source: https://github.com/nextauthjs/next-auth/discussions/2053#discussioncomment-1191016
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    cy.intercept('/api/auth/session', { fixture: 'session.json' }).as('session')

    // Set the cookie for cypress.
    // It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
    // This cookie also may need to be refreshed intermittently if it expires
    // TODO(alishaevn): https://github.com/scientist-softserv/webstore/issues/375
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

/**
 * Intercept the useFilteredWares API call to modify the per_page query
 * parameter. We're lowering it in an attempt to speed up the test. Then,
 * we continue to hit the server with the modified request.
 */
Cypress.Commands.add('useFilteredWares', () => {
  cy.intercept(/\/wares\.json\?per_page=2000&q.*/, (req) => {
    req.url = req.url.replace(/per_page=\d+/, `per_page=${Cypress.env('API_PER_PAGE')}`)
    req.continue()
  })
})

/**
 * To avoid the flakiness of the test, we wait for the element to exist
 */
Cypress.Commands.add('waitForElement', (selector) => {
  cy.get(selector).should('exist')
})
