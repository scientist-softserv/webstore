import { useRouter } from 'next/router'
import {
  ActionsGroup,
  Loading,
  StatusBar,
} from 'webstore-component-library'
import { getOneRequest, sendMessage, STATUS_ARRAY } from '../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

const Request = () => {
  const router = useRouter()
  const { id } = router.query
  const { request, isLoadingRequest, isRequestError } = getOneRequest(id)

  if (isLoadingRequest) return <Loading wrapperClass='item-page' />
  if (isRequestError) return <h1>{`${isError.name}: ${isError.message}`}</h1>

  const handleSendingMessages = ({ message, files }) => sendMessage({ id, message, files })

  return(
    <>
      <StatusBar statusArray={STATUS_ARRAY} apiRequestStatus={request.status} />
      <ActionsGroup handleSendingMessages={handleSendingMessages} />
    </>
  )
}

export default Request
