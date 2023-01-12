import React, { useState } from 'react'
import { default as BsForm } from 'react-bootstrap/Form'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { useRouter } from 'next/router'
import {
  AdditionalInfo,
  BlankRequestForm,
  Button,
  Loading,
  ShippingDetails,
  Title,
} from 'webstore-component-library'
import { addDays, useInitializeRequest } from '../../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

const NewRequest = () => {
  const router = useRouter()
  const { id } = router.query
  const { dynamicForm, isLoadingInitialRequest, isInitialRequestError } = useInitializeRequest(id)
  const oneWeekFromNow = addDays((new Date()), 7).toISOString().slice(0, 10)
  const initialFormData = { 'suppliers_identified': 'Yes' }
  const initialState = {
    billingSameAsShipping: false,
    proposedDeadline: oneWeekFromNow,
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
    attachments: [],
  }

  const [validated, setValidated] = useState(false)
  const [requestForm, setRequestForm] = useState(initialState)
  const [formData, setFormData] = useState(initialFormData)

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
    if (!event.formData) {
      // these steps are needed for requests without a dynamic form
      // but error on the event resulting from the react json form
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
    }

    if (requestForm.billingSameAsShipping === true) Object.assign(requestForm.billing, requestForm.shipping)

    console.log('submitting::', { formData, requestForm })
  }

  // TODO(alishaevn): use react bs placeholder component
  if (isLoadingInitialRequest || !id) return <Loading wrapperClass='item-page' />
  if (isInitialRequestError) return <h1>{`${isInitialRequestError.name}: ${isInitialRequestError.message}`}</h1>

  return(
    <div className='container'>
      <Title title={dynamicForm.name || ''} addClass='my-4' />
      {dynamicForm.schema ? (
        <Form
          formData={formData}
          onChange={e => setFormData(e.formData)}
          onSubmit={handleSubmit}
          schema={dynamicForm.schema}
          uiSchema={dynamicForm.uiSchema}
          validator={validator}
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
              <AdditionalInfo updateRequestForm={updateRequestForm} defaultRequiredDate={oneWeekFromNow} />
            </div>
          </div>
          <Button
            addClass='btn btn-primary my-4 ms-auto d-block'
            label='Initiate Request'
            type='submit'
            size='large'
          />
        </Form>
      ) : (
        <BsForm
          onSubmit={handleSubmit}
          id={`new-${id}-request-form`}
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
              <AdditionalInfo updateRequestForm={updateRequestForm} defaultRequiredDate={oneWeekFromNow} />
            </div>
          </div>
          <Button
            addClass='btn btn-primary my-4 ms-auto d-block'
            label='Initiate Request'
            type='submit'
            size='large'
          />
        </BsForm>
      )}
    </div>
  )
}

export default NewRequest
