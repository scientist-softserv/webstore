import logo from '../assets/svg/logo.svg'

export const LOGO = {
	alt: 'A scientific symbol with a company name',
	src: logo.src,
}

export const FOOTER_NAME = 'Golden Pacific Services'

export const FOOTER_SECTIONS = [
	{
		header: 'One',
		links: [
			{
				name: 'The Team',
				url: '/about-us',
			},
		],
	},
	{
		header: 'Two',
		links: [
			{
				name: 'Contact',
				url: '/contact',
			},
		],
	},
	{
		header: 'Three',
		links: [
			{
				name: 'Services',
				url: '/services',
			},
		],
	},
]

export const FOOTER_SOCIALS = [
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