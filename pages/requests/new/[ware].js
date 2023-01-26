import React, { useState, useEffect } from 'react'
import { default as BsForm } from 'react-bootstrap/Form'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import {
  AdditionalInfo,
  BlankRequestForm,
  Button,
  Error,
  Loading,
  ShippingDetails,
  Title,
} from '@scientist-softserv/webstore-component-library'
import {
  addDays,
  configureErrors,
  createRequest,
  useInitializeRequest,
} from '../../../utils'

const NewRequest = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const wareID = router.query.id
  const { dynamicForm, isLoadingInitialRequest, isInitialRequestError } = useInitializeRequest(wareID, session?.accessToken)
  const oneWeekFromNow = addDays((new Date()), 7).toISOString().slice(0, 10)
  const initialFormData = { 'suppliers_identified': 'Yes' }
  const initialState = {
    billingSameAsShipping: false,
    description: '',
    timeline: '',
    proposedDeadline: oneWeekFromNow,
    attachments: [],
    billing: {
      street: '',
      street2: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
    },
    shipping: {
      street: '',
      street2: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
    },
  }

  const [validated, setValidated] = useState(false)
  const [requestForm, setRequestForm] = useState(initialState)
  const [formData, setFormData] = useState(initialFormData)
  const [requestSucceeded, setRequestSucceeded] = useState(false)
  const [requestErred, setRequestErred] = useState(false)
  const [requestID, setNewRequestID] = useState(undefined)

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

  const handleSubmit = async (event) => {
    if (!event.formData) {
      // these steps are needed for requests without a dynamic form
      // but error on the event resulting from the react json form
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
    }

    if (requestForm.billingSameAsShipping === true) Object.assign(requestForm.billing, requestForm.shipping)

    const { success, error, requestID } = await createRequest({
      data: { name: dynamicForm.name, formData, ...requestForm },
      wareID,
      accessToken: session?.accessToken,
    })
    setRequestSucceeded(success)
    setRequestErred(error)
    setNewRequestID(requestID)
  }

  useEffect(() => {
    if (requestSucceeded) {
      router.push({
        pathname: `/requests/${requestID}`
      })
    }
    if (requestErred) {
      //TODO: set error alerts here
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestSucceeded, requestErred, requestID])

  // TODO(alishaevn): use react bs placeholder component
  if (isLoadingInitialRequest || !wareID) return <Loading wrapperClass='item- mt-5' />

  if (isInitialRequestError) return <Error errors={configureErrors([isInitialRequestError])} router={router} />

  if (!session) {
    return (
      <Error
        errors={{
          errorText: ['Please log in to make new requests.'],
          errorTitle: 'Unauthorized',
          variant: 'info'
        }}
        router={router}
        showBackButton={false}
      />)
  }

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
          <StandardRequestOptions
            defaultRequiredDate={oneWeekFromNow}
            requestForm={requestForm}
            updateRequestForm={updateRequestForm}
          />
        </Form>
      ) : (
        <BsForm
          onSubmit={handleSubmit}
          id={`new-${wareID}-request-form`}
          noValidate
          validated={validated}
        >
          <BlankRequestForm updateRequestForm={updateRequestForm} />
          <StandardRequestOptions
            defaultRequiredDate={oneWeekFromNow}
            requestForm={requestForm}
            updateRequestForm={updateRequestForm}
          />
        </BsForm>
      )}
    </div>
  )
}

const StandardRequestOptions = ({ defaultRequiredDate, requestForm, updateRequestForm, }) => (
  <>
    <div className='row'>
      <div className='col'>
        <ShippingDetails
          billingCountry={requestForm.billing.country}
          shippingCountry={requestForm.shipping.country}
          updateRequestForm={updateRequestForm}
        />
      </div>
      <div className='col'>
        <AdditionalInfo updateRequestForm={updateRequestForm} defaultRequiredDate={defaultRequiredDate} />
      </div>
    </div>
    <Button
      addClass='btn btn-primary my-4 ms-auto d-block'
      label='Initiate Request'
      type='submit'
      size='large'
    />
  </>
)

export default NewRequest
