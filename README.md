# CSE 340 — Web Backend Project

This repository contains the MVC web app for the CSE 340 assignments. It uses Node.js, Express, EJS, and SQLite.

## Quick start (local)

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npm start
```

3. Open in your browser

```
http://127.0.0.1:10000/
```

The app will initialize `src/database.db` from `src/setup.sql` on first run.

## Routes
- `/` — Home
- `/categories` — Categories list
- `/category/:id` — Category details (projects in category)
- `/projects` — Upcoming projects
- `/project/:id` — Project details (includes category tags)
- `/organizations` — Organizations list
- `/organization/:id` — Organization details (projects for organization)

## Deployment (Render)
1. Create a new Web Service on Render using the GitHub repo.
2. Set the build command to `npm install` and the start command to `npm start`.
3. Ensure the service uses `Node 18+` and the `PORT` environment variable is honored by Render (the app uses `process.env.PORT`).

Notes:
- The app stores a SQLite file `src/database.db` on the instance. For persistent production data, consider using a managed DB and updating the models accordingly.

## What I changed for the W03 assignment
- Added MVC features for categories, projects, and organizations.
- Implemented category details page and links between project/category pages.
- Added `date` column for projects and implemented upcoming-projects filtering.
- Added 404 and 500 error pages and middleware.

If you want, I can also:
- Prepare a GitHub commit and push workflow (I can create a PR locally if you authorize).
- Create a minimal test script to assert route responses.
- Help configure Render deployment and produce the final GitHub + Render URLs for Canvas submission.
