import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { ItemPage, Notice, Loading } from '@scientist-softserv/webstore-component-library'
import { configureErrors, DEFAULT_WARE_IMAGE, useOneWare } from '../../utils'

const Service = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { id } = router.query
  const { ware, isLoading, isError } = useOneWare(id, session?.accessToken)

  if (isLoading) return <Loading wrapperClass='item-page mt-5' />

  if (isError) {
    return (
      <Notice
        alert={configureErrors([isError])}
        dismissible={false}
        withBackButton={true}
        buttonProps={{
          onClick: () => router.back(),
          text: 'Click to return to the previous page.',
        }}
      />
    )
  }

  return (
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

export default Service
