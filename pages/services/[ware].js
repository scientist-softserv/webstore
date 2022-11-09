import { useRouter } from 'next/router'
import { ItemPage } from 'webstore-component-library'
import { getOneWare } from '../../utils/api'
import { DEFAULT_WARE_IMAGE } from '../../utils/constants'

const Service = () => {
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
          <ItemPage
            title={ware.name}
            description={ware.description}
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
