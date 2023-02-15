describe('Browsing', () => {
  it('a user can search from the home page and be directed to "/browse" with a blank query', () => {
    // Start from the home/index page
    cy.visit('/')

    // Find the search button and perform an empty search, which should lead to the browse page
    cy.get('button.search-button').click()

    // The new url should include "/browse"
    cy.url().should('include', '/browse')

    // The search bar on the browse page should remain blank
    cy.get('input.search-bar').should('have.value', '')
  })
})