describe('Browsing', () => {
  it('completes a search from the home page and navigates to "/browse" with a blank query', () => {
    // Start from the home/index page
    cy.visit('/')

    // Find the search button and perform an empty search, which should lead to the browse page
    cy.get('button.search-button').click()

    // The new url should include "/browse"
    cy.url().should('include', '/browse')

    // The new url should not contain a query
    cy.url().should('not.include', '?')

    // The search bar on the browse page should remain blank
    cy.get('input.search-bar').should('have.value', '')
  })

  it('completes a search from the home page and navigates to "/browse" with a query term', () => {
    // Start from the home/index page
    cy.visit('/')

    // type an example search into the searchbar
    cy.get('input.search-bar').type('next')

    // Press the search button
    cy.get('button.search-button').click()

    // The new url should include "/browse"
    cy.url().should('include', '/browse?=next')

    // The search bar on the browse page should have the text that was searched for
    cy.get('input.search-bar').should('have.value', 'next')
  })
})