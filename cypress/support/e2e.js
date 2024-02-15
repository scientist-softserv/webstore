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
const quotedWareId = 728152
export const requestUuid = '596127b7-2356-45aa-aec4-a4f8608ae755'
export const requestPageApiCalls = {
  'useOneRequest': {
    alias: 'useOneRequest',
    data: 'one-request/request.json',
    error,
    requestURL: `/quote_groups/${requestUuid}.json`,
  },
  'useAllSOWs': {
    alias: 'useAllSOWs',
    data: 'one-request/sows/default.js',
    error,
    requestURL: `/quote_groups/${requestUuid}/proposals.json`
  },
  'useMessages': {
    alias: 'useMessages',
    data: 'one-request/messages/default.json',
    error,
    requestURL: `/quote_groups/${requestUuid}/messages.json`
  },
  'useFiles': {
    alias: 'useFiles',
    data: 'one-request/files/default.json',
    error,
    requestURL: `/quote_groups/${requestUuid}/notes.json`,
  },
  'getAllPOs': {
    alias: 'getAllPOs',
    data: 'one-request/pos/default.json',
    error,
    requestURL: `/quote_groups/${requestUuid}/quoted_wares/${quotedWareId}/purchase_orders.json`,
  },
  'getOnePO': {
    alias: 'getOnePO',
    data: 'one-request/pos/one.json',
    error: undefined,
    requestURL: `/quote_groups/${requestUuid}/quoted_wares/${quotedWareId}/purchase_orders/168795.json`,
  }
}

