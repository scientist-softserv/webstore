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
    //configure form here
  }
  posting('/wares.json', form)
}

// this is the post for a ware that already has an ID/already exists- but if its a blank request, the ware does not yet have an id

// primary_ware is a pg_ware defined by factorybot: https://github.com/assaydepot/rx/blob/4de536d040dcef37d1a2884b581b182497c528ec/spec/factories/wares.rb

// factory :pg_ware, class: Pg::Ware do
// name          { Faker::Scientist::Service.title }
// snippet       { Faker::Lorem.paragraphs(number: 2) }
// ware_type     "CustomService"
// organizations { Pg::Organization.canonical }
// description   { Faker::Lorem.paragraphs(number: 3) }

// factory :pg_ware_default  do
//   name 'make-a-request'
//   slug 'make-a-request'
// end

// post "/wares/#{peptide.primary_ware.id}/quote_groups.json", {pg_quote_group: json_payload}, { 'Authorization' => "Bearer #{access_token.token}"

// let(:json_payload) {
//   {
//     name: "#{quote_group.name}_clone",
//     description: "some quoted ware",
//     provider_ids: quote_group.providers.pluck(:id),
//     provider_names: quote_group.providers.pluck(:name),
//     proposed_deadline_str: DateTime.now.to_s,
//     site: site.attributes.slice("name", "billing_same_as_shipping"),
//     shipping_address_attributes: site.shipping_address.attributes
//   }
// }