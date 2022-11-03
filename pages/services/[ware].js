import { useRouter } from 'next/router'

const Ware = () => {
  const router = useRouter()
  const { ware } = router.query

  return <p>Ware: {ware}</p>
}

export default Ware
