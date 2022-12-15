import { useRouter } from 'next/router'
import {
  Loading,
  Messages,
  StatusBar,
} from 'webstore-component-library'
import { getAllMessages, getOneRequest, STATUS_ARRAY } from '../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

const Request = () => {
  const router = useRouter()
  const { id } = router.query
  const { request, isLoadingRequest, isRequestError } = getOneRequest(id)
  const { messages, isLoadingMessages, isMessagesError } = getAllMessages(id)

  if (isLoadingRequest || isLoadingMessages) return <Loading wrapperClass='item-page' />
  if (isRequestError || isMessagesError) return <h1>{`${isError.name}: ${isError.message}`}</h1>

  return(
    <div className='container'>
      <StatusBar statusArray={STATUS_ARRAY} apiRequestStatus={request.status.text} />
      <Messages messages={messages} />
    </div>
  )
}

export default Request
