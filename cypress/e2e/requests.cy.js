describe('Viewing all requests', () => {
  it('does not show a request list if the user is logged out.', () => {
		// Visit a protected route in order to allow cypress to set the cookie and mock the login
		cy.visit("/requests")

		cy.get('div.alert-heading').contains('Unauthorized').then(() => {
			cy.log("A logged out user is not able to view requests.")
		})
	})
  
	it("shows the user's request list if they are logged in.", () => {
		// Call the custom cypress command to log in
		cy.login(Cypress.env('TEST_SCIENTIST_USER'), Cypress.env('TEST_SCIENTIST_PW'))

		// Visit a protected route in order to allow cypress to set the cookie and mock the login
		cy.visit("/requests")

		const requestListExists = cy.get('h1').contains('My Requests') || 
    cy.get('p.no-requests').contains('You do not have any requests yet.')

    requestListExists.then(() => {
			cy.log('Successfully logged in and viewing request list')
		})
	})
})