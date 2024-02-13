// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

export const scientistApiBaseURL = `https://${Cypress.env('NEXT_PUBLIC_PROVIDER_NAME')}.scientist.com/api/v2`

let error
export const requestUuid = '596127b7-2356-45aa-aec4-a4f8608ae755'
export const requestPageApiCalls = [
  {
    'useOneRequest': {
      alias: 'useOneRequest',
      data: 'one-request/request.json',
      error,
      requestURL: `/quote_groups/${requestUuid}.json`,
    }
  },
  {
    'useAllMessages': {
      alias: 'useAllMessages',
      data: { messages: [] },
      error,
      requestURL: `/quote_groups/${requestUuid}/messages.json`
    },
  },
  {
    'useAllSOWs': {
      alias: 'useAllSOWs',
      data: [],
      error,
      requestURL: `/quote_groups/${requestUuid}/proposals.json`
    }
  },
  {
    'useAllFiles': {
      alias: 'useAllFiles',
      data: { notes: [] },
      error,
      requestURL: `/quote_groups/${requestUuid}/notes.json}`,
    }
  },
  {
    'getAllPOs': {
      alias: 'getAllPOs',
      data: [],
      error,
      requestURL: `/quote_groups/${requestUuid}/quoted_wares/8AE755/purchase_orders.json}`,
    }
  }
]
