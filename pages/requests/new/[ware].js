import React, { useState, useEffect } from 'react'
import { default as BsForm } from 'react-bootstrap/Form'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { useRouter } from 'next/router'
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
  sendRequestToVendor,
  useInitializeRequest,
} from '../../../utils'

const NewRequest = ({ session }) => {
  const router = useRouter()
  const accessToken = session?.accessToken
  const wareID = router.query.id
  const { dynamicForm, isLoadingInitialRequest, isInitialRequestError } = useInitializeRequest(wareID, accessToken)
  const oneWeekFromNow = addDays((new Date()), 7).toISOString().slice(0, 10)
  const disabled = session === null ? true : false
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
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  useEffect(() => {
    if (createdRequestUUID) {
      router.push({
        pathname: `/requests/${createdRequestUUID}`,
        query: { createRequestError: JSON.stringify(createRequestError) },
      }, `/requests/${createdRequestUUID}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdRequestUUID, createRequestError])

  /**
   * checking for the presence of a session has to come after all of the hooks so we don't violate the react-hooks/rules-of-hooks
   * rule. ref: https://legacy.reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
   * we return the loading state in two different locations because it's rendered based on separate conditions. when
   * isLoading is true because we don't have a user, it doesn't ever become false. that's why we were previously returning
   * the loading spinner indefinitely.
   * using a guard clause with an early return inside the api methods also violates the react-hooks/rules-of-hooks rule.
   */
  if (session === undefined) return pageLoading

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
    setButtonDisabled(true)
    if (!event.formData) {
      // these steps are needed for requests without a dynamic form
      // but error on the event resulting from the react json form
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
    }
    setFormSubmitting(true)

    if (requestForm.billingSameAsShipping === true) Object.assign(requestForm.billing, requestForm.shipping)

    const { data, error } = await createRequest({
      dynamicFormData: { ...dynamicForm, formData, ...requestForm },
      wareID,
      accessToken,
    })
    // if we have data AND an error, the request was created, but the attachments failed
    // in that case, we still need to send the request to the vendor
    if (error && !data) {
      setFormSubmitting(false)
      setCreateRequestError(error)
      return
    } else if (error) {
      setCreateRequestError(error)
    }

    const sentToVendor = await sendRequestToVendor(data.id, accessToken)
    if (sentToVendor.error) {
      setFormSubmitting(false)
      setCreateRequestError(sentToVendor.error)
    }

    setCreatedRequestUUID(data.uuid)
  }

  // TODO(alishaevn): use react bs placeholder component
  if (isLoadingInitialRequest || !wareID || formSubmitting) return pageLoading

  if (isInitialRequestError) {
    return (
      <Notice
        addClass='my-5'
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
        addClass='my-5'
        alert={configureErrors([createRequestError])}
        dismissible={true}
        withBackButton={false}
      />
    )
  }

  return(
    <>
      {disabled &&
        <SignInRequired />
      }
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
            disabled={disabled}
          >
            <StandardRequestOptions
              defaultRequiredDate={oneWeekFromNow}
              requestForm={requestForm}
              updateRequestForm={updateRequestForm}
              buttonDisabled={buttonDisabled || disabled}
              disabled={disabled}
            />
          </Form>
        ) : (
          <BsForm
            onSubmit={handleSubmit}
            id={`new-${wareID}-request-form`}
            noValidate
            validated={validated}
            disabled={disabled}
          >
            <BlankRequestForm updateRequestForm={updateRequestForm} />
            <StandardRequestOptions
              defaultRequiredDate={oneWeekFromNow}
              requestForm={requestForm}
              updateRequestForm={updateRequestForm}
              buttonDisabled={buttonDisabled || disabled}
              disabled={disabled}
            />
          </BsForm>
        )}
      </div>
    </>
  )
}

const StandardRequestOptions = ({ buttonDisabled, defaultRequiredDate, requestForm, updateRequestForm, disabled }) => {
  return (
    <>
      <div className='row'>
        <div className='col'>
          <ShippingDetails
            backgroundColor={requestFormHeaderBg}
            billingCountry={requestForm.billing.country}
            shippingCountry={requestForm.shipping.country}
            updateRequestForm={updateRequestForm}
            disabled={disabled}
          />
        </div>
        <div className='col'>
          <AdditionalInfo
            updateRequestForm={updateRequestForm}
            defaultRequiredDate={defaultRequiredDate}
            backgroundColor={requestFormHeaderBg}
            disabled={disabled}
          />
        </div>
      </div>
      <Button
        addClass='btn btn-primary my-4 ms-auto d-block'
        backgroundColor={buttonBg}
        disabled={buttonDisabled || disabled}
        label='Initiate Request'
        type='submit'
        size='large'
      />
    </>
  )
}

const pageLoading = <Loading wrapperClass='item-page mt-5' />

const SignInRequired = () => (
  <Notice
    addClass='mt-5'
    alert={{
      body: ['To proceed with making a request, please log in to your account.'],
      title: 'Sign in required',
      variant: 'info'
    }}
    dismissible={false}
  />
)

export default NewRequest
