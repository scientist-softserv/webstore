import React, { useState, useEffect } from 'react'
import {
  AdditionalInfo,
  BlankRequestForm,
  Button,
  ShippingDetails,
  Title } from 'webstore-component-library'
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
    // TODO(alishaevn): how do we handle attachments?
  }

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
    // Bootstrap validation starts here
    // Currently this is the behavior:
    // If i fill out the form correctly, the values are submitted
    // If i fill out the form incorrectly (missing fields etc),
    //  the values are not submitted, but the validations DO show up.
    // After fixing an incorrect form, if I try to submit again, the values are NOT submitted.
    // since this method uses regular bootstrap JS vs react bootstrap, i think that there is an issue with the state of the form. react bootstrap includes a 'validated' prop and i think using that would work better here. 
    var forms = document.querySelectorAll('.needs-validation')
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
          form.classList.remove('needs-validation')
          console.log(form.classList)
        }, false)
      })
    // end Bootstrap validation
    if (requestForm.billingSameAsShipping === true) {
      Object.assign(requestForm.billing, requestForm.shipping)
    }

    // TODO(alishaevn): comment this back in when it's working
    // createRequest(requestForm)
    console.log(requestForm)
  }

  return(
    <div className='container'>
      <Title title='New Request' addClass='mt-4'/>
      <form 
        onSubmit={handleSubmit}
        id='new-request-form'
        //action="/requests" method="POST"
        noValidate
        className='needs-validation'>
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
      </form>
    </div>
  )
}

export default NewBlankRequest
