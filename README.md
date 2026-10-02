# CSE340 W02 Database Retrieval

The application uses Express, EJS, and PostgreSQL. Its server, models, views, and schema are under `src/`.

## Run locally

1. Create a PostgreSQL database and set `DATABASE_URL` to its connection string.
2. Apply the schema and seed data with `psql "$DATABASE_URL" -f src/setup.sql`.
3. Install dependencies and start the server:

```bash
npm install
npm start
```

Open `http://localhost:3001`. The organization, project, and category lists are available at `/organizations`, `/projects`, and `/categories`.
