# CSE340 W03 MVC Implementation

The W03 app uses Express, EJS, and PostgreSQL with separate model, controller, route, view, and stylesheet modules under `src/`. The Week 2 implementation remains available at `src/server.js` and through `npm run start:w02`.

## Run locally

1. Create a PostgreSQL database and set `DATABASE_URL` to its connection string.
2. Apply the schema and seed data with `psql "$DATABASE_URL" -f src/setup.sql`.
3. Install dependencies and start the server:

```bash
npm install
npm start
```

Open `http://localhost:3001`. The organization, project, and category lists are available at `/organizations`, `/projects`, and `/categories`; individual records are available at `/organization/:id`, `/project/:id`, and `/category/:id`.
