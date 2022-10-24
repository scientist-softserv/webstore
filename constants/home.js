import item from '../assets/img/item.jpg'

const img = {
	src: item.src,
	alt: 'Several rows of test tubes with a liquid being put into one.',
}

export const TITLE = 'About ACME Tracking Company'

export const TEXT = `The ACME Tracking Company is a name for the fictional corporation appearing in various Warner Bros. cartoon shorts, where it was used as a running gag due to their wide array of products that are dangerous, unreliable or preposterous.

The company is never clearly defined in Road Runner cartoons but appears to be a conglomerate which produces every product type imaginable, no matter how elaborate or extravagant—most of which never work as desired or expected (some products do work very well, but backfire against the coyote). In the Road Runner cartoon Beep, Beep, it was referred to as "Acme Rocket-Powered Products, Inc." based in Fairfield, New Jersey. Many of its products appear to be produced specifically for Wile E. Coyote; for example, the Acme Giant Rubber Band, subtitled "(For Tripping Road Runners)".

While their products leave much to be desired, Acme delivery service is second to none; Wile E. can merely drop an order into a mailbox (or enter an order on a website, as in the Looney Tunes: Back in Action movie), and have the product in his hands within seconds.`

export const ITEMS = [
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
