import { useRouter } from 'next/router'
import { Image, TextBox, Title } from 'webstore-component-library'
import { getOneWare } from '../../services/utils'
import { DEFAULT_WARE_IMAGE } from '../../constants'

const Featured = () => {
  const router = useRouter()
  const { id } = router.query
  const { ware, isLoading, isError } = getOneWare(id)

  if (isError) return <h1>Error...</h1>

  return (
    <>
      {isLoading
        ? (
          <h1>Loading...</h1>
        ) : (
          <>
            {/* TODO(alishaevn): make the below a compound component in the library */}
            <Title title={ware.name} />
            <TextBox text={ware.description} />
            <Image {...DEFAULT_WARE_IMAGE} />
          </>
        )
      }
    </>
  )
}

export default Featured
