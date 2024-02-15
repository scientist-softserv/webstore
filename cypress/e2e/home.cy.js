describe('Navigating to the home page', () => {
  // declare variables that can be used to change how the response is intercepted.
  let data = 'services/wares.json'
  let error

  beforeEach(() => {
    cy.customApiIntercept({
      alias: 'useAllWares',
      data,
      error,
      requestURL: '/wares.json?per_page=2000',
    })

    cy.visit('/')
  })

  describe('renders a search bar', () => {
    it('with no query', () => {
      cy.get("form[data-cy='search-bar']").should('exist').then(() => {
        cy.log('Search bar renders successfully.')
      })
    })

    context('able to navigate to "/browse"', () => {
      const testSetup = ({ data, defaultFixture, requestURL }) => {
        cy.customApiIntercept({
          alias: 'useFilteredWares',
          data,
          error,
          requestURL,
        })
      }

      it('with a blank query', () => {
        testSetup({
          data: 'services/wares.json',
          requestURL: '/wares.json?per_page=2000&q=',
        })

        cy.get('button.search-button').click()
        cy.url().should('include', '/browse')
        cy.url().should('not.include', '?')
        cy.get('input.search-bar').should('have.value', '')
        cy.get(".card[data-cy='item-card']").should('be.visible')
      })

      it('with a valid query term', () => {
        testSetup({
          data: 'services/filtered-wares.json',
          requestURL: `/wares.json?per_page=2000&q=${Cypress.env('CYPRESS_SEARCH_QUERY')}`,
        })

        cy.get('input.search-bar').type(Cypress.env('CYPRESS_SEARCH_QUERY'))
        cy.get('button.search-button').click()
        cy.url().should('include', `/browse?q=${Cypress.env('CYPRESS_SEARCH_QUERY')}`)
        cy.get('input.search-bar').should('have.value', Cypress.env('CYPRESS_SEARCH_QUERY'))
        cy.get(".card[data-cy='item-card']").should('be.visible')
      })

      it('with an invalid query term', () => {
        const invalidQuery = 'asdfghjk'
        testSetup({
          data: 'services/no-wares.json',
          requestURL: `/wares.json?per_page=2000&q=${invalidQuery}`,
        })

        cy.get('input.search-bar').type(invalidQuery)
        cy.get('button.search-button').click()
        cy.url().should('include', `/browse?q=${invalidQuery}`)
        cy.get('input.search-bar').should('have.value', invalidQuery)
        cy.get("p[data-cy='no-results']").should('contain', `Your search for ${invalidQuery} returned no results`)
      })
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
    context('which when given an invalid access token', () => {
      before(() => {
        data = undefined
        error = {
          body: {
            message: 'No access token provided.',
          },
          statusCode: 403,
        }
      })

      it('shows an error message', () => {
        cy.get("div[role='alert']").should('be.visible').then(() => {
          cy.log('Successfully hits an error.')
        })
        cy.get("div[role='alert']").contains('No access token provided.')
      })
    })

    context('which when returns no error or data', () => {
      it('shows 3 placeholder cards loading', () => {
        cy.get('p.placeholder-glow').should('have.length', 3).then(() => {
          cy.log('Loading text displays correctly.')
        })
      })
    })

    context('which when returns data', () => {
      it('shows the featured services cards', () => {
        cy.get("div[data-cy='item-group']").should('exist').then(() => {
          cy.log('Status bar renders successfully.')
        })
      })
    })
  })
})
