import useSWR from 'swr'
import {
  configureDocuments,
  configureMessages,
  configureRequests,
} from './configurations'
import { fetcher, posting } from './base'

export const useAllRequests = () => {
  const { data, error } = useSWR(`/quote_groups/mine.json`, fetcher)
  const requests = data && configureRequests({ data: data.quote_group_refs, path: '/requests' })

  return {
    requests,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useOneRequest = (id) => {
  const { data, error } = useSWR(`/quote_groups/${id}.json`, fetcher)
  let request = data && configureRequests({ data, path: '/requests' })[0]
  if (request) {
    request = {
      ...request,
      createdAt: request.createdAt.slice(0, 12),
      proposedDeadline: request.proposedDeadline.slice(0, 12),
    }
  }

  return {
    request,
    isLoadingRequest: !error && !data,
    isRequestError: error,
  }
}

export const useAllSOWs = (id, requestIdentifier) => {
  const { data, error } = useSWR(`/quote_groups/${id}/proposals.json`, fetcher)
  let allSOWs
  if (data) {
    allSOWs = configureDocuments(data, requestIdentifier)
  }

  return {
    allSOWs,
    isLoadingSOWs: !error && !data,
    isSOWError: error,
  }
}

export const useAllMessages = (id) => {
  const { data, error } = useSWR(`/quote_groups/${id}/notes.json`, fetcher)
  let messages
  if (data) messages = configureMessages(data.notes)

  return {
    messages,
    isLoadingMessages: !error && !data,
    isMessageError: error,
  }
}

export const sendMessage = ({ id, message, files }) => {
  const note = {
    body: message,
    quoted_ware_ids: [id],
    data_files: files,
  }

  posting(`/quote_groups/${id}/notes.json`, note)
}

export const createRequest = (requestForm) => {
  console.log(requestForm, 'requests file')
  const form = {
    // quote_group_params function- these are all the params that the request is expecting
    // https://github.com/assaydepot/scientist_api_v2/issues/160#issuecomment-1297058995
    // :name,
    // :ware_id,
    // :data_str,
    // :user_id,
    // :description,
    // :private_note_body,
    // :proposed_deadline_str,
    // :no_proposed_deadline,
    // :site,
    // :promo_code_str,
    // :project_code,
    // dynamic_forms_to_embed: %i[id order_priority],
    // temp_attachment_ids: [],
    // shipping_address_attributes: %i[
    //   run_validation
    //   site_type
    //   organization_name
    //   site_name
    //   person_name
    //   attention
    //   street
    //   street2
    //   city
    //   state
    //   zipcode
    //   country
    // ],
    // billing_address_attributes: %i[
    //   run_validation
    //   site_type
    //   organization_name
    //   site_name
    //   person_name
    //   attention
    //   street
    //   street2
    //   city
    //   state
    //   zipcode
    //   country
    //   legal_entity_id
    // ]
  }
  // Ron's comment says this should use the following endpoint. But, how would be know the ware-id here? Is the request not for a new ware? Or is it generated?
  // /wares/:ware-id/quote_groups.json
  posting('/wares.json', form)
}