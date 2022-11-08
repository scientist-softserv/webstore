import { useRouter } from 'next/router'
import {
  Image,
  ItemGroup,
  SearchBar,
  TitledTextBox,
} from 'webstore-component-library'
import hero from '../assets/img/hero.jpg'
import { TEXT, TITLE } from '../constants/home'
import { configure_services, useWares } from '../services/utils'

const Home = () => {
  const router = useRouter()
  const { wares, isLoading, isError } = useWares(`/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`)
  const featured_services = configure_services({ data: wares?.ware_refs, path: '/services' })?.slice(0, 4)
  const handleOnSubmit = ({ value }) => router.push({ pathname: '/browse', query: { q: value } }, '/browse')

  if (isError) return <h1>Error...</h1>

  return (
    <>
      <Image
        alt='DNA chain'
        src={hero.src}
        height={400}
        width='100%'
        style={{ objectFit: 'cover' }}
      />
      <SearchBar onSubmit={handleOnSubmit} />
      <TitledTextBox title={TITLE} text={TEXT} />
      {isLoading
        ? (
          <h1>Loading...</h1>
        ) : (
          <ItemGroup
            items={featured_services}
            withTitleLink={true}
          />
        )
      }
    </>
  )
}

export default Home
