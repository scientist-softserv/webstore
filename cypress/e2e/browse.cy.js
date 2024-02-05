import waresFixture from '../fixtures/services/wares.json'

describe('Browsing', () => {
  let wares
  let loading
  let error
  let intercepts = [
    {
      alias: 'useFilteredWares',
    },
    {
      alias: 'useFilteredWares - blank search',
    },
    {
      alias: 'useFilteredWares - with results',
      query: 'test',
    },
    {
      alias: 'useFilteredWares - no results',
      query: 'asdfghjk',
      emptyFixture: 'services/no-wares.json',
    },
  ]

  beforeEach(() => {
    // Intercept the responses from the endpoint to view all requests.
    // Even though this is to the same endpoint, the call happens on each page twice,
    // once when the page loads with all the wares, and again after any search is performed.
    // this makes it necessary to create an intercept for each time the call is made.
    intercepts.forEach((intercept) => {
      cy.customApiIntercept({
        action: 'GET',
        alias: intercept.alias,
        requestURL: `/providers/${Cypress.env('NEXT_PUBLIC_PROVIDER_ID')}/wares.json?q=${intercept.query || ''}`,
        data: wares,
        defaultFixture: 'services/wares.json',
        emptyFixture: intercept.emptyFixture || '',
        loading,
        error
      })
    })
  })

  describe('from the browse page', () => {
    context('browse page is loading', () => {
      before(() => {
        loading = true
      })
      it('should show loading components.', () => {
        cy.get(".card-body[data-cy='item-loading']").should('be.visible').then(() => {
          cy.log('Loading components display correctly.')
        })
      })
    })

    // filtering by query is handled in the api and not the webstore
    // since we are stubbing that response, our tests will not return actual filtered wares based on on test query.
    // the purpose of these tests is just to show that the correct components appear in the UI in each case.
    context('a search is completed successfully and', () => {
      before(() => {
        wares = true
        error = false
      })
      it('has a blank query', () => {
        cy.get('button.search-button').click()
        cy.url().should('include', '/browse')
        cy.url().should('not.include', '?')
        cy.get('input.search-bar').should('have.value', '')
        cy.get(".card[data-cy='item-card']").should('be.visible')
      })

      it('has a query term', () => {
        cy.get('input.search-bar').type('test')
        cy.get('button.search-button').click()
        cy.url().should('include', '/browse?q=test')
        cy.get('input.search-bar').should('have.value', 'test')
        cy.get(".card[data-cy='item-card']").should('be.visible')
      })

      before(() => {
        wares = false
      })
      it('has a query term, but that term has no results', () => {
        cy.get('input.search-bar').type('asdfghjk')
        cy.get('button.search-button').click()
        cy.url().should('include', '/browse?q=asdfghjk')
        cy.get('input.search-bar').should('have.value', 'asdfghjk')
        cy.get("p[data-cy='no-results']").should('contain', 'Your search for asdfghjk returned no results')
      })
    })

    context('while creating a new request', () => {
      beforeEach(() => {
        const ware = waresFixture['ware_refs'][0]
        cy.visit(`/requests/new/${ware.slug}?id=${ware.id}`)
      })

      context('as a logged in user', () => {
        before(() => {
          // TODO(alishaevn): log in a user
        })

        it('shows a valid request form.', () => {
          // TODO(alishaevn): write this spec (no error found)
        })
      })

      context('as a logged out user', () => {
        before(() => {
          loading = false
          error = true
        })

        it.only('shows a disabled request form, with an error message.', () => {
          // TODO(alishaevn): why is the page loading instead of rendering?
          cy.get("div[role='alert']").should('be.visible').then(() => {
            cy.log('Successfully hits an error.')
          })
        })
      })
    })
  })

  describe('from the home page', () => {
    beforeEach(() => {
      wares = true
      // Intercept the api call being made on the homepage
      cy.customApiIntercept({
        action: 'GET',
        alias: 'useAllWares',
        requestURL: `/providers/${Cypress.env('NEXT_PUBLIC_PROVIDER_ID')}/wares.json`,
        data: wares,
        defaultFixture: 'services/wares.json',
        loading,
        error
      })
      cy.visit('/')
    })

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
})
