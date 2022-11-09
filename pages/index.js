import { useRouter } from 'next/router'
import {
  Image,
  ItemGroup,
  SearchBar,
  TitledTextBox,
} from 'webstore-component-library'
import hero from '../assets/img/hero.jpg'
import { TEXT, TITLE } from '../utils/constants'
import { configure_services, getAllWares } from '../utils/api'

const Home = () => {
  const router = useRouter()
  const { wares, isLoading, isError } = getAllWares()
  const featured_services = configure_services({ data: wares, path: '/services' })?.slice(0, 4)
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
