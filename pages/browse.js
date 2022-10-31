import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import {
  Item,
  SearchBar,
} from 'webstore-component-library'
import { fetcher } from '../services/fetcher'

const Browse = () => {
	// TODO(alishaevn): the code before the return is copied from the index page. we should use some global state instead
	// TODO(alishaevn): add styling

	const [ query, setQuery ] = useState('')
	const url = () => `/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`
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
			slug: ware.slug,
		}
	})

	return(
		<>
			<SearchBar onSubmit={handleOnSubmit} />
			{services && services.map(service => {

				return (
					<Item
						item={service}
						withButtonLink={true}
						orientation='horizontal'
						buttonProps={{
							backgroundColor: '#A9A9A9',
							label: 'Request this item',
							primary: true,
						}}
						style={{ marginBottom: 15 }}
					/>
				)
			})}
		</>
	)
}

export default Browse
