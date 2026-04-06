const { Tariff } = require('../models');

function toPublicTariff(row) {
  const t = row.get ? row.get({ plain: true }) : row;
  return {
    id: t.id,
    category: t.category,
    name: t.name,
    priceRub: t.priceRub,
    billingNote: t.billingNote,
    features: t.features,
  };
}

async function getAllTariffs() {
  const rows = await Tariff.findAll({
    order: [['sortOrder', 'ASC']],
  });
  return rows.map(toPublicTariff);
}

async function getTariffById(id) {
  const row = await Tariff.findByPk(id);
  if (!row) return null;
  return toPublicTariff(row);
}

module.exports = { getAllTariffs, getTariffById };
