const path = require('path');
const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/events');
const categoryRoutes = require('./routes/categories');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// While the project is being developed, stop the browser caching pages and images
// so edits are visible on a normal refresh.
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use(express.static(path.join(__dirname, '..', 'client-side')));

app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);

app.use('/api', (req, res) => res.status(404).json({ error: 'API endpoint not found.' }));

// Any other unknown address returns the styled 404 page instead of a blank Express error.
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '..', 'client-side', '404.html'));
});

app.listen(port, () => {
  console.log(`Kind charity events app running at http://localhost:${port}`);
});
