import { useRouter } from 'next/router'
import useSWR from 'swr'
import {
  Image,
  ItemGroup,
  SearchBar,
  TitledTextBox,
} from 'webstore-component-library'
import hero from '../assets/img/hero.jpg'
import { fetcher } from '../services/fetcher'
import { TEXT, TITLE } from '../constants/home'

const Home = () => {
	const router = useRouter()

	// with url being a function, the value won't be cached. it will run whenever we return to this page.
	// TODO(alishaevn): unless we find a way to pass in the featured_services instead, we will need to call the api on page load
	// or we could decide to only poll for updates at certain intervals
	const url = () => `/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`

	// TODO(alishaevn): add error handling
	const { data, error } = useSWR(url, fetcher)

	const handleOnSubmit = ({ value }) => router.push({ pathname: '/browse', query: { q: value } }, '/browse')

	const featured_services = data?.ware_refs.slice(0, 4).map(ware => {
		return {
			description: ware.snippet,
			id: ware.reference_of_id,
			img: {
				src: ware.promo_image,
				alt: `The promotional image for ${ware.name}`
			},
			name: ware.name,
			slug: ware.slug,
		}
	})

	return(
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
			{featured_services && (
				<ItemGroup
					items={featured_services}
					withTitleLink={true}
				/>
			)}
		</>
	)
}

export default Home
