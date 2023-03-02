import { scientistApiBaseURL } from '../support/e2e'

describe('Viewing all requests', () => {
  describe('as a logged out user', () => {
    it('should show an error message.', () => {
      // Visit a protected route in order to allow cypress to set the cookie and mock the login
      cy.visit('/requests')
      cy.get('div.alert-heading').contains('Unauthorized').then(() => {
        cy.log('A logged out user is not able to view requests.')
      })
    })
  })
  
  describe('as a logged in user', () => {
    // declare variables that can be used to change how the response is intercepted.
    let requestList
    let loading
    let error

    beforeEach(() => {
      // Call the custom cypress command to log in
      cy.login(Cypress.env('TEST_SCIENTIST_USER'), Cypress.env('TEST_SCIENTIST_PW'))
      // Intercept the response from the endpoint to view all requests
      cy.customApiIntercept({
        action: 'GET',
        alias: 'useAllRequests',
        requestURL: `/quote_groups/mine.json`,
        data: requestList,
        defaultFixture: 'all-requests/requests.json',
        emptyFixture: 'all-requests/no-requests.json',
        loading,
        error
      })
      // Intercept the response from the endpoint that gets the default ware ID
      cy.customApiIntercept({
        action: 'GET',
        alias: 'useDefaultWare',
        requestURL: `/wares.json?q=make-a-request`,
        defaultFixture: 'all-requests/make-a-request.json',
        error
      })
      cy.visit('/requests')
    })


    context('request list is loading', () => {
      before(() => {
        loading = true
      })
      it('should show a loading spinner.', () => {
        cy.get("[aria-label='tail-spin-loading']").should('be.visible').then(() => {
          cy.log('Loading spinner displays correctly.')
        })
      })
    })

    context('error while making a request to the api', () => {
      before(() => {
        requestList = undefined
        loading = false
        error = true
      })
      it('should show an error message.', () => {
        cy.get("div[role='alert']").should('be.visible').then(() => {
          cy.log('Successfully hits an error.')
        })
      })
    })

    describe('request components are loading successfully, &', () => {
      context('the user has requests', () => {
        before(() => {
          requestList = true
          error = false
        })
        it("should show the user's request list.", () => {
          cy.get('article.request-item').should('exist').then(() => {
            cy.log('Successfully viewing request list.')
          })
        })
      })

      context('the user has 0 requests', () => {
        before(() => {
          requestList = false
        })
        it("should show a message notifying the user they don't have any requests.", () => {
          cy.get('p.no-requests').contains('You do not have any requests yet.').then(() => {
            cy.log('Successfully viewing request page with no requests.')
          })
        })
      })

      context('the user can see the <LinkedButton /> component', () => {
        [true, false].forEach((value) => {
          before(() => {
            requestList = value
          })
          it(`should show a button that links to the initialize request page for the default ware ${value ? 'with a request list' : 'with 0 requests'}.`, () => {
            cy.get("a[data-cy='linked-button']").should('have.attr', 'href', `/requests/new/make-a-request?id=123`).then(() => {
              cy.log('The <LinkedButton /> component displays correctly')
            })
          })
        })
      })
    })
  })
})