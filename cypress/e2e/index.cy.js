describe('The home page', () => {
  it('should be able to reach the browse page', () => {
    // Start from the home/index page
    cy.visit('http://localhost:3000/')

    // Find the search button and perform an empty search, which should lead to the browse page
    cy.get('button.search-button').click()

    // The new url should include "/browse"
    cy.url().should('include', '/browse')
  })
})