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
import item from '../assets/item.jpg'
import { fetcher } from '../services/fetcher'

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
      <Footer
        companyName='ACME Tracking Company'
        sections={sections}
        socials={socials}
      />
		</>
	)
}

export default Home

const title = 'About ACME Tracking Company'

const text = `The ACME Tracking Company is a name for the fictional corporation appearing in various Warner Bros. cartoon shorts, where it was used as a running gag due to their wide array of products that are dangerous, unreliable or preposterous.

The company is never clearly defined in Road Runner cartoons but appears to be a conglomerate which produces every product type imaginable, no matter how elaborate or extravagant—most of which never work as desired or expected (some products do work very well, but backfire against the coyote). In the Road Runner cartoon Beep, Beep, it was referred to as "Acme Rocket-Powered Products, Inc." based in Fairfield, New Jersey. Many of its products appear to be produced specifically for Wile E. Coyote; for example, the Acme Giant Rubber Band, subtitled "(For Tripping Road Runners)".

While their products leave much to be desired, Acme delivery service is second to none; Wile E. can merely drop an order into a mailbox (or enter an order on a website, as in the Looney Tunes: Back in Action movie), and have the product in his hands within seconds.`

const img = {
	src: item.src,
	alt: 'Several rows of test tubes with a liquid being put into one.',
}

const items = [
	{
		id: 1,
		description: 'This is the the first service.',
		img,
		name: 'Service One',
	},
	{
		id: 2,
		description: 'This is the the second service.',
		img,
		name: 'Service Two',
	},
	{
		id: 3,
		description: 'This is the the third service.',
		img,
		name: 'Service Three',
	},
  {
		id: 4,
		description: 'This is the the fourth service.',
		img,
		name: 'Service Four',
	},
]

const links = [
	{
		name: 'The Team',
		url: '/about-us',
	},
	{
		name: 'Contact',
		url: '/contact',
	},
	{
		name: 'Services',
		url: '/services',
	},
]

const sections = [
	{
		header: 'One',
		links,
	},
	{
		header: 'Two',
		links,
	},
	{
		header: 'Three',
		links,
	},
]

const socials = [
	{
		icon: 'twitter',
		url: 'www.twitter.com',
	},
	{
		icon: 'instagram',
		url: 'www.instagram.com',
	},
	{
		icon: 'facebook',
		url: 'www.facebook.com',
	},
]
