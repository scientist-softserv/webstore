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
import { useInitializeRequest } from '../../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

const NewServiceRequest = () => {
  const router = useRouter()
  const { id, name } = router.query
  const { dynamicForm, isLoadingInitialRequest, isInitialRequestError } = useInitializeRequest(id)


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
    'description': dynamicForm.description,
    'type': dynamicForm.type,
    'required': dynamicForm.requiredFields,
    'properties': dynamicForm.properties,
  }

  return(
    <div className='container'>
      <Title title={dynamicForm.title} addClass='my-4' />
      <Form
        schema={JSONSchema}
        validator={validator}
        onSubmit={event => console.log('submitting::', event.formData)}
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
