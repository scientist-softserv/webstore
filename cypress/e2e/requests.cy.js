describe('Viewing all requests', () => {
  describe('as a logged out user', () => {
    it('should show an error message.', () => {
      // Visit a protected route in order to allow cypress to set the cookie and mock the login
      cy.visit("/requests")
      cy.get('div.alert-heading').contains('Unauthorized').then(() => {
        cy.log("A logged out user is not able to view requests.")
      })
    })
  })
  
  describe('as a logged in user', () => {
    let scientistApiBaseURL = `https://${Cypress.env('NEXT_PUBLIC_PROVIDER_NAME')}.scientist.com/api/v2`
    // declare variables that can be used to change how the response is intercepted.
    let requestList
    let loading
    let error

    beforeEach(() => {
      // Call the custom cypress command to log in
      cy.login(Cypress.env('TEST_SCIENTIST_USER'), Cypress.env('TEST_SCIENTIST_PW'))

      // Intercept the response from the endpoint to view all requests
      cy.intercept('GET', `${scientistApiBaseURL}/quote_groups/mine.json`, (req) => {
        if ((requestList === undefined) && (loading === true)) {
          // reply with an empty response: both data and error will be undefined.
          req.reply()
        } else if ((requestList === undefined) && (loading === undefined) && (error === true)) {
          // error will be defined
          req.reply({ statusCode: 404 })
        } else if (requestList === true) {
          // reply with a request body- default status code is 200
          req.reply({ fixture: 'all-requests/requests.json' })
        } else if (requestList === false) {
          req.reply({ fixture: 'all-requests/no-requests.json' })
        }
      })
      cy.visit("/requests")
    })

    context('request list is loading', () => {
      before(() => {
        loading = true
      })
      it("should show a loading spinner.", () => {
        cy.get('[aria-label="tail-spin-loading"]').should('be.visible').then(() => {
          cy.log('Loading spinner displays correctly.')
        })
      })
    })

    context('error while making a request to the api', () => {
      before(() => {
        requestList = undefined
        loading = undefined
        error = true
      })
      it("should show an error message.", () => {
        cy.get('div[role="alert"]').should('be.visible').then(() => {
          cy.log('Successfully hits an error.')
        })
      })
    })

    context('has requests', () => {
      before(() => {
        requestList = true
      })
      it("should show the user's request list.", () => {
        cy.get('article.request-item').should('exist').then(() => {
          cy.log('Successfully viewing request list.')
        })
      })
    })

    context('has 0 requests', () => {
      before(() => {
        requestList = false
      })
      it("should show a message notifying the user they don't have any requests.", () => {
        cy.get('p.no-requests').contains('You do not have any requests yet.').then(() => {
          cy.log('Successfully viewing request page with no requests.')
        })
      })
    })
  })
})