# CSE340 MVC Application

The default app is the W03 MVC implementation in `src/server.js`, using Express, EJS, and PostgreSQL with separate models, per-domain controllers, and `src/routes.js`. W02 remains available through `npm run start:w02`. W04 forms, sessions, and validation are also mounted in the default app and remain available through `node src/w04-server.js`.

## Run locally

1. Create a PostgreSQL database and set `DATABASE_URL` to its connection string.
2. Apply the schema and seed data with `psql "$DATABASE_URL" -f src/setup.sql`.
3. Install dependencies and start the server:

```bash
npm install
npm start
```

Open `http://localhost:3001`. Organizations and categories are listed at `/organizations` and `/categories`. `/projects` lists the next five upcoming service projects. Details are available at `/organization/:id`, `/project/:id`, and `/category/:id`. Visit `/test-error` to verify the custom 500 error page. `npm run test:w03` runs the W03 route smoke test suite.
