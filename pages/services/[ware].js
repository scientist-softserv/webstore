import { useRouter } from 'next/router'
import { ItemPage, Notice, Loading } from '@scientist-softserv/webstore-component-library'
import { configureErrors, DEFAULT_WARE_IMAGE, useOneWare } from '../../utils'

const Service = ({ session }) => {
  const router = useRouter()
  const { id } = router.query
  const accessToken = session?.accessToken
  const { ware, isLoading, isError } = useOneWare(id, accessToken)

  if (isLoading) return <Loading wrapperClass='item-page mt-5' />

  if (isError) {
    return (
      <Notice
        addClass='my-5'
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
