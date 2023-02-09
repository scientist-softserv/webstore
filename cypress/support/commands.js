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


// add a command to login that uses a session, so the user will remain logged in throughout the test vs. needing to log in before each example.
// source: https://github.com/nextauthjs/next-auth/discussions/2053#discussioncomment-1191016
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
  cy.intercept("/api/auth/session", { fixture: "session.json" }).as("session");

	// Set the cookie for cypress.
	// It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
	// This cookie also may need to be refreshed intermittently 
	cy.setCookie("next-auth.session-token", Cypress.env('TEST_SESSION_COOKIE'));
  })
})