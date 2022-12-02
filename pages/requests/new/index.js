import React, { useState } from 'react'
import {
  Title,
} from 'webstore-component-library'

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

  // have a function here that accepts our data and takes it to the post api call
  // e.g. postApiCall(shippingAddress, billingAddress, billingSameAsShipping, description, proposedDeadline)

  // set up some local state
  const [shippingAddress, setShippingAddress] = useState(null)
  const [billingAddress, setBillingAddress] = useState(null)
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(null)
  const [description, setDescription] = useState(null)
  const [proposedDeadline, setProposedDeadline] = useState(null)

  // set up a function that handles the data. the below won't work because we need an onChange for the fields
  // or do we just use a react bootstrap form for this page??

  // const handleData = ({ property, value }) => {
  //   switch(property) {
  //     case property === 'shippingAddress':
  //       setShippingAddress(value)
  //       break
  //     case property === 'billingAddress':
  //       setBillingAddress(value)
  //       break
  //     case property === 'billingSameAsShipping':
  //       setBillingSameAsShipping(value)
  //       break
  //     case property === 'description':
  //       setDescription(value)
  //       break
  //     case property === 'proposedDeadline':
  //       setProposedDeadline(value)
  //       break
  //   }
  // }

  return(
    <>
      <Title title='New Request' />
      {/* description component */}
      {/* proposals due by component */}
      <ShippingDetails
        // onChange={({ property, value }) => handleData({ property, value })}
      />

      <Button
        onClick={() => postApiCall(shippingAddress, billingAddress, billingSameAsShipping, description, proposedDeadline)}
      />
    </>
  )
}

export default NewBlankRequest
