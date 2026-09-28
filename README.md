# Kind — Charity Events Website

The "Kind" charity events website for PROG2002 Assessment 2. It uses Node.js, Express, MySQL,
HTML, CSS, and vanilla JavaScript (no AngularJS).

## Requirements

- Node.js
- MySQL Server (an 8.x instance is assumed)

## Run the project

1. Import the database in MySQL Workbench by running `database/schema.sql` first and
   `database/sample_data.sql` second. The first file creates the `charityevents_db` schema, its
   three tables and the indexes; the second inserts the sample organisations, categories and events.
2. In the `api` folder, copy `.env.example` to `.env` and set your own MySQL credentials:

   ```
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=charityevents_db
   PORT=3000
   ```

3. From the `api` folder, install dependencies and start the server:

   ```powershell
   cd api
   npm install
   npm run dev
   ```

4. Open `http://localhost:3000` in a browser.

`npm run dev` uses nodemon and restarts the server when a file changes. Use `npm start` to run
without nodemon.

## Project structure

```
api/            Express server, MySQL connection pool and the route modules
api/routes/     One module per resource (events, categories)
client-side/    Pages, styles, client-side scripts and local images
database/       schema.sql creates the tables and indexes, sample_data.sql inserts the sample rows
docs/           Video demonstration outline
report/         Project report
```

## API routes

| Route | Purpose |
| --- | --- |
| `GET /api/events/home` | Active events dated today or later, for the home page |
| `GET /api/categories` | All event categories, for the search filter |
| `GET /api/events?date=YYYY-MM-DD&location=...&category=...` | Search active events by any combination of the three filters |
| `GET /api/events/:id` | Full details for one active event |

All filters on `GET /api/events` are optional. The three event routes
(`/api/events/home`, `/api/events`, `/api/events/:id`) only return events whose `status` is
`active`, so suspended events never appear on the site.

## Search parameter validation

`GET /api/events` validates every query parameter before the SQL statement runs, so invalid input
is rejected with `400` and a descriptive message instead of being sent to the database:

| Parameter | Rule | Example of a rejected value |
| --- | --- | --- |
| `date` | `YYYY-MM-DD` and a real calendar date | `28-09-2026`, `2026-02-30` |
| `location` | Not blank, at most 160 characters | `%20%20`, 161 characters |
| `category` | A positive whole number | `abc`, `0`, `-3` |

An empty value (`?date=`) means "no filter" and is accepted.

The search page repeats the date check in the browser before sending a request, so an impossible
date is reported immediately without a round trip to the server.

## Behaviour notes

- **Past and upcoming** — each event returned by the API includes a `date_state` field
  (`past` or `upcoming`) calculated from `event_date`, and the event cards display it as a badge.
- **Suspended events** — events with `status = 'suspended'` are excluded from every route and
  therefore never appear on the site.
- **Images** — event images are bundled in `client-side/images`, so the site renders correctly without
  an internet connection. Image paths in the database and CSS start with `/` so they resolve from
  the site root rather than from the folder of the stylesheet.
- **Caching** — the server sends `Cache-Control: no-store` so edits to pages, styles and images
  are visible on a normal refresh while the project is being developed.

## Testing the project

Start the server, then check:

1. **Home page** — a list of upcoming events appears, each card shows category, date and a badge,
   and the top image loads.
2. **Search page** — filter by location, category and date separately and in combination; use
   Clear Filters to reset. Entering a date such as `2026-02-30` shows a validation message.
3. **Event page** — open a card, check the description, the goal-versus-progress bar and the
   Register dialog. Confirm that `detail.html?id=1` loads the correct event.
4. **API directly** — request the routes above in a browser or Postman and confirm that a filter
   such as `?date=28-09-2026` returns `400`.

## Database design

| Table | Role |
| --- | --- |
| `organisations` | The charity that hosts events |
| `categories` | Event types such as Fun Run, Gala Dinner, Auction, Concert |
| `events` | One row per event, linked to both tables by foreign keys |

Indexes support the queries the site actually runs:

- `idx_events_status_date (status, event_date)` — used by the home page and by the active-event filter
- `idx_events_category (category_id)` — used by category filtering
- `idx_events_location (location)` — used by location searching
