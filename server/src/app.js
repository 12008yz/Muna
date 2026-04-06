const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorHandler');
const leadsRoutes = require('./routes/leads.routes');
const tariffsRoutes = require('./routes/tariffs.routes');
const legalRoutes = require('./routes/legal.routes');

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'mnozh-learning-api' });
  });

  app.use('/api/leads', leadsRoutes);
  app.use('/api/tariffs', tariffsRoutes);
  app.use('/api/legal', legalRoutes);

  app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Not found' });
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
