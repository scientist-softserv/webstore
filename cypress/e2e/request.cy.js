describe('Viewing a single request', () => {
  
  // Before each test runs: log in, visit /requests, check for noRequests or requestListExists
  beforeEach(() => {
    // Call the custom cypress command to log in
    cy.login(Cypress.env('TEST_SCIENTIST_USER'), Cypress.env('TEST_SCIENTIST_PW'))

    // Visit a protected route in order to allow cypress to set the cookie and mock the login
    cy.visit("/requests")

    // If there are no requests, log this
    const noRequests = cy.get('p.no-requests').contains('You do not have any requests yet.')

    // check that either the requests are showing, or that the user has no requests
    const requestListExists = cy.get('article.request-item').should('exist') || noRequests
  })
  
  it('allows a user to view a single request.', () => {

    // if there are requests, click the first one at the top of the list
    requestListExists.then(() => {
			cy.contains(': New Request').click()
      // after clicking a request, check to make sure it navigated to the single request page successfully
      if (cy.contains('Request Info')) {
        cy.log('Successfully viewed a single request')
      }
    })
	})

  it("allows a user to view a request's related documents", () => {

    // if there are requests, click the first one at the top of the list
    requestListExists.then(() => {
      // refactor if statement to make an exists
			cy.contains(': New Request').click()
      // after clicking a request, check to make sure it navigated to the single request page successfully
      if (cy.contains('Request Info')) {
        // if navigation to single request page is successful, then click View Files
        cy.contains('View Files').click().then()
      } else {
        cy.log('Unsuccessfully viewed a single request')
      }
    })
  })
})