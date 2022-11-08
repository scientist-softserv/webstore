import { useRouter } from 'next/router'
import {
  Image,
  ItemGroup,
  SearchBar,
  TitledTextBox,
} from 'webstore-component-library'
import hero from '../assets/img/hero.jpg'
import { TEXT, TITLE } from '../constants/home'

const Home = ({ services }) => {
	const router = useRouter()
	const featured_services = services('/services').slice(0, 4)
	const handleOnSubmit = ({ value }) => router.push({ pathname: '/browse', query: { q: value } }, '/browse')

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
			<ItemGroup
				items={featured_services}
				withTitleLink={true}
			/>
		</>
	)
}

export default Home
