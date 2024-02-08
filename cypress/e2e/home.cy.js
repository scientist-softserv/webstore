describe('Navigating to the home page', () => {
  // declare variables that can be used to change how the response is intercepted.
  let loading
  let error
  let featuredServices

  beforeEach(() => {
    cy.customApiIntercept({
      action: 'GET',
      alias: 'useAllWares',
      requestURL: `/wares.json?per_page=${Cypress.env('API_PER_PAGE')}`,
      data: featuredServices,
      defaultFixture: 'services/wares.json',
      emptyFixture: 'services/no-wares.json',
      loading,
      error
    })
    cy.visit('/')
  })

  describe('renders a search bar', () => {
    it('with no query', () => {
      cy.get("form[data-cy='search-bar']").should('exist').then(() => {
        cy.log('Search bar renders successfully.')
      })
    })

    it('able to navigate to "/browse" with a blank query', () => {
      cy.get('button.search-button').click()
      cy.url().should('include', '/browse')
      cy.url().should('not.include', '?')
      cy.get('input.search-bar').should('have.value', '')
      cy.get(".card[data-cy='item-card']").should('be.visible')
    })

    it('able to navigate to "/browse" with a valid query term', () => {
      cy.get('input.search-bar').type(Cypress.env('CYPRESS_SEARCH_QUERY'))
      cy.get('button.search-button').click()
      cy.url().should('include', `/browse?q=${Cypress.env('CYPRESS_SEARCH_QUERY')}`)
      cy.get('input.search-bar').should('have.value', Cypress.env('CYPRESS_SEARCH_QUERY'))
      cy.get(".card[data-cy='item-card']").should('be.visible')
    })

    it('able to navigate to "/browse" with an invalid query term', () => {
      cy.get('input.search-bar').type('test')
      cy.get('button.search-button').click()
      cy.url().should('include', '/browse?q=test')
      cy.get('input.search-bar').should('have.value', 'test')
      cy.get(".card[data-cy='item-card']").should('be.visible')
    })
  })

  describe('renders a text box', () => {
    it('showing the about text.', () => {
      cy.get("section[data-cy='about-us-section']").should('exist').then(() => {
        cy.log('Abouttext renders successfully.')
      })
    })
  })

  describe('makes a call to the api', () => {
    context('which when returns an error', () => {
      before(() => {
        loading = false
        error = true
      })

      it('shows an error message', () => {
        // why would we get an error?
        cy.get("div[role='alert']").should('be.visible').then(() => {
          cy.log('Successfully hits an error.')
        })
      })
    })

    context('which when returns no error or data', () => {
      before(() => loading = true)

      it('shows 3 placeholder cards loading', () => {
        cy.get('p.placeholder-glow').should('have.length', 3).then(() => {
          cy.log('Loading text displays correctly.')
        })
      })
    })

    context('which when returns data', () => {
      before(() => {
        featuredServices = true
        error = false
      })

      it('shows the featured services cards', () => {
        cy.get("div[data-cy='item-group']").should('exist').then(() => {
          cy.log('Status bar renders successfully.')
        })
      })
    })
  })
})
