import React, { useState } from 'react'
import validator from '@rjsf/validator-ajv8'
import Form from '@rjsf/core'
import { useRouter } from 'next/router'
import {
  AdditionalInfo,
  Button,
  ShippingDetails,
  Title,
} from 'webstore-component-library'
// TODO(alishaevn): comment this back in when it's working
import { initializeRequest } from '../../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

const NewServiceRequest = () => {
  const router = useRouter()
  const { id, name } = router.query
  initializeRequest(id)

  const initialState = {
    name,
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

  const JSONSchema = {
    'title': dynamicForm.title,
    'description': dynamicForm.description,
    'type': dynamicForm.type,
    // 'required': [
    //   'description'
    // ],
    'properties': dynamicForm.properties,
    // 'properties': {
    //   'description': {
    //     'type': 'string',
    //     'title': 'Description'
    //   },
    //   'proposed_deadline': {
    //     'type': 'string',
    //     'title': 'Proposed Deadline'
    //   }
    // }
  }

  return(
    <div className='container'>
      <Title title={name} addClass='my-4' />
      <Form
        schema={JSONSchema}
        validator={validator}
        // do something with the event.formData value
        // onChange={event => updateRequestForm()}
        // onSubmit={handleSubmit}
      >
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
          addClass='my-4 ms-auto d-block btn btn-primary'
          label='Initiate Request'
          type='submit'
          size='large'
        />
      </Form>
    </div>
  )
}

export default NewServiceRequest
