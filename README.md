# Webstore
## Table of Contents

- [Getting Started](#getting-started)
- [Using the component library](#using-the-component-library)
	- [In its development mode](#in-its-development-mode)
	- [In its production mode](#In-its-production-mode)

---

## Getting Started
_Next JS uses `yarn` to install all packages so for the time being, I'm also deciding to use yarn._

- Run `yarn` to install any packages
- Run the development server:
	```bash
	yarn dev
	```
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result
- Create pages by adding them to the `pages` directory
  - Reference [this documentation](https://nextjs.org/docs/basic-features/pages) for more info about pages
  - The page auto-updates as you edit the file, although there may be a few seconds delay

<!-- [API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages. -->

## Using the component library
### In its development mode
- If you have not before, run `npm link` in the component library repo (this establishes the library locally)
- If you have not before, run `npm link webstore-component-library` in this repository (this allows us to import components from the library)
- Run `npm run watch-lib` in the component library repo (this allows rollup to rebuild the library when changes are made. there may be a delay up to 30 seconds)
- Import and use components from the library in the pages of the webstore

### In its production mode
<!-- TODO -->


