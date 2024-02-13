describe('Viewing all requests', () => {
  describe('as a logged out user', () => {
    it('shows an error message.', () => {
      cy.visit('/requests')
      cy.get('div.alert-heading').contains('Unauthorized').then(() => {
        cy.log('A logged out user is not able to view requests.')
      })
    })
  })

  describe('as a logged in user', () => {
    // declare variables that can be used to change how the response is intercepted.
    let data
    let error

    beforeEach(() => {
      cy.login(Cypress.env('TEST_SCIENTIST_USER'), Cypress.env('TEST_SCIENTIST_PW'))
    })

    describe('makes a call to the api', () => {
      beforeEach(() => {
        cy.customApiIntercept({
          alias: 'useAllRequests',
          data,
          error,
          requestURL: `/quote_groups/mine.json`,
        })

        cy.visit('/requests')
      })

      context('which when given an invalid access token', () => {
        before(() => {
          error = {
            body: {
              message: 'No access token provided.',
            },
            statusCode: 403,
          }
        })

        it('shows an error message.', () => {
          cy.get("div[role='alert']").should('be.visible').then(() => {
            cy.log('Successfully hits an error.')
          })
          cy.get("div[role='alert']").contains('No access token provided.')
        })
      })

      context('which when returns undefined error and data values', () => {
        it('shows a loading spinner.', () => {
          cy.get("[aria-label='tail-spin-loading']").should('be.visible').then(() => {
            cy.log('Loading spinner displays correctly.')
          })
        })
      })

      describe('which when returns a data object', () => {
        before(() => {
          data = 'all-requests/requests.json'
          cy.customApiIntercept({
            alias: 'useDefaultWare',
            data: 'all-requests/make-a-request.json',
            error,
            requestURL: '/wares.json',
          })
        })

        it('renders the "New Request" button for the default service', () => {
          cy.get("a[data-cy='linked-button']")
            .should('have.attr', 'href', `/requests/new/make-a-request?id=123`)
            .and('have.text', 'Initiate a New Request')
            .then(() => {
              cy.log('The <LinkedButton /> component displays correctly')
            })
        })

        context('with values', () => {
          it("shows the user's request list.", () => {
            cy.get('article.request-item')
              .should('exist')
              .and('have.length', 3)
              .then(() => {
                cy.log('Successfully viewing request list.')
            })
          })
        })

        context('with no values', () => {
          before(() => {
            data = 'all-requests/no-requests.json'
          })

          it("shows a message notifying the user they don't have any requests.", () => {
            cy.get('p.no-requests').contains('You do not have any requests yet.').then(() => {
              cy.log('Successfully viewing request page with no requests.')
            })
          })
        })
      })
    })
  })
})
