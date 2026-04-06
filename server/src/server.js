require('dotenv').config();

const { createApp } = require('./app');
const { initDatabase } = require('./db/init');

const PORT = process.env.PORT || 3040;

(async () => {
  try {
    await initDatabase();
    const app = createApp();
    const server = app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`mnozh-learning-api listening on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // eslint-disable-next-line no-console
        console.error(
          `[mnozh-learning-api] Порт ${PORT} уже занят (EADDRINUSE). Остановите другой процесс на этом порту или задайте другой PORT в server/.env`
        );
        process.exit(1);
        return;
      }
      throw err;
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
