const express = require('express');
const pool = require('../event_db');

const router = express.Router();

// Every category, used to build the filter list on the search page.
router.get('/', async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT category_id, name, description FROM categories ORDER BY name ASC'
    );
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load event categories.' });
  }
});

module.exports = router;
