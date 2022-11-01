import { useState } from 'react'
import useSWR from 'swr'
import {
  Item,
  SearchBar,
} from 'webstore-component-library'
import { fetcher } from '../../services/fetcher'

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
			{services && services.map(service => (
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
				))}
		</>
	)
}

export default Browse

// export async function getStaticProps() {
	// const [ query, setQuery ] = useState('')
	// const url = () => `/providers/${process.env.NEXT_PUBLIC_PROVIDER_ID}/wares.json`
	// const { data, error } = useSWR(url, fetcher)

	// const query_results = data?.ware_refs.filter((ware) => {
	// 	const queryExpression = new RegExp(query, 'i')
	// 	return queryExpression.test(ware.name)
	// })

	// const wares = query_results?.map(ware => {
	// 	return {
	// 		description: ware.snippet,
	// 		id: ware.reference_of_id,
	// 		img: {
	// 			src: ware.promo_image,
	// 			alt: `The promotional image for ${ware.name}`
	// 		},
	// 		name: ware.name,
	// 		slug: ware.slug,
	// 	}
	// })

  // Call an external API endpoint to get posts
  // const res = await fetch('https://.../posts')
  // const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
//   return {
//     props: {
//       data,
// 			error,
//     },
//   }
// }
