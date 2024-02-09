/**
 * In order to ensure that any changes against the API do not negatively
 * affect the critical path of browsing all services and creating a request,
 * we will not stub the API calls for the browse page.
 */

describe('Navigating to the browse page', () => {
  beforeEach(() => {
    cy.visit('/browse')
  })

  context('while content is loading', () => {
    it('should show loading components.', () => {
      cy.get(".card-body[data-cy='item-loading']").should('be.visible').then(() => {
        cy.log('Loading components display correctly.')
      })
    })
  })

  context('and conducting a search', () => {
    it('with no query, returns all services', () => {
      cy.get('button.search-button').click()
      cy.url().should('include', '/browse')
      cy.url().should('not.include', '?')
      cy.get('input.search-bar').should('have.value', '')
      cy.get(".card[data-cy='item-card']").should('be.visible')
    })

    it('with a valid query, returns matching services', () => {
      cy.get('input.search-bar').type(Cypress.env('CYPRESS_SEARCH_QUERY'))
      cy.get('button.search-button').click()
      cy.url().should('include', `/browse?q=${Cypress.env('CYPRESS_SEARCH_QUERY')}`)
      cy.get('input.search-bar').should('have.value', Cypress.env('CYPRESS_SEARCH_QUERY'))
      cy.get(".card[data-cy='item-card']").should('be.visible')
    })

    it('with an invalid query, returns no services', () => {
      cy.get('input.search-bar').type('asdfghjk')
      cy.get('button.search-button').click()
      cy.url().should('include', '/browse?q=asdfghjk')
      cy.get('input.search-bar').should('have.value', 'asdfghjk')
      cy.get("p[data-cy='no-results']").should('contain', 'Your search for asdfghjk returned no results')
    })
  })

  context('and creating a new request', () => {
    beforeEach(() => {
      cy.get('[data-cy="linked-button"]', { timeout: 25000 }).then(($buttons) => {
        // there may potentially be hundreds of services on a page. to avoid
        // a timeout, we will only choose from 10 services. this still ensures
        // that a variety of dynamic forms are tested
        const randomIndex = Math.floor(Math.random() * 10)
        cy.wrap($buttons.eq(randomIndex)).click()
      })
    })

    context('as a logged in user', () => {
      before(() => {
        cy.login(Cypress.env('TEST_SCIENTIST_USER'), Cypress.env('TEST_SCIENTIST_PW'))
      })

      it('shows a valid request form.', () => {
        cy.get("div[role='alert']").should('not.exist')
        cy.get('form.rjsf').should('be.visible')
        cy.scrollTo('bottom')
        cy.get('button.btn-primary', { timeout: 10000 }).should('be.enabled')
      })
    })

    context('as a logged out user', () => {
      it('shows a disabled request form, with an error message.', () => {
        cy.get("div[role='alert']").should('be.visible').then(() => {
          cy.log('Successfully hits an error.')
        })
        cy.get('div.alert-heading').should('have.text', 'Sign in required')
        cy.get('form.rjsf').should('be.visible')
        cy.scrollTo('bottom')
        cy.get('button.btn-primary').should('be.disabled')
      })
    })
  })
})
