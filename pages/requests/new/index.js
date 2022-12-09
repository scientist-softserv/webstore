import React, { useState } from 'react'
import { BlankRequestForm } from 'webstore-component-library'

// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

const NewBlankRequest = () => {
  /*
  based on the json response when getting a request, lets assume that our post request to create a new request may accept a body with the following properties:
  {
    description,
    billing_same_as_shipping,
    proposed_deadline,
    shipping_address,
    billing_address
  }
  */

  // have a real function here that accepts our data and takes it to the post api call
  const postRequestForm = (requestForm) => {
		console.log({ requestForm })
	}

  // set up some local state
  // const [shippingAddress, setShippingAddress] = useState(null)
  // const [billingAddress, setBillingAddress] = useState(null)
  // const [billingSameAsShipping, setBillingSameAsShipping] = useState(null)
  // const [description, setDescription] = useState(null)
  // const [proposedDeadline, setProposedDeadline] = useState(null)

  return(
    <BlankRequestForm onSubmit={requestForm => postRequestForm(requestForm)} />
  )
}

export default NewBlankRequest
