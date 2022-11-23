import { useRouter } from 'next/router'
import {
  Image,
  ItemGroup,
  SearchBar,
  TitledTextBox,
} from 'webstore-component-library'
import hero from '../assets/img/hero.jpg'
import {
  configure_services,
  getAllWares,
  TEXT,
  TITLE,
} from '../utils'

const Home = () => {
  const router = useRouter()
  const { wares, isLoading, isError } = getAllWares()
  const featured_services = configure_services({ data: wares, path: '/services' })?.slice(0, 3)
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
      <div className='container'>
        <SearchBar onSubmit={handleOnSubmit} />
        <TitledTextBox title={TITLE} text={TEXT} />
        <ItemGroup
          items={featured_services}
          isLoading={isLoading}
          withTitleLink={true}
        />
      </div>
    </>
  )
}

export default Home
