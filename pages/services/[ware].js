import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Error, ItemPage, Loading } from '@scientist-softserv/webstore-component-library'
import { configureErrors, DEFAULT_WARE_IMAGE, useOneWare } from '../../utils'

const Service = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { id } = router.query
  const { ware, isLoading, isError } = useOneWare(id, session?.accessToken)

  if (isError) return <Error errors={configureErrors([isError])} router={router} />

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
