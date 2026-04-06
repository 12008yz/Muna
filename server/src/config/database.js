require('dotenv').config();
const path = require('path');
const { Sequelize } = require('sequelize');

/**
 * - test: SQLite :memory: (Jest)
 * - DATABASE_DEV=sqlite: файл data/dev.sqlite — без PostgreSQL для локальной работы
 * - иначе: PostgreSQL (как user-service в next)
 */
function createSequelize() {
  if (process.env.NODE_ENV === 'test') {
    return new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });
  }

  if (process.env.DATABASE_DEV === 'sqlite') {
    const storage = path.join(__dirname, '..', '..', 'data', 'dev.sqlite');
    return new Sequelize({
      dialect: 'sqlite',
      storage,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    });
  }

  return new Sequelize(
    process.env.DB_NAME || 'mnozh_db',
    process.env.DB_USER || 'mnozh_user',
    process.env.DB_PASSWORD || 'mnozh_password',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

const sequelize = createSequelize();

module.exports = { sequelize };
