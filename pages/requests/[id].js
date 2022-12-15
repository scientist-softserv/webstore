import { useRouter } from 'next/router'
import {
  Loading,
  StatusBar,
  Title,
  TextBox,
} from 'webstore-component-library'
import { getOneRequest, STATUS_ARRAY } from '../../utils'
// TODO(alishaevn): trying to access this page without being signed in should redirect to the login page

const Request = () => {
  const router = useRouter()
  const { id } = router.query
  const { request, isLoadingRequest, isRequestError } = getOneRequest(id)

  if (isLoadingRequest) return <Loading wrapperClass='item-page' />
  if (isRequestError) return <h1>{`${isError.name}: ${isError.message}`}</h1>
  console.log('request::', request)

  return(
    <div className='container'>
      <StatusBar statusArray={STATUS_ARRAY} apiRequestStatus={request.status} />
      <Title title={request.name} addClass='mt-5'/>
      {/* <TextBox text={request.description} addClass='mt-5'/> */}
      <div dangerouslySetInnerHTML={{__html: request.description}} className='mt-2'/>
    </div>
  )
}

export default Request
