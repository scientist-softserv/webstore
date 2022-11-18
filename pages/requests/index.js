import React from 'react'
import { RequestList } from 'webstore-component-library'
import { DEFAULT_WARE_IMAGE } from '../../utils/constants'
import { getAllRequests } from '../../utils/api/requests'
import { configure_requests } from '../../utils'
import { statusColors } from '../../utils/theme/colors'

const Requests = () => {
  const { requests, isLoading, isError } = getAllRequests()
  const featured_services = configure_requests({ data: requests, path: '/services' })?.slice(0, 3)
  const status= {
    text: 'Vendor Review',
    backgroundColor: statusColors[status],
  }

  if (isError) return <h1>Error...</h1>

  return (
    <>
      <RequestList
        createdAt='September 9, 2022'
        description='this is the description'
        img={DEFAULT_WARE_IMAGE}
        isLoading={isLoading}
        title='Title'
        status={status}
        updatedAt='September 9, 2022 at 9:21 am'
      />
    </>
  )
}

export default Requests
