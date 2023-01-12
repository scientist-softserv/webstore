# Webstore
## Table of Contents

- [Getting Started](#getting-started)
- [Using the component library](#using-the-component-library)
  - [In its development mode](#in-its-development-mode)
  - [In its production mode](#In-its-production-mode)
- [Linting](#linting)

---

## Getting Started

  1. Manage manual dependencies using instructions below
  2. `yarn` to install automatic dependencies
  3. `yarn dev` to boot this app as a server
  - Open [http://localhost:3000](http://localhost:3000) with your browser to see the result
  - Create pages by adding them to the `pages` directory
    - Reference [this documentation](https://nextjs.org/docs/basic-features/pages) for more info about pages
    - The page auto-updates as you edit the file, although there may be a few seconds delay

<!-- [API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages. -->

## Manual Dependency Installation

### Component Library

The webstore requires a [React component library](https://reactjs.org/docs/react-component.html), you must manually clone the component library to your computer, build, and link it:

  1. `git clone https://github.com/scientist-softserv/webstore-component-library.git`
  2. `cd webstore-component-library`
  3. `npm i`
  4. Either one-time build `npm run build-lib`, or live rebuild: `npm run watch-lib`
  5. `yarn link` to configure yarn where to find `webstore-component-library`
  6. This satisfies the `webstore-component-library` dependency, now you can switch back to `webstore`

### In its production mode
<!-- TODO -->


# Linting
``` bash
# lint all files
yarn lint

# use autocorrect
yarn lint --fix
```
