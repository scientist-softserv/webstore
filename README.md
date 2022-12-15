# Webstore
## Table of Contents

- [Getting Started](#getting-started)
- [Using the component library](#using-the-component-library)
  - [In its development mode](#in-its-development-mode)
  - [In its production mode](#In-its-production-mode)
- [Linting](#linting)

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
- If you have not before, run `yarn link` in the component library repo (this establishes the library locally)
- If you have not before, run `yarn link "webstore-component-library"` in this repository (this allows us to import components from the library)
- Run `npm run watch-lib` in the component library repo (this allows rollup to rebuild the library when changes are made. there may be a delay up to 30 seconds)
- Import and use components from the library in the pages of the webstore

### In its production mode
<!-- TODO -->


# Linting
``` bash
# lint all files
yarn lint

# use autocorrect
yarn lint --fix
```

# Testing

This project uses both Cypress and Jest for testing.

## Jest
To run all jest tests for files you have changed, run
```
yarn run test
```
and press `a` to run all jest tests in the project

## Cypress
Cypress is an desktop application that runs on your computer. Cypress is already installed on this project, but your machine will need to meet certain [system requirements](https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements) to run the Cypress application.

If you meet the requirements in the Cypress docs, you can run the `yarn run cypress open` command to start Cypress. from the Cypress desktop app, you will be able to create and run tests.

There are 2 types of Cypress tests, e2e & component. 
  - e2e: tests entire flows of the application
  - component: tests components in isolation

If you are creating an e2e test, it will live in the `cypress/e2e` directory. Component tests will need to be created in a directory called `cypress/component `
