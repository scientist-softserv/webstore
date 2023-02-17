import logo from '../assets/svg/bbs-logo-white.svg'
import item from '../assets/img/louis-reed-pwcKF7L4-no-unsplash.jpg'

export const DEFAULT_WARE_IMAGE = {
  src: item.src,
  alt: 'Several rows of test tubes with a liquid being put into one.',
}

export const TITLE = 'About Us'

/* eslint-disable max-len */
export const ABOUT_US = `Beachside Biotechnology Services is a multinational value, evidence and market access commercialization solutions organization. We deliver end-to-end clinical evidence services from Phase I to IV, plus medical affairs and commercial market access strategy and support and the  Best Service Ever .\nOur team includes senior leaders with in-depth experience in health economics and outcomes research (HEOR), evidence assessment, value communications, data analytics, real world evidence, observational research, and private and public payer market access solutions.  Our regulatory-grade proprietary RWD platform enables integrated, real world insights derived from 100 million patients, across all major therapeutic areas.`
/* eslint-enable max-len */

export const LOGO = {
  alt: 'A scientific symbol with a company name',
  src: logo.src,
}

export const FOOTER_NAME = 'Beachside Biotechnology Services'

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

export const STATUS_ARRAY = [
  {
    statusLabel: 'Supplier Review',
    statusIcon: 'fa-list-check',
  },
  {
    statusLabel: 'SOW Selection',
    statusIcon: 'fa-square-check',
  },
  {
    statusLabel: 'Work Started',
    statusIcon: 'fa-vial',
  },
  {
    statusLabel: 'Work Completed',
    statusIcon: 'fa-vial-circle-check',
  },
]

export const NAVIGATION_LINKS = [
  {
    label: 'Browse',
    onClick: null,
    path: '/browse',
  },
  {
    label: 'Requests',
    onClick: null,
    path: '/requests',
  },
]

// updates the title link on the featured service cards on the homepage.
// 'requests/new' will link to a new request for that service
// change this to '/services' to have this link to a page for an individual service.
// if you choose to go this route, you can update the content for the service's page at pages/services/[ware].js
export const FEATURED_SERVICE_PATH = '/requests/new'
