# Auth Module

This module is responsible for handling user authentication and authorization.
It ships with a set of components and utils to make it easy to integrate authentication and authorization into your application.

## Usage

### Installation

```bash
pnpm i @antify/auth-module
```

Add it to your `nuxt.config.ts`:

```typescript
export default {
	modules: [
		'@antify/auth-module'
	]
}
```

### Configuration

```typescript
TODO
```

## Components

TODO:: Describe it

- Login page
- Forgot password page
- Reset password page

## E-Mail Templates

TODO:: Describe it

- Forgot password
- Reset password

## TODO::

- [ ] Fix error handling
- [ ] Change awaiting requests to async requests
- [ ] Write e mail contents
- [ ] Finish reset password process
- [ ] Add refresh token process
- [ ] Add permissions CRUD
- [ ] Add roles CRUD
- [ ] Add max tries and multiplying wait logic
- [x] Move fixtures to playground
- [x] Move user datasource to playground
- [x] Move content components to antify ui
- [ ] Reset a tags with new antify ui button which can route to "to" as a function
- [ ] Clearly separate different the auth identification (via email, username, phone, etc).
- [ ] Add multiple forgot password pages per identification type. (Send new email or send SMS etc.)

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
