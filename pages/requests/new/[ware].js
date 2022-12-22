import React from 'react'
import { BlankRequestForm } from 'webstore-component-library'
import { createRequest } from '../../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page
// TODO(alishaevn): come back to this page once the initialize api function has been created. re: the thread below
// https://assaydepot.slack.com/archives/C03FZDALABG/p1670605791891109

const NewRequest = () => {
  // TODO(alishaevn): put a real function here that accepts our data and takes it to the post api call
  const postRequestForm = (requestForm) => {
    createRequest(requestForm)
  }

  return (
    <div className='container my-5'>
      <BlankRequestForm onSubmit={requestForm => postRequestForm(requestForm)} />
    </div>
  )
}

export default NewRequest
