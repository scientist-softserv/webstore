import {
  requestUuid as uuid,
  requestPageApiCalls,
} from '../support/e2e'

describe('Viewing one request', () => {
  describe('as a logged out user', () => {
    it('should show an error message.', () => {
      cy.visit(`/requests/${uuid}`)
      cy.get('div.alert-heading').contains('Unauthorized').then(() => {
        cy.log('A logged out user is not able to view a single request.')
      })
    })
  })

  describe('as a logged in user', () => {
    let apiCalls = Object.assign({}, requestPageApiCalls)

    beforeEach(() => {
      cy.login(Cypress.env('TEST_SCIENTIST_USER'), Cypress.env('TEST_SCIENTIST_PW'))

      Object.entries(apiCalls).forEach((item) => {
        cy.customApiIntercept(item[1])
      })
      cy.visit(`/requests/${uuid}`)
    })

    afterEach(() => {
      // in order for the tests to not be order dependent, we need to reset the apiCalls object to the original state
      apiCalls = Object.assign({}, requestPageApiCalls)
    })

    describe('makes a call to the api', () => {
      context('which when given an invalid uuid', () => {
        before(() => {
          apiCalls['useOneRequest'] = {
            ...apiCalls['useOneRequest'],
            data: undefined,
            error: {
              body: {
                message: 'Quote Group Not Found',
              },
              statusCode: 404,
            },
          }
        })

        it('returns an error message', () => {
          cy.get("div[role='alert']").should('be.visible').then(() => {
            cy.log('Successfully hits an error.')
          })
          cy.get("div[role='alert']").contains('Quote Group Not Found')
        })
      })

      context('which when returns undefined error and data values', () => {
        before(() => {
          Object.entries(apiCalls).forEach(([key, value]) => {
            apiCalls[key] = {
              ...value,
              data: undefined,
              error: undefined,
            }
          })
        })

        it('shows a loading spinner.', () => {
          cy.get("[aria-label='tail-spin-loading']").should('be.visible').then(() => {
            cy.log('Loading spinner displays correctly.')
          })
        })
      })

      describe('which when returns request data', () => {
        it('shows the request stats section', () => {
          cy.get('div.request-stats.card').should('exist').then(() => {
            cy.log('Request stats section renders successfully.')
          })
        })

        it('shows the status bar', () => {
          cy.get("div[data-cy='status-bar']").should('exist').then(() => {
            cy.log('Status bar renders successfully.')
          })
        })

        context('with messages', () => {
          before(() => {
            apiCalls['useMessages'] = {
              ...apiCalls['useMessages'],
              data: 'one-request/messages/index.json',
            }
          })

          it('displays the messages', () => {
            cy.get('div.card-body p.card-text')
              .contains('this is a message from the customer')
              .should('be.visible')
          })
        })

        context('with documents', () => {
          before(() => {
            apiCalls['useAllSOWs'] = {
              ...apiCalls['useAllSOWs'],
              data: 'one-request/sows/index.json',
            }
            apiCalls['getAllPOs'] = {
              ...apiCalls['getAllPOs'],
              data: 'one-request/pos/index.json',
            }
          })

          it('displays the documents', () => {
            cy.get('div.document').should('have.length', 2)
            cy.get('div.badge').contains('SOW').should('be.visible')
            cy.get('div.badge').contains('PO').should('be.visible')
          })
        })

        context('with files', () => {
          before(() => {
            apiCalls['useFiles'] = {
              ...apiCalls['useFiles'],
              data: 'one-request/files/index.json',
            }
          })

          it('displays the files', () => {
            cy.get('div.actions-group')
              .contains('View Files')
              .click()
            cy.get('div#document-tabs-tabpane-files')
              .contains('downtown.jpg')
              .should('be.visible')
          })
        })
      })
    })
  })
})
