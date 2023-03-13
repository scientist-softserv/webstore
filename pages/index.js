import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import {
  Image,
  ItemGroup,
  Notice,
  SearchBar,
  TitledTextBox,
} from '@scientist-softserv/webstore-component-library'
import hero from '../assets/img/hero.jpg'
import {
  configureErrors,
  configureServices,
  useAllWares,
  FEATURED_SERVICE_PATH,
  ABOUT_US_TEXT,
  ABOUT_US_TITLE,
  APP_TITLE,
} from '../utils'

const Home = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const { wares, isLoading, isError } = useAllWares(session?.accessToken)
  const featuredServices = configureServices({ data: wares, path: FEATURED_SERVICE_PATH })?.slice(0, 3)
  const handleOnSubmit = ({ value }) => router.push(
    { pathname: '/browse', query: { q: value } },
    (value.length > 0 ? `/browse?q=${value}` : '/browse')
  )

  return (
    <>
      <Head>
        <title>{APP_TITLE}</title>
        <link rel='icon' href='favicon.png' />
      </Head>
      <Image
        alt='DNA chain'
        src={hero.src}
        height={400}
        width='100%'
        style={{ objectFit: 'cover' }}
      />
      <div className='container'>
        <SearchBar onSubmit={handleOnSubmit} />
        <TitledTextBox title={ABOUT_US_TITLE} text={ABOUT_US_TEXT} dataCy='about-us-section'/>
        {isError ? (
          <Notice
            alert={configureErrors([isError])}
            withBackButton={false}
            addClass='my-5'
          />
        ) : (
          <>
            <ItemGroup
              items={featuredServices}
              isLoading={isLoading}
              withTitleLink={true}
            />
          </>
        )}
      </div>
    </>
  )
}

export default Home
