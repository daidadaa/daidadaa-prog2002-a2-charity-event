# Kind charity events website (PROG2002 Assessment 2)

A dynamic website for the "Kind" charity. The data is stored in MySQL, a Node.js and Express
server gives it out through a REST API, and the client pages call that API with fetch.

The brief asks for the client-side part, so this version serves the client files from the same
Express server. That keeps the API calls on the same origin, so no cross-origin setup is needed.

## Folders

- `wushaoweiA2-api` - the Node.js/Express API, the database connection and the SQL file
- `wushaoweiA2-clientside` - the three HTML pages, the stylesheet, the client JavaScript and the images

## How to run it

1. Import `wushaoweiA2-api/charityevents_db.sql` in MySQL Workbench. It creates the
   `charityevents_db` database, the three tables and the sample data.
2. Copy `wushaoweiA2-api/.env.example` to `wushaoweiA2-api/.env` and put your own MySQL
   user and password in it.
3. In the `wushaoweiA2-api` folder run `npm install`, then `npm start`.
4. Open `http://localhost:3000` in a browser. The pages must be opened through this address
   because the server is what sends the HTML, CSS, JavaScript and images to the browser.
   The API is on the same address under `/api`.

## API endpoints

| Method and path | What it returns |
| --- | --- |
| `GET /api/events/home` | active events from today on, for the home page |
| `GET /api/events` | active events filtered by `date`, `location` and `category` |
| `GET /api/categories` | the four categories, used by the search form |
| `GET /api/events/:id` | the full detail of one active event |

Only GET is used, because Assessment 2 only reads data. POST, PUT and DELETE are left for Assessment 3.
