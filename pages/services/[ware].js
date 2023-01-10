import { useRouter } from 'next/router'
import { ItemPage, Loading } from 'webstore-component-library'
import { DEFAULT_WARE_IMAGE, useOneWare } from '../../utils'

const Service = () => {
  const router = useRouter()
  const { id } = router.query
  const { ware, isLoading, isError } = useOneWare(id)

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
            img={{
              src: ware.urls.promo_image,
              alt: `The promotional image for ${ware.name}`,
            }}
          />
        )
      }
    </>
  )
}

export default Service
