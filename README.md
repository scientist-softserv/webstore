# Webstore
## Table of Contents

- [Getting Started](#getting-started)
- [Using the component library](#using-the-component-library)
  - [In its development mode](#in-its-development-mode)
  - [In its production mode](#In-its-production-mode)
- [Linting](#linting)

---

## Getting Started

  1. Configure token to pull from the github npm repository
  2. `yarn` to install automatic dependencies
  3. `yarn dev` to boot this app as a server
  - Open [http://localhost:3000](http://localhost:3000) with your browser to see the result
  - Create pages by adding them to the `pages` directory
    - Reference [this documentation](https://nextjs.org/docs/basic-features/pages) for more info about pages
    - The page auto-updates as you edit the file, although there may be a few seconds delay

<!-- [API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages. -->

### Configure token to pull from the github npm repository

The webstore depends on a library of view components. That dependency is packaged and released independently and we fetch it from
the github npm repository, which in turn requires an auth token to pull

  1. Create classic token on your github account https://github.com/settings/tokens
  2. `echo "//npm.pkg.github.com/:_authToken=$THE_ABOVE_TOKEN_GOES_HERE" >> ~/.npmrc`

### Component Library Dev Mode

The webstore requires a [React component library](https://reactjs.org/docs/react-component.html), you must manually clone the component library to your computer, build, and link it:

Preparing your local copy of the component library:

    git clone https://github.com/scientist-softserv/webstore-component-library.git
    cd webstore-component-library
    npm install
    yarn link # now there is a magic symlink in `~/.config/yarn/link` usable by the webstore app

And you have to decide how often you want to rebuild the component library:

    npm run build-lib # for a onetime build
    npm run watch-lib # for a continuous build

Back in your webstore checkout:

    yarn link "@scientist-softserv/webstore-component-library"

and your `webstore` will start using the local component build.

If you are using a local version of the component library, you will need to temporarily delete the line `"@scientist-softserv/webstore-component-library": "VERSION_HERE",` from the `package.json` file in order to see your local changes as opposed to pulling from the github package.

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
yarn test
```

or if you want to run tests on changes, in a constant loop

```
yarn test-watch
```

and press `a`

## Cypress
Cypress is an desktop application that runs on your computer. Cypress is already installed on this project, but your machine will need to meet certain [system requirements](https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements) to run the Cypress application.

If you meet the requirements in the Cypress docs, you can run the `yarn run cypress open` command to start Cypress. from the Cypress desktop app, you will be able to create and run tests.

There are 2 types of Cypress tests, e2e & component. 
  - e2e: tests entire flows of the application
  - component: tests components in isolation

If you are creating an e2e test, it will live in the `cypress/e2e` directory. Component tests will need to be created in a directory called `cypress/component `
