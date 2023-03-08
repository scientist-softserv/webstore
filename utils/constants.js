import logo from '../assets/svg/gps-logo-white.svg'
import item from '../assets/img/item.jpg'

export const DEFAULT_WARE_IMAGE = {
  src: item.src,
  alt: 'Several rows of test tubes with a liquid being put into one.',
}

export const APP_TITLE = 'Golden Pacific Sciences - WebStore'

export const ABOUT_US_TITLE = 'About Us'

/* eslint-disable max-len */
export const ABOUT_US_TEXT = `Golden Pacific Sciences provides a range of products, Best Service Ever , and services within the life-science industry. We are able to support requests from the world’s top pharma companies and 100s of biotechs using Scientist.com.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio aenean sed adipiscing diam donec adipiscing tristique. Eu lobortis elementum nibh tellus molestie. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et. Nisl purus in mollis nunc sed id semper risus in. Diam volutpat commodo sed egestas egestas fringilla. Lectus proin nibh nisl condimentum. Odio euismod lacinia at quis risus sed vulputate odio ut. Ac feugiat sed lectus vestibulum mattis ullamcorper. Iaculis at erat pellentesque adipiscing commodo elit at. Eget nullam non nisi est sit amet facilisis magna etiam. Faucibus turpis in eu mi bibendum neque egestas. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.`
/* eslint-enable max-len */

export const LOGO = {
  alt: 'A scientific symbol with a company name',
  src: logo.src,
}

export const FOOTER_NAME = 'Golden Pacific Sciences'

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

// TODO(alishaevn): use the api value from https://github.com/assaydepot/rx/issues/21497 in the next phase
// this amount, listed in milliseconds, represents when the access token will expire
// the default is 1 week
export const EXPIRATION_DURATION = 604800000
