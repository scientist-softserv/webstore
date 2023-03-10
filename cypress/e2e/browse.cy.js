describe('Browsing', () => {
  // will need to use the intercepts/fixtures from home page test here
  // it('completes a search from the home page and navigates to "/browse" with a blank query', () => {
  //   // Start from the home/index page
  //   cy.visit('/')

  //   // Find the search button and perform an empty search, which should lead to the browse page
  //   cy.get('button.search-button').click()

  //   // The new url should include "/browse"
  //   cy.url().should('include', '/browse')

  //   // The new url should not contain a query
  //   cy.url().should('not.include', '?')

  //   // The search bar on the browse page should remain blank
  //   cy.get('input.search-bar').should('have.value', '')
  // })

  // it('completes a search from the home page and navigates to "/browse" with a query term', () => {
  //   // Start from the home/index page
  //   cy.visit('/')

  //   // type an example search into the searchbar
  //   cy.get('input.search-bar').type('next')

  //   // Press the search button
  //   cy.get('button.search-button').click()

  //   // The new url should include "/browse"
  //   cy.url().should('include', '/browse?q=next')

  //   // The search bar on the browse page should have the text that was searched for
  //   cy.get('input.search-bar').should('have.value', 'next')
  // })

  let wares
  let loading
  let error
  let intercepts = [
    {
      alias: 'useAllWares',
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
  
  describe('from the /browse page', () => {
    beforeEach(() => {
      // Intercept the responses from the endpoint to view all requests.
      // Even though this is to the same endpoint, the call happens on the page twice, 
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
      cy.visit('/browse')
    })

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

    // filtering by query is handled in the api and not the webstore
    // since we are stubbing that response, our tests will not return actual filtered wares based on on test query.
    // the purpose of these tests is just to show that the correct components appear in the UI in each case.
    context('a search is completed successfully from the browse page', () => {
      before(() => {
        wares = true
        error = false
      })
      it('completes a search with a blank query', () => {
        // Find the search button and perform an empty search, which should lead to the browse page
        cy.get('button.search-button').click()
        // The new url should include "/browse"
        cy.url().should('include', '/browse')
        // The new url should not contain a query
        cy.url().should('not.include', '?')
        // The search bar on the browse page should remain blank
        cy.get('input.search-bar').should('have.value', '')
        // The service card component should be visible
        cy.get(".card[data-cy='item-card']").should('be.visible')
      })

      before(() => {
        wares = true
      })
      it('completes a search with a query term', () => {
        // Type an example search into the searchbar
        cy.get('input.search-bar').type('test')
        // Press the search button
        cy.get('button.search-button').click()
        // The new url should include "/browse" as well as the query
        cy.url().should('include', '/browse?q=test')
        // The search bar on the browse page should have the text that was searched for
        cy.get('input.search-bar').should('have.value', 'test')
        // The service card component should be visible
        cy.get(".card[data-cy='item-card']").should('be.visible')
      })

      before(() => {
        wares = false
      })
      it('completes a search with a query term, but has no results', () => {
        // type an example search into the searchbar
        cy.get('input.search-bar').type('asdfghjk')
        // Press the search button
        cy.get('button.search-button').click()
        // The new url should include "/browse"
        cy.url().should('include', '/browse?q=asdfghjk')
        // The search bar on the browse page should have the text that was searched for
        cy.get('input.search-bar').should('have.value', 'asdfghjk')
        // The message showing that there are no results should show
      })
    })
  })
})