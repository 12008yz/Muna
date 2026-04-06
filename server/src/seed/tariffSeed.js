const { Tariff } = require('../models');
const { DEFAULT_TARIFFS } = require('./tariffSeedData');

async function seedTariffs() {
  await Tariff.bulkCreate(DEFAULT_TARIFFS);
}

/** После sync без force: заполняем только если таблица пустая. */
async function seedTariffsIfEmpty() {
  const count = await Tariff.count();
  if (count > 0) return;
  await Tariff.bulkCreate(DEFAULT_TARIFFS);
}

module.exports = { seedTariffs, seedTariffsIfEmpty, DEFAULT_TARIFFS };
