import { useRouter } from 'next/router'
import { Error, ItemPage, Loading } from '@scientist-softserv/webstore-component-library'
import {
  configureErrors, DEFAULT_WARE_IMAGE, SHOW_SERVICE_PAGE, useOneWare 
} from '../../utils'

const Service = () => {
  const router = useRouter()
  const { id } = router.query
  const { ware, isLoading, isError } = useOneWare(id)

  if (isError) return <Error errors={configureErrors([isError])} router={router} />
  
  if (SHOW_SERVICE_PAGE === false) {
    return <Error errors={{errorText: ["We're sorry - something went wrong."], errorTitle: 'This page or section was not found.', variant: 'danger'}} router={router} />
  }

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
