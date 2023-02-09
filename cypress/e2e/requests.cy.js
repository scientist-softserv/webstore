describe("Requests Page", () => {
	it("A logged in user should be able to see the requests list.", () => {
		// Call the custom cypress command to log in
		cy.login(Cypress.env('SCIENTIST_USER'), Cypress.env('SCIENTIST_PW'))

		// Visit a protected route in order to allow cypress to set the cookie and mock the login
		cy.visit("/requests")

		cy.get('h1').contains('My Requests').then(() => {
			cy.log("Test login successful");
		});
	});
});