const { sequelize } = require('../config/database');
const { seedTariffsIfEmpty, seedTariffs } = require('../seed/tariffSeed');

/**
 * Продакшен/локальная разработка: как provider-service / user-service — authenticate + sync.
 */
async function initDatabase() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: false });
  await seedTariffsIfEmpty();
}

/**
 * Тесты: чистая схема + полный сид тарифов.
 */
async function resetTestDatabase() {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  await seedTariffs();
}

module.exports = { initDatabase, resetTestDatabase };
