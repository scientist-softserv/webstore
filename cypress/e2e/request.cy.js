import {
  requestUuid as uuid,
  requestPageApiCalls as apiCalls,
} from '../support/e2e'

describe('Viewing one request', () => {
  // Existing ticket to complete this test: https://github.com/scientist-softserv/webstore/issues/218

  describe('as a logged out user', () => {
    it('should show an error message.', () => {
      cy.visit(`/requests/${uuid}`)
      cy.get('div.alert-heading').contains('Unauthorized').then(() => {
        cy.log('A logged out user is not able to view a single request.')
      })
    })
  })

  describe('as a logged in user', () => {
    beforeEach(() => {
      cy.login(Cypress.env('TEST_SCIENTIST_USER'), Cypress.env('TEST_SCIENTIST_PW'))

      apiCalls.forEach((item) => {
        const key = Object.keys(item)[0]
        cy.customApiIntercept(item[key])
      })

      cy.visit(`/requests/${uuid}`)
    })

    describe('makes a call to the api', () => {
      context('which when given an invalid uuid', () => {
        before(() => {
          apiCalls['useOneRequest'] = {
            ...apiCalls['useOneRequest'],
            error: {
              body: {
                message: 'Quote Group Not Found',
              },
              statusCode: 404,
            },
            requestURL: '/quote_groups/fake-uuid.json'
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
          apiCalls.forEach((item) => {
            const key = Object.keys(item)[0]

            item[key].data = undefined
            item[key].error = undefined
          })
        })

        it('shows a loading spinner.', () => {
          cy.get("[aria-label='tail-spin-loading']").should('be.visible').then(() => {
            cy.log('Loading spinner displays correctly.')
          })
        })
      })

      describe('which when returns request data', () => {
        it.only('shows the request stats section', () => {
          cy.get('div.request-stats-card').should('exist').then(() => {
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
            cy.customApiIntercept({
              action: 'GET',
              alias: 'useAllMessages',
              requestURL: `/quote_groups/${uuid}/messages.json`,
              data: messages,
              dataFixture: 'one-request/messages.json',
              emptyDataFixture: 'empty.json',
              loading,
              error
            })
          })

          it('displays the messages', () => {})
        })

        context('with documents', () => {
          before(() => {
            cy.customApiIntercept({
              action: 'GET',
              alias: 'useAllSOWs',
              requestURL: `/quote_groups/${uuid}/proposals.json`,
              data: proposals,
              dataFixture: 'one-request/proposals.json',
              emptyDataFixture: 'empty.json',
              loading,
              error
            })
          })

          it('displays the documents', () => {})
        })

        context('with files', () => {
          before(() => {
            cy.customApiIntercept({
              action: 'GET',
              alias: 'useAllFiles',
              requestURL: `/quote_groups/${uuid}/notes.json`,
              data: files,
              dataFixture: 'one-request/notes.json',
              emptyDataFixture: 'empty.json',
              loading,
              error
            })
          })

          it('displays the files', () => {})
        })
      })
    })
  })
})
