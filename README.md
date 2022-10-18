This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Run the development server:
	```bash
	yarn dev
	```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start creating pages by adding them to the `pages` directory. The page auto-updates as you edit the file.

<!-- [API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages. -->

### Using the webstore-component-library
### in its development mode
- If you have not before, run `npm link` in the component library repo (this establishes the library locally)
- If you have not before, run `npm link webstore-component-library` in this repository (this allows us to import components from the library)
- Run `npm run watch-lib` in the component library repo (this allows rollup to rebuild the library when changes are made. there may be a delay up to 30 seconds)
- Import and use components from the library in the pages of the webstore

### in its production mode
<!-- TODO -->


