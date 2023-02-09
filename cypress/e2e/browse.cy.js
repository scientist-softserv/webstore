describe('Browse', () => {
  it('should be able to reach the browse page from the homepage search bar', () => {
    // Start from the home/index page
    cy.visit('/')

    // Find the search button and perform an empty search, which should lead to the browse page
    cy.get('button.search-button').click()

    // The new url should include "/browse"
    cy.url().should('include', '/browse')
  })
})

//