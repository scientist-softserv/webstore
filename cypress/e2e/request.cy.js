import useOneRequestResponseBody from '../fixtures/one-request/request.json'

describe('Viewing one request', () => {
  // currently this is using a real request ID, since the routes are generated dynamically, so far i haven't found a way to generate a route for a fake request within the test
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
          loading = false
          request = true
          proposals = true
          messages = true
          files = true
        })
        it("should show the request stats section.", () => {
        console.log({loading, request, proposals, messages, files, error})
          // cy.get('div.request-stats-card').should('exist').then(() => {
          //   cy.log('Request stats section renders successfully.')
          // })
        })
        // it("should show the status bar.", () => {
        //   cy.get("div[data-cy='status-bar']").should('exist').then(() => {
        //     cy.log('Status bar renders successfully.')
        //   })
        // })
      })

      // context('the user has 0 requests', () => {
      //   before(() => {
      //     requestList = false
      //   })
      //   it("should show a message notifying the user they don't have any requests.", () => {
      //     cy.get('p.no-requests').contains('You do not have any requests yet.').then(() => {
      //       cy.log('Successfully viewing request page with no requests.')
      //     })
      //   })
      // })

      // context('the user can see the <LinkedButton /> component', () => {
      //   [true, false].forEach((value) => {
      //     before(() => {
      //       requestList = value
      //     })
      //     it(`should show a button that links to the initialize request page for the default ware ${value ? 'with a request list' : 'with 0 requests'}.`, () => {
      //       cy.get("a[data-cy='linked-button']").should('have.attr', 'href', `/requests/new/make-a-request?id=123`).then(() => {
      //         cy.log('The <LinkedButton /> component displays correctly')
      //       })
      //     })
      //   })
      // })
    })
  })
})


    // it('renders the request page with the appropriate components', () => {
    //   let requestPath = useOneRequestResponseBody.request.href.pathname
    //   //let scientistApiBaseURL = `https://${Cypress.env('NEXT_PUBLIC_PROVIDER_NAME')}.scientist.com/api/${Cypress.env('NEXT_PUBLIC_SCIENTIST_API_VERSION')}`
    //   cy.intercept('GET', `${scientistApiBaseURL}/quote_groups/*`, { fixture: 'one-request/request.json' }).as('useOneRequest')
    //   //cy.wait(['@useOneRequest'])
    //   cy.visit(requestPath)
    //   cy.get('h1').should('contains.text', useOneRequestResponseBody.request.title)
    //   })
