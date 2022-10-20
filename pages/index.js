import { useState } from 'react'
import useSWR from 'swr'
import {
  Footer,
  Header,
  Image,
  ItemGroup,
  SearchBar,
  TitledTextBox,
} from 'webstore-component-library'
import hero from '../assets/hero.jpg'
import { fetcher } from '../services/fetcher'
import { ITEMS, TEXT, TITLE } from '../constants/home'

const Home = () => {
	const [ query, setQuery ] = useState('')
	// TODO(alishaevn): once the api is updated to accept a query with this path, we will want to use the second "url" declaration instead.
	// with url being a function, the value won't be cached. it will run whenever we return to this page.
	const url = () => `/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`
	// the null value prevents auto search on page load
	// const url = () => query.length ? `/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json&q=${query}` : null

	// TODO(alishaevn): add error handling
	const { data, error } = useSWR(url, fetcher)

	const handleOnSubmit = ({ value }) => setQuery(value)

	const wares = data?.ware_refs.filter((ware) => {
		const queryExpression = new RegExp(query, 'i')
		return queryExpression.test(ware.name)
	})

	return(
		<>
			<Header
				browseLink='/browse'
				logInLink='/'
				logo={{ img: logo.src, alt: 'A scientific symbol with a company name'}}
				logOutLink='/'
				requestsLink='/requests'
			/>
      <Image
        alt='DNA chain'
        src={hero.src}
        height={400}
        width='100%'
        style={{ objectFit: 'cover' }}
      />
      <SearchBar onSubmit={handleOnSubmit} />
			{/* TODO(alishaevn): remove the line below once we add the /browse route */}
			{wares && wares.map(w => <p>{`${w.name}`}</p>)}
      <TitledTextBox title={TITLE} text={TEXT} />
      <ItemGroup items={ITEMS} />
			<Footer
        companyName='ACME Tracking Company'
        sections={sections}
        socials={socials}
      />
		</>
	)
}

export default Home
