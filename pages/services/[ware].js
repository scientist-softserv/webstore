import { useRouter } from 'next/router'
import { ItemPage, Loading } from 'webstore-component-library'
import { DEFAULT_WARE_IMAGE, getOneWare } from '../../utils'

const Service = () => {
  const router = useRouter()
  const { id } = router.query
  const { ware, isLoading, isError } = getOneWare(id)

  if (isError) return <h1>{`${isError.name}: ${isError.message}`}</h1>

  return (
    <>
      {isLoading
        ? (
          <Loading wrapperClass='item-page' />
        ) : (
          <ItemPage
            title={ware.name}
            description={ware.description || ware.snippet}
            // TODO(alishaevn): update the below to an actual image once
            // https://github.com/assaydepot/scientist_api_v2/issues/184 is completed
            img={DEFAULT_WARE_IMAGE}
          />
        )
      }
    </>
  )
}

export default Service
