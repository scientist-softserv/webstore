describe('Requests', () => {
  // need to add login
  // need to add session so its not necessary to login before each test
  // need to add seeds for the requests
  it('a signed in user can navigate to the requests page and see their requests', () => {
    // Start from the home page
    cy.visit('/')

    // Find a link with an href attribute containing "requests" and click it
    cy.get('a[href*="requests"]').click()

    // The new url should include "/about"
    cy.url().should('include', '/requests')

    // The new page should contain an h1 with "My Requests"
    cy.get('h1').contains('My Requests')
  })

  it('a signed in user can navigate to the requests page and see that they have no requests', () => {
    // Start from the home page
    cy.visit('/')

    // Find a link with an href attribute containing "requests" and click it
    cy.get('a[href*="requests"]').click()

    // The new url should include "/about"
    cy.url().should('include', '/requests')

    // The new page should contain an h1 with "My Requests"
    cy.get('h1').contains('My Requests')
  })

  it('a signed in user can navigate to the requests page and see their requests', () => {
    // Start from the home page
    cy.visit('/')

    // Find a link with an href attribute containing "requests" and click it
    cy.get('a[href*="requests"]').click()

    // The new url should include "/about"
    cy.url().should('include', '/requests')

    // The new page should contain an h1 with "My Requests"
    cy.get('h1').contains('My Requests')
  })
})

// a signed in user sees their requests, if they have any
// a signed in user sees the correct "no requests" response if they don't have any requests
// a signed out user is asked to sign in