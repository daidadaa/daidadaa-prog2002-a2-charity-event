const express = require('express');
const pool = require('../event_db');
const { parseDateValue, parseLocationValue, parseCategoryValue } = require('../validation');
const { eventFields, eventJoins } = require('../event_query');

const router = express.Router();

// Home page: active events that have not taken place yet.
router.get('/home', async (req, res) => {
  try {
    const [events] = await pool.execute(
      `SELECT ${eventFields} ${eventJoins}
       WHERE e.status = 'active' AND e.event_date >= CURDATE()
       ORDER BY e.event_date ASC`
    );
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load home page events.' });
  }
});

// Search: any combination of date, location and category.
router.get('/', async (req, res) => {
  try {
    const date = parseDateValue(req.query.date);
    const location = parseLocationValue(req.query.location);
    const category = parseCategoryValue(req.query.category);

    const invalid = [date, location, category].find((result) => result.error);
    if (invalid) {
      return res.status(400).json({ error: invalid.error });
    }

    // Suspended events are never shown; each supplied filter narrows the search.
    const filters = ["e.status = 'active'"];
    const values = [];

    if (date.value) {
      filters.push('DATE(e.event_date) = ?');
      values.push(date.value);
    }
    if (location.value) {
      filters.push('LOWER(e.location) LIKE LOWER(?)');
      values.push(`%${location.value}%`);
    }
    if (category.value) {
      filters.push('e.category_id = ?');
      values.push(category.value);
    }

    const [events] = await pool.execute(
      `SELECT ${eventFields} ${eventJoins}
       WHERE ${filters.join(' AND ')}
       ORDER BY e.event_date ASC`,
      values
    );
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to search for events.' });
  }
});

// One event, by id.
router.get('/:id', async (req, res) => {
  try {
    const eventId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(eventId) || eventId < 1) {
      return res.status(400).json({ error: 'A valid event ID is required.' });
    }

    const [events] = await pool.execute(
      `SELECT ${eventFields} ${eventJoins}
       WHERE e.event_id = ? AND e.status = 'active'`,
      [eventId]
    );
    if (events.length === 0) {
      return res.status(404).json({ error: 'This event could not be found.' });
    }
    res.json(events[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load this event.' });
  }
});

module.exports = router;
