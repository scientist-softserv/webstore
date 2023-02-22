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
  Loading,
  Notice,
  ShippingDetails,
  Title,
} from '@scientist-softserv/webstore-component-library'
import {
  addDays,
  buttonBg,
  configureErrors,
  createRequest,
  requestFormHeaderBg,
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
  const [createRequestError, setCreateRequestError] = useState(undefined)
  const [createdRequestUUID, setCreatedRequestUUID] = useState(undefined)

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

    const { data, error } = await createRequest({
      dynamicFormData: { name: dynamicForm.name, formData, ...requestForm },
      wareID,
      accessToken: session?.accessToken,
    })
    if (error) return setCreateRequestError(error)

    setCreatedRequestUUID(data.uuid)
  }

  useEffect(() => {
    if (createdRequestUUID) {
      router.push({
        pathname: `/requests/${createdRequestUUID}`
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdRequestUUID])

  // TODO(alishaevn): use react bs placeholder component
  if (isLoadingInitialRequest || !wareID) return <Loading wrapperClass='item-page mt-5' />

  if (!session) {
    return (
      <Notice
        alert={{
          body: ['Please log in to make new requests.'],
          title: 'Unauthorized',
          variant: 'info'
        }}
        dismissible={false}
      />
    )
  }

  if (isInitialRequestError) {
    return (
      <Notice
        alert={configureErrors([isInitialRequestError])}
        dismissible={false}
        withBackButton={true}
        buttonProps={{
          onClick: () => router.back(),
          text: 'Click to return to the previous page.',
        }}
      />
    )
  }

  if (createRequestError) {
    return (
      <Notice
        alert={configureErrors([createRequestError])}
        dismissible={true}
        withBackButton={false}
      />
    )
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
          backgroundColor={requestFormHeaderBg}
          billingCountry={requestForm.billing.country}
          shippingCountry={requestForm.shipping.country}
          updateRequestForm={updateRequestForm}
        />
      </div>
      <div className='col'>
        <AdditionalInfo
          updateRequestForm={updateRequestForm}
          defaultRequiredDate={defaultRequiredDate}
          backgroundColor={requestFormHeaderBg}
        />
      </div>
    </div>
    <Button
      addClass='btn btn-primary my-4 ms-auto d-block'
      backgroundColor={buttonBg}
      label='Initiate Request'
      type='submit'
      size='large'
    />
  </>
)

export default NewRequest
