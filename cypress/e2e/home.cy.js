describe('Viewing Home page', () => {
  // declare variables that can be used to change how the response is intercepted.
  let loading
  let error
  let featuredServices

  beforeEach(() => {
    // Intercept the response from the endpoint to view all requests
    cy.customApiIntercept({
      action: 'GET',
      alias: 'useAllWares',
      requestURL: `/providers/${Cypress.env('NEXT_PUBLIC_PROVIDER_ID')}/wares.json`,
      data: featuredServices,
      defaultFixture: 'services/wares.json',
      emptyFixture: 'services/no-wares.json',
      loading,
      error
    })
    cy.visit('/')
  })


  context('featured services list is loading', () => {
    before(() => {
      loading = true
    })
    it('should show 3 placeholder cards loading', () => {
      cy.get('p.placeholder-glow').should('be.visible').then(() => {
        cy.log('Loading text displays correctly.')
      })
    })
  })

  context('error while making a request to the api', () => {
    before(() => {
      loading = false
      error = true
    })
    it('should show an error message.', () => {
      cy.get("div[role='alert']").should('be.visible').then(() => {
        cy.log('Successfully hits an error.')
      })
    })
  })

  context('home page components are loading successfully, &', () => {
    before(() => {
      featuredServices = true
      error = false
    })
    it('should show the search bar.', () => {
      cy.get("form[data-cy='search-bar']").should('exist').then(() => {
        cy.log('Search bar renders successfully.')
      })
    })
    it('should show the about text.', () => {
      cy.get("section[data-cy='about-us-section']").should('exist').then(() => {
        cy.log('Abouttext renders successfully.')
      })
    })
    it('should show the featured services cards.', () => {
      cy.get("div[data-cy='item-group']").should('exist').then(() => {
        cy.log('Status bar renders successfully.')
      })
    })
  })

  // TODO(alishaevn): check these tests when working on this file
  context('a search is completed successfully and', () => {
    it('navigates to "/browse" with a blank query', () => {
      cy.get('button.search-button').click()
      cy.url().should('include', '/browse')
      cy.url().should('not.include', '?')
      cy.get('input.search-bar').should('have.value', '')
      cy.get(".card[data-cy='item-card']").should('be.visible')
    })

    it('navigates to "/browse" with a query term', () => {
      cy.get('input.search-bar').type('test')
      cy.get('button.search-button').click()
      cy.url().should('include', '/browse?q=test')
      cy.get('input.search-bar').should('have.value', 'test')
      cy.get(".card[data-cy='item-card']").should('be.visible')
    })
  })
})
