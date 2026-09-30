// charity events api
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const pool = require('./event_db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// the client folder always has these two files, so use them to check a folder
function hasClientFiles(folder) {
  return fs.existsSync(path.join(folder, 'index.html'))
    && fs.existsSync(path.join(folder, 'js', 'search.js'));
}

// the client folder may be inside a folder instead of next to it,
// for example when the two zip files are unpacked one inside the other
function lookInside(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'node_modules' || entry.name === '.git') continue;
    const sub = path.join(folder, entry.name);
    if (hasClientFiles(sub)) return sub;
  }
  return null;
}

// find the client folder
function findClient() {
  const parent = path.join(__dirname, '..');
  if (hasClientFiles(__dirname)) return __dirname;
  if (hasClientFiles(parent)) return parent;
  return lookInside(__dirname) || lookInside(parent);
}

const clientFolder = findClient();
if (clientFolder) {
  console.log('client folder: ' + clientFolder);
  app.use(express.static(clientFolder));
} else {
  console.log('cannot find the client folder, put it next to the api folder');
}

// home page events
app.get('/api/events/home', async (req, res) => {
  try {
    const [events] = await pool.execute(
      `SELECT e.event_id, e.name, e.event_date, e.location, e.purpose, e.description,
              e.ticket_price, e.fundraising_goal, e.amount_raised, e.status, e.image_url,
              c.category_id, c.name AS category_name,
              o.organisation_id, o.name AS organisation_name, o.mission AS organisation_mission,
              o.email AS organisation_email, o.phone AS organisation_phone
       FROM events e
       INNER JOIN categories c ON e.category_id = c.category_id
       INNER JOIN organisations o ON e.organisation_id = o.organisation_id
       WHERE e.status = 'active' AND e.event_date >= CURDATE()
       ORDER BY e.event_date ASC`
    );
    res.json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Unable to load home page events.' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT category_id, name, description FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Unable to load event categories.' });
  }
});

// search events by date, location and category
app.get('/api/events', async (req, res) => {
  try {
    const { date, location, category } = req.query;
    const filters = ["e.status = 'active'"];
    const values = [];

    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date + 'T00:00:00').getTime())) {
        return res.status(400).json({ error: 'Please pick a valid date.' });
      }
      filters.push('DATE(e.event_date) = ?');
      values.push(date);
    }
    if (location) {
      const place = location.trim();
      if (place) {
        filters.push('LOWER(e.location) LIKE LOWER(?)');
        values.push('%' + place + '%');
      }
    }
    if (category) {
      if (!/^\d+$/.test(category)) {
        return res.status(400).json({ error: 'Please pick a category from the list.' });
      }
      filters.push('e.category_id = ?');
      values.push(category);
    }

    const sql = `SELECT e.event_id, e.name, e.event_date, e.location, e.purpose, e.description,
                        e.ticket_price, e.fundraising_goal, e.amount_raised, e.status, e.image_url,
                        c.category_id, c.name AS category_name,
                        o.organisation_id, o.name AS organisation_name, o.mission AS organisation_mission,
                        o.email AS organisation_email, o.phone AS organisation_phone
                 FROM events e
                 INNER JOIN categories c ON e.category_id = c.category_id
                 INNER JOIN organisations o ON e.organisation_id = o.organisation_id
                 WHERE ${filters.join(' AND ')}
                 ORDER BY e.event_date ASC`;
    console.log('search:', filters.join(' AND '), values);
    const [events] = await pool.execute(sql, values);
    res.json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Unable to search for events.' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || String(id) !== req.params.id || id < 1) {
      return res.status(400).json({ error: 'A valid event ID is required.' });
    }

    const [events] = await pool.execute(
      `SELECT e.event_id, e.name, e.event_date, e.location, e.purpose, e.description,
              e.ticket_price, e.fundraising_goal, e.amount_raised, e.status, e.image_url,
              c.category_id, c.name AS category_name,
              o.organisation_id, o.name AS organisation_name, o.mission AS organisation_mission,
              o.email AS organisation_email, o.phone AS organisation_phone
       FROM events e
       INNER JOIN categories c ON e.category_id = c.category_id
       INNER JOIN organisations o ON e.organisation_id = o.organisation_id
       WHERE e.event_id = ? AND e.status = 'active'`,
      [id]
    );
    if (events.length === 0) {
      return res.status(404).json({ error: 'This event could not be found.' });
    }
    res.json(events[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Unable to load this event.' });
  }
});

app.use('/api', (req, res) => res.status(404).json({ error: 'API endpoint not found.' }));

// any other url goes back to the home page
app.use((req, res) => {
  if (clientFolder) {
    res.sendFile(path.join(clientFolder, 'index.html'));
  } else {
    res.status(404).send('The client folder was not found. Put the clientside folder next to the api folder.');
  }
});

app.listen(port, () => {
  console.log('server is running at http://localhost:' + port);
});
