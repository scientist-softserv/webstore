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
    let requestList

    beforeEach(() => {
      // Call the custom cypress command to log in
      cy.login(Cypress.env('TEST_SCIENTIST_USER'), Cypress.env('TEST_SCIENTIST_PW'))

      // Intercept the response from the endpoint to view all requests
      cy.intercept('GET', `${scientistApiBaseURL}/quote_groups/mine.json`, (req) => {
        if (requestList === true) {
          req.reply({fixture: 'all-requests/requests.json'})
        } else {
          req.reply({fixture: 'all-requests/no-requests.json'})
        }
      }).as('useAllRequests')
      cy.visit("/requests")
    })

    context('has requests', () => {
      before(() => {
        requestList = true
      })
      it("shows the user's request list.", () => {
        cy.get('article.request-item').should('exist').then(() => {
          cy.log('Successfully viewing request list.')
        })
      })
    })

    context('has 0 requests', () => {
      before(() => {
        requestList = false
      })
      it("shows a message notifying the user they don't have any requests.", () => {
        cy.get('p.no-requests').contains('You do not have any requests yet.').then(() => {
          cy.log('Successfully viewing request page with no requests.')
        })
      })
    })
  })
})