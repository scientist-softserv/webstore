import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import {
  AdditionalInfo,
  BlankRequestForm,
  Button,
  ShippingDetails,
  Title,
} from 'webstore-component-library'
// TODO(alishaevn): comment this back in when it's working
// import { createRequest } from '../../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

// TODO(alishaevn): come back to this page once the initialize api function has been created. re: the thread below
// https://assaydepot.slack.com/archives/C03FZDALABG/p1670605791891109
// we may wind up not needing this page at all if we have a default ware

const NewBlankRequest = () => {
  const initialState = {
    name: 'New Request',
    billingSameAsShipping: false,
    proposedDeadline: null,
    billing: {
      street: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      text: '',
    },
    shipping: {
      street: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      text: '',
    },
    data: {
      timeline: '',
      description: '',
      // TODO(alishaevn): does the api post function account for the supplier or does that need to be part of state?
      suppliersIdentified: 'Yes',
    },
    attachments: [],
  }
  const [validated, setValidated] = useState(false)
  const [requestForm, setRequestForm] = useState(initialState)

  /**
   * @param {object} event onChange event
   * @param {string} property dot notated string representing the property in initialValue
   * @returns {object} the updated component state
   */
  const updateRequestForm = (value, property) => {
    const [initialProperty, nestedProperty] = property.split('.')

    setRequestForm((currentState) => {
      const updatedState = nestedProperty
        ? { [initialProperty]: { ...requestForm[initialProperty], [nestedProperty]: value } }
        : { [initialProperty]: value }

      return {
        ...currentState,
        ...updatedState,
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setValidated(true)

    if (event.currentTarget.checkValidity()) {
      if (requestForm.billingSameAsShipping === true) {
        Object.assign(requestForm.billing, requestForm.shipping)
      }
      // TODO(alishaevn): comment this back in when it's working
      // createRequest(requestForm)
      // TODO(summercook) remove this when createRequest works.
      // only console log valid requests.
      console.log(requestForm)
    }
  }

  return(
    <div className='container'>
      <Title title='New Request' addClass='mt-4' />
      <Form 
        onSubmit={handleSubmit}
        id='new-request-form'
        noValidate
        validated={validated}
      >
        <BlankRequestForm updateRequestForm={updateRequestForm} />
        <div className='row'>
          <div className='col'>
            <ShippingDetails
              billingCountry={requestForm.billing.country}
              shippingCountry={requestForm.shipping.country}
              updateRequestForm={updateRequestForm}
            />
          </div>
          <div className='col'>
            <AdditionalInfo updateRequestForm={updateRequestForm} />
          </div>
        </div>
        <Button
          addClass='btn btn-primary my-4 ms-auto d-block'
          label='Initiate Request'
          type='submit'
          size='large'
        />
      </Form>
    </div>
  )
}

export default NewBlankRequest
