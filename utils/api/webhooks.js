import { fetcher, updating } from './base'
import { WEBHOOK_EVENTS } from '../constants'

export const getWebhookConfig = async (accessToken) => {
  // TODO(alishaevn): update the url to "webhook_config/user.json" when
  // https://github.com/assaydepot/scientist_api_v2/pull/237 is available on api prod
  const url = () => accessToken ? '/webhook_config.json' : null
  return fetcher(url(), accessToken)
}

export const createWebhookConfig = (accessToken) => {
  /* eslint-disable camelcase */
  const webhook_config = {
    'name': 'Webstore',
    'url': `${process.env.NEXT_PUBLIC_WEBHOOK_URL}`,
    'active': true,
    'params': {
      'base_url': `${process.env.NEXT_PUBLIC_APP_BASE_URL}`
    },
    'all_events': true,
    // TODO(alishaevn): attempt to use the below again when https://github.com/assaydepot/scientist_api_v2/pull/248
    // is available on api prod
    // 'all_events': false,
    // 'events': WEBHOOK_EVENTS,
    'send_own_action_items': false,
  }

  // TODO(alishaevn): update the url to "webhook_config/user.json" when
  // https://github.com/assaydepot/scientist_api_v2/pull/237 is available on api prod
  const url = () => accessToken ? '/webhook_config.json' : null
  updating(url(), webhook_config, accessToken)
  /* eslint-enable camelcase */
}
