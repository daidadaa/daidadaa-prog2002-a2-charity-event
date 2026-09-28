# Video demonstration outline

The brief asks for three things to be demonstrated. This outline follows that order.
Maximum length is 15 minutes.

## 1. Database and API architecture (plan and design)

1. Open `database/schema.sql` and explain the three tables:
   `organisations` and `categories` are the two lookup tables, and `events` is the main table that
   links to both through foreign keys.
2. Explain the indexes and why they exist, for example
   `idx_events_status_date (status, event_date)` matches the home page query, which filters on
   `status` and orders/filters by `event_date`.
3. Open `api/event_db.js` and explain that it creates a connection pool with `mysql2/promise`, so
   connections are reused instead of opened for every request. Point out that credentials come from
   `.env` through `dotenv`, not from hard-coded values.
4. Open `api/server.js` and walk through the shared SQL fragments `eventFields` and `eventJoins`,
   explaining that all four routes reuse the same joins.
5. Show the search route `GET /api/events` and explain how the `filters` array is built from
   whichever query parameters were supplied, then joined with `AND`. Emphasise that the user's
   values are never concatenated into the SQL string: they are passed as a separate array to
   `pool.execute`, and the `?` placeholders keep them as data rather than SQL.
6. Demonstrate the validation helpers (`parseDateValue`, `parseLocationValue`,
   `parseCategoryValue`). Show a valid request and then an invalid one, for example
   `?date=28-09-2026`, and point out the `400` response with its message.
7. Test a key endpoint in the browser or Postman, for example
   `GET /api/events?location=Lismore&category=1`.

## 2. Data flow between the API and the website

8. Explain the full path for the home page: browser requests `index.html`, the page runs
   `js/home.js`, which calls `api.get('/api/events/home')` from `js/common.js`. That helper uses
   `fetch`, parses the JSON, and throws an error if the response is not `ok`.
9. Show how the JSON response becomes HTML: `renderEventCards` calls `createEventCard` for every
   event, and each card is built with `document.createElement` and `textContent` rather than
   `innerHTML`, then inserted with `replaceChildren`.
10. Explain `date_state` (the `CASE WHEN e.event_date >= CURDATE()` expression in the SQL). The API
    returns `past` or `upcoming`, and `renderEventStateBadge` turns it into the badge on the card.
11. Show the search page flow separately: `new FormData(searchForm)` collects the fields,
    `URLSearchParams` builds the query string, and the response is rendered into the results area.
12. Explain the error path: a non-ok response becomes an error message in the status paragraph,
    which is why a `400` from the API is shown to the user rather than failing silently.

## 3. Live demonstration of the website

13. Home page: show the organisation information, the upcoming event list, the badges, and the
    local images. Point out that images are stored in `client-side/images`, so nothing depends on an
    external site.
14. Search page: filter by location, then by category, then by date, then combine two filters.
    Use Clear Filters to reset the form and the results.
15. Validation: type an impossible date such as `2026-02-30` and submit. The page reports the
    problem immediately without a request. Then show the server-side check by requesting
    `?date=28-09-2026` directly and showing the `400` response.
16. Event page: open an event from the home page and from the search results, and confirm the URL
    carries the id as a query string. Walk through the description, ticket price, the
    goal-versus-progress bar and the Register dialog, explaining that the dialog is the
    "under construction" placeholder the brief asks for.
17. Finish by summarising the data flow in one sentence: MySQL → Express route → JSON → `fetch`
    on the page → DOM elements the user sees.

## Notes to remember while recording

- Suspended events (for example Harbour Voices Concert) are filtered out by `status = 'active'`, so
  they never appear on any page — this is deliberate, not a bug.
- The event list on the home page only contains events dated today or later, which is why the past
  event (Winter Makers Auction) appears in search results but not on the home page.
