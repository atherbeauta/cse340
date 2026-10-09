# CSE340 MVC Application

The default app is the W03 MVC implementation, using Express, EJS, and PostgreSQL with separate models, controllers, routes, and views. W02 remains available through `npm run start:w02`. W04 forms, sessions, and validation are available by running `node src/w04-server.js`.

## Run locally

1. Create a PostgreSQL database and set `DATABASE_URL` to its connection string.
2. Apply the schema and seed data with `psql "$DATABASE_URL" -f src/setup.sql`.
3. Install dependencies and start the server:

```bash
npm install
npm start
```

Open `http://localhost:3001`. Lists are available at `/organizations`, `/projects`, and `/categories`; details are available at `/organization/:id`, `/project/:id`, and `/category/:id`.
