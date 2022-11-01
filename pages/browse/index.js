import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Item, SearchBar } from 'webstore-component-library'
import { fetcher } from '../../services/fetcher'

// TODO(alishaevn): the code before the return is copied from the index page. we may need global state instead
// TODO(alishaevn): add styling
// TODO(alishaevn): redirect from this page to the correct request page
const Browse = () => {
	const router = useRouter()
	const [ query, setQuery ] = useState('')

	useEffect(() => {
		if(router.query.q) setQuery(value)
	}, [])

	// TODO(alishaevn): once the api is updated to accept a query with this path, we will want to use the second "url" declaration instead.
	// the null value prevents auto search on page load
	const url = () => `/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`
	// const url = () => query.length ? `/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json&q=${query}` : null
	const { data, error } = useSWR(url, fetcher)

	const handleOnSubmit = ({ value }) => setQuery(value)

	const wares = data?.ware_refs.filter((ware) => {
		const queryExpression = new RegExp(query, 'i')
		return queryExpression.test(ware.name)
	})

	const services = wares?.map(ware => {
		return {
			description: ware.snippet,
			id: ware.reference_of_id,
			img: {
				src: ware.promo_image,
				alt: `The promotional image for ${ware.name}`
			},
			name: ware.name,
			slug: `/requests/new/${ware.slug}`,
		}
	})

	return(
		<>
			<SearchBar onSubmit={handleOnSubmit} />
			{services && services.map(service => (
					<Item
						item={service}
						withButtonLink={true}
						buttonLink={service.slug}
						orientation='horizontal'
						buttonProps={{
							backgroundColor: '#A9A9A9',
							label: 'Request this item',
							primary: true,
						}}
						style={{ marginBottom: 15 }}
					/>
				))}
		</>
	)
}

export default Browse
