import { useRouter } from 'next/router'
import { ItemPage, Loading } from '@scientist-softserv/webstore-component-library'
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
            img={
              ware.urls.promo_image ? {
                src: ware.urls.promo_image,
                alt: `The promotional image for ${ware.name}`,
              } : DEFAULT_WARE_IMAGE
            }
            ware={ware}
          />
        )
      }
    </>
  )
}

export default Service
