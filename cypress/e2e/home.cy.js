import { scientistApiBaseURL } from '../support/e2e'

describe('Viewing Home page', () => {
  // declare variables that can be used to change how the response is intercepted.
  let loading
  let error
  let featuredServices

  beforeEach(() => {
    // Intercept the response from the endpoint to view all requests
    cy.customApiIntercept({
      action: 'GET',
      alias: 'useAllWares',
      requestURL: `/providers/${Cypress.env('NEXT_PUBLIC_PROVIDER_ID')}/wares.json`,
      data: featuredServices,
      defaultFixture: 'services/wares.json',
      emptyFixture: 'services/no-wares.json',
      loading,
      error
    })
    cy.visit('/')
  })


  context('featured services list is loading', () => {
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
      featuredServices = undefined
      loading = false
      error = true
    })
    it('should show an error message.', () => {
      cy.get("div[role='alert']").should('be.visible').then(() => {
        cy.log('Successfully hits an error.')
      })
    })
  })
  })