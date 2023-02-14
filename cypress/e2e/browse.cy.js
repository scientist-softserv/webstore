describe('The home page', () => {
  it('should be able to reach the browse page', () => {
    // Start from the home/index page
    cy.visit('http://localhost:3000/')

    // Find the search button and perform an empty search, which should lead to the browse page
    cy.get('button.search-button').click()

    // The new url should include "/browse"
    cy.url().should('include', '/browse')
  })

  it('should perform a search on the browse page', () => {
    // Start from the browse page
    cy.visit('/browse')

    // type an example search into the searchbar
    cy.get('input.search-bar').type('next')

    // Find the search button to enter the search
    cy.get('button.search-button').click()

    // The new url should include "/browse"
    cy.get('div.card-title').contains('Next Generation Sequencing').then(() => {
			cy.log("Successfully performed a search from the browse page");
		});
  })
})

//
