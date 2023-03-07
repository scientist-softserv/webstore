import useOneRequestResponseBody from '../fixtures/one-request/request.json'

describe.skip('Viewing one request', () => {
  // TODO: currently this uses a real request uuid, which would allow it to visit a route that actually existed.
  // since the routes are generated dynamically, we will need to mock the next router in order to generate a route for a fake request w/ mock uuid within the test
  // this test should remain skipped until the above is done since it runs as a regular e2e vs e2e with mocked data
  // Existing ticket to complete this test: https://github.com/scientist-softserv/webstore/issues/218
  let uuid = useOneRequestResponseBody.uuid

  describe('as a logged out user', () => {
    it('should show an error message.', () => {
      cy.visit(`/requests/${uuid}`)
      cy.get('div.alert-heading').contains('Unauthorized').then(() => {
        cy.log('A logged out user is not able to view a single request.')
      })
    })
  })

  describe('as a logged in user', () => {
    // declare variables that can be used to change how the response is intercepted.
    let request
    let proposals
    let messages
    let files
    let loading
    let error

    beforeEach(() => {
      // Call the custom cypress command to log in
      cy.login(Cypress.env('TEST_SCIENTIST_USER'), Cypress.env('TEST_SCIENTIST_PW'))
      
      // Intercept the response from the endpoint to view one request
      cy.customApiIntercept({
        action: 'GET',
        alias: 'useOneRequest',
        requestURL: `/quote_groups/${uuid}.json`,
        data: request,
        dataFixture: 'one-request/request.json',
        emptyDataFixture: 'empty.json',
        loading,
        error
      })

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
      cy.visit(`/requests/${uuid}`)
    })

    context('request is loading', () => {
      before(() => {
        loading = true
      })
      it('should show a loading spinner.', () => {
        cy.get("[aria-label='tail-spin-loading']").should('be.visible').then(() => {
          cy.log('Loading spinner displays correctly.')
        })
      })
    })

    describe('request page components are loading successfully, &', () => {
      context('the request page', () => {
        before(() => {
          loading =
          request = true
          proposals = true
          messages = true
          files = true
        })

        it("should show the request stats section.", () => {
          cy.get('div.request-stats-card').should('exist').then(() => {
            cy.log('Request stats section renders successfully.')
          })
        })

        it("should show the status bar.", () => {
          cy.get("div[data-cy='status-bar']").should('exist').then(() => {
            cy.log('Status bar renders successfully.')
          })
        })
        // TODO: add tests to confirm that messages, files, additional info, document sections all show correctly.
      })
    })
  })
})