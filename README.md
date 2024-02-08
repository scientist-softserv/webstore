# Webstore (a.k.a. Digital Storefront)

- [Getting Started](#getting-started)
  - [Creating New Pages](#creating-new-pages)
  - [Environment Variables](#environment-variables)
    - [Creating The Marketplace App](#creating-the-marketplace-app)
    - [Provider ID](#provider-id)
    - [Authentication](#authentication)
      - [Provider Credentials](#provider-credentials)
- [Webstore Component Library](#webstore-component-library)
  - [Upgrading To The Latest Version](#upgrading-to-the-latest-version)
  - [Component Library Dev Mode](#component-library-dev-mode)
- [Exception Handling](#exception-handling)
- [Linting](#linting)
- [Testing](#testing)
  - [Jest](#jest)
  - [Cypress](#cypress)
    - [Cypress ENV Variables](#cypress-env-variables)
- [Deployment](#deployment)

---

## Getting Started

  1. Confirm that your local node version is compliant with the node engine in the package.json
      - If it isn't compliant, update it. (e.g., use [Node Version Manager](https://github.com/nvm-sh/nvm))
  2. `yarn` to install automatic dependencies
  3. Configure your [environment variables](https://github.com/scientist-softserv/webstore/wiki/Environment-Variables)
  4. `yarn dev` to boot this app as a server
      - Once the logs show that the client and server have been successfully compiled, open [http://localhost:3000](http://localhost:3000) in your browser to see the result

### Creating New Pages
Create pages by adding them to the `pages` directory.
  - Reference [this documentation](https://nextjs.org/docs/basic-features/pages) for more info about pages
  - The page auto-updates as you edit the file, although there may be a few seconds delay

<!-- [API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages. -->

### Environment Variables
_The terms "client" and "provider" are fairly interchangeable in this application. In the details below we will assume that the client's name is "webstore". Their marketplace would be at "webstore.scientist.com"._

| Name | Required | Location | Description |
| ------------- | ------------- | ------------- | ------------- |
| CLIENT_ID | Yes | .env.development | The identifier of the client's marketplace application |
| CLIENT_SECRET | Yes | .env.development | The secret related to the client's marketplace application |
| NEXTAUTH_SECRET | Yes | .env.development | Used to encrypt the NextAuth.js JWT |
| NEXTAUTH_URL | Yes | .env.development | The authentication route used for NextAuth.js |
| NEXT_PUBLIC_APP_BASE_URL | Yes | .env | The URL to the deployed webstore instance |
| NEXT_PUBLIC_PROVIDER_ID | Yes | .env | The identifier of the client's marketplace in the database |
| NEXT_PUBLIC_PROVIDER_NAME | Yes | .env | The subdomain of the client's marketplace |
| NEXT_PUBLIC_SCIENTIST_API_VERSION | Yes | .env | The version of the API we should be talking to |
| NEXT_PUBLIC_TOKEN | Yes | .env.development | The access token for logged out users. Ref: Provider Credentials|
| NEXT_PUBLIC_WEBHOOK_URL | Yes | .env | The URL that defines how user notifications are sent |
| SENTRY_AUTH_TOKEN | No | .env.development | The organization based auth token for the Sentry project |
| SENTRY_DSN | No | .env.development | The Data Source Name that allows monitoring of Sentry events |
| SENTRY_ORG | No | .env.development | The slug of the Sentry organization associated with the Sentry application |
| SENTRY_PROJECT | No | .env.development | The slug of the Sentry project associated with the Sentry application |
| SENTRY_URL | No | .env.development | The base URL of the Sentry instance |

### Creating The Marketplace App
Ensure that a marketplace, e.g. client-name.scientist.com, has been created by the Scientist.com Professional Services team. Once that exists, an application needs to be created on that marketplace by a developer with the proper permissions. This is how some of the environment variables are created. You'll know if you have the proper developer permissions if once logged in on the client marketplace, you can hover over your avatar and see "Applications" underneath the "Developer" settings. _If you don't have the permissions, you need to request them, or ask someone with the permissions to complete the steps below._
- Once you've clicked the "Applications" link mentioned above, press "New Application"
  - Only the application name is required for the moment. Name it the same as the provider name.
- Save, and you should be redirected to the "Developer Details" page
- There will be a button that says "Reveal Token"
- Click it. You'll need that token in the next step.

### Provider ID
In an API GUI (e.g. Postman) make a GET request for `<marketplace>/api/v2/providers.json?q=${PROVIDER_NAME}`. Your authorization will be your token from the step above, formatted as a Bearer Token. e.g. `Bearer MY_TOKEN` Scroll to the `provider_refs` array and use the `provider_id` value to fill in the `NEXT_PUBLIC_PROVIDER_ID` variable.

### Authentication
All API endpoints in this app require some form of authentication. A logged out user will be able to access the home and browse pages using a provider credential, while a logged in user can access all pages using their own credentials.

#### Provider Credentials
Please run the following in your terminal:
``` bash
# When replacing the variables below with your actual values,
# the following code should return something like: THISISAREALLYLONGALPHANUMERICSTRING
echo -n 'CLIENT_ID:CLIENT_SECRET' | base64

# Plug that string into the following line of code, replacing the all caps values with your actual values
curl -X POST -H 'Authorization: Basic THISISAREALLYLONGALPHANUMERICSTRING' -d 'grant_type=client_credentials' https://NEXT_PUBLIC_PROVIDER_NAME.scientist.com/oauth/token/
```

The curl command will return a JSON object that has an `access_token` property. Set this as the `NEXT_PUBLIC_TOKEN`.

## Webstore Component Library
The webstore requires a [React component library](https://reactjs.org/docs/react-component.html) of view components. That dependency is packaged and released independently.

### Upgrading To The Latest Version
In the terminal:
``` bash
# first check for whether there is an updated version
yarn outdated @scientist-softserv/webstore-component-library # check the values under "current" and "latest"

# if there's an updated version
yarn upgrade @scientist-softserv/webstore-component-library --latest
```

### Component Library Dev Mode
Using the local github repository requires you to manually clone the component library to your computer, build, and link it:

#### Preparing your local copy of the component library:
_Prerequisite: clone the [webstore-component-library](https://github.com/scientist-softserv/webstore-component-library.git) and [get the app running](https://github.com/scientist-softserv/webstore-component-library#running-the-app)_

    cd webstore-component-library
    yarn link # now there is a magic symlink in `~/.config/yarn/link` usable by the webstore app

Choose one of the below:

    npm run build-lib # must be run every time you want a change to show in the webstore
    npm run watch-lib # run once and the wcl will watch for changes

#### Preparing your local copy of the webstore:

    # run in a separate terminal window than where the wcl is
    cd webstore
    yarn link "@scientist-softserv/webstore-component-library"
    yarn remove @scientist-softserv/webstore-component-library
    (restart the dev server)

#### Return to using the packaged version of the webstore-component-library:
    # in the webstore repository
    yarn unlink "@scientist-softserv/webstore-component-library"
    git checkout package.json yarn.lock
    yarn install --check-files --force
    (restart the dev server)

## Exception Handling
The application is configured to use Sentry. Refer to ".env.development.example" for how to find the necessary variables.

If any other exception handler is desired, it will require additional installation and configuration.

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
yarn jest
```

or if you want to run tests on changes, in a constant loop

```
yarn jest-watch
```

and press `a`

### Cypress
Cypress is an desktop application that runs on your computer. Cypress is already installed on this project, but your machine will need to meet certain [system requirements](https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements) to run the Cypress application.

If you meet the requirements in the Cypress docs, you can run either of the cypress scripts in package.json; one runs in the cli and the other in a browser window. From the Cypress desktop app, you will be able to create and run tests.


There are 2 types of Cypress tests, e2e & component.
  - e2e: tests entire flows of the application
  - component: tests components in isolation

If you are creating an e2e test, it will live in the `cypress/e2e` directory. Component tests will need to be created in a directory called `cypress/component `

#### Cypress ENV Variables
- the Cypress suite requires an environment variable that should be stored in your `.env`.
  - TEST_SESSION_COOKIE=
    - to get the value for this variable, open your browser to your running app at `localhost:3000`.
    - inspect the page
    - click the "Application" tab
    - click "Cookies"
    - find the value for `next-auth.session-token`
    - copy that value and paste it in the `TEST_SESSION_COOKIE` variable in your .env.development
    - do not ever commit this value
    - this value will need to be updated whenever the cookie expires, approximately once per month

<!-- ## Cutting a New Release
A git tag should exist for every release. We use `release-it` to automate the coordination of package.json and git tag.

If you want to release a new semver release run:

  ```
  yarn release # You will be prompted to select a release type, e.g. patch)
  ```

After selecting the release type you'll see the following prompts, one by one. Please respond as noted below:
``` bash
? Publish webstore to npm? # No
? Commit (Release X.X.X)? # Yes
? Tag (X.X.X)? # Yes
? Push? # Yes
```

In order to deploy this new release to staging, use the command below
``` bash
# the tag is the semver release that was created above
helm upgrade --install --kube-context=k3 --namespace=webstore-staging webstore-staging charts/webstore -f charts/webstore/values/webstore-staging.yaml --set=image.tag=X.X.X
``` -->

## Deployment
Refer to the [Wiki](https://github.com/scientist-softserv/webstore/wiki/Deployment) for the most updated information.
