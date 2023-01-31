# Webstore
## Table of Contents

- [Getting Started](#getting-started)
  - [Webstore Component Library](#webstore-component-library)
    - [Configure token to pull from the github npm repository](#configure-token-to-pull-from-the-github-npm-repository)
    - [Component Library Dev Mode](#component-library-dev-mode)
  - [Environment Variables](#environment-variables)
    - [Authentication](#authentication)
      - [User Credentials](#user-credentials)
      - [Provider Credentials](#provider-credentials)
- [Linting](#linting)
- [Testing](#testing)
  - [Jest](#jest)
  - [Cypress](#cypress)

---

## Getting Started

  1. [Configure token to pull from the github npm repository](configure-token-to-pull-from-the-github-npm-repository)
  2. Confirm that your local node version is compliant with the node engine in the package.json
  2. `yarn` to install automatic dependencies
  3. `yarn dev` to boot this app as a server
  - Open [http://localhost:3000](http://localhost:3000) with your browser to see the result
  - Create pages by adding them to the `pages` directory
    - Reference [this documentation](https://nextjs.org/docs/basic-features/pages) for more info about pages
    - The page auto-updates as you edit the file, although there may be a few seconds delay

<!-- [API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages. -->

### Webstore Component Library
The webstore requires a [React component library](https://reactjs.org/docs/react-component.html) of view components. That dependency is packaged and released independently and we fetch it from the github repository.

#### Configure token to pull from the github npm repository
Using the published github npm package requires an auth token to pull:

  1. Create a classic token on your github account https://github.com/settings/tokens
  2. `echo "//npm.pkg.github.com/:_authToken=$THE_ABOVE_TOKEN_GOES_HERE" >> ~/.npmrc`

#### Component Library Dev Mode
Using the local github repository requires you to manually clone the component library to your computer, build, and link it:

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

### Environment Variables
Configure the environment variables below in your local and published application to ensure that it works.

#### Provider
Someone with access to the api needs to visit `/providers.json?q=${YOUR_PROVIDER_NAME}` to find your provider object and id. Once found, update the variable below.

``` bash
# .env
NEXT_PUBLIC_PROVIDER_NAME # e.g.: acme
NEXT_PUBLIC_PROVIDER_ID # e.g.: 500
```

#### Authentication
All API endpoints in this app require some form of authentication. A logged out user will be able to access the home and browse pages using a provider credential, while a logged in user can access all pages using their own credentials.

##### User Credentials
``` bash
# .env.local
NEXTAUTH_SECRET # create this by running `openssl rand -base64 32` in your terminal
CLIENT_ID # retrieved from the provider storefront
CLIENT_SECRET # retrieved from the provider storefront
```

##### Provider Credentials
Please run the following in your terminal:
``` bash
# When replacing the variables below with your actual values,
# the following code should return something like: THISISAREALLYLONGALPHANUMERICSTRING
echo -n 'CLIENT_ID:CLIENT_SECRET' | base64

# Plug that string into the following line of code, replacing the all caps values with your actual values
curl -X POST -H 'Authorization: Basic THISISAREALLYLONGALPHANUMERICSTRING' -d 'grant_type=client_credentials' https://NEXT_PUBLIC_PROVIDER_NAME.scientist.com/oauth/token/
```

The curl command will return a JSON object that has an `access_token` property. Store the value of that property as shown below:

``` bash
# .env.local
NEXT_PUBLIC_TOKEN
```

## Linting
``` bash
# lint all files
yarn lint

# use autocorrect
yarn lint --fix
```

## Testing

This project uses both Cypress and Jest for testing.

### Jest

To run all jest tests for files you have changed, run
```
yarn test
```

or if you want to run tests on changes, in a constant loop

```
yarn test-watch
```

and press `a`

### Cypress
Cypress is an desktop application that runs on your computer. Cypress is already installed on this project, but your machine will need to meet certain [system requirements](https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements) to run the Cypress application.

If you meet the requirements in the Cypress docs, you can run the `yarn run cypress open` command to start Cypress. from the Cypress desktop app, you will be able to create and run tests.

There are 2 types of Cypress tests, e2e & component.
  - e2e: tests entire flows of the application
  - component: tests components in isolation

If you are creating an e2e test, it will live in the `cypress/e2e` directory. Component tests will need to be created in a directory called `cypress/component `
