describe("Requests Page", () => {
  it("A logged out user should not able to see the requests list.", () => {
		// Visit a protected route in order to allow cypress to set the cookie and mock the login
		cy.visit("/requests")

		cy.get('div.alert-heading').contains('Unauthorized').then(() => {
			cy.log("A logged out user is not able to view requests.");
		});
	})
  
	it("A logged in user should be able to see the requests list.", () => {
		// Call the custom cypress command to log in
		cy.login(Cypress.env('TEST_SCIENTIST_USER'), Cypress.env('TEST_SCIENTIST_PW'))

		// Visit a protected route in order to allow cypress to set the cookie and mock the login
		cy.visit("/requests")

		cy.get('h1').contains('My Requests').then(() => {
			cy.log("Successfully logged in and viewing requests page");
		});
	})
});