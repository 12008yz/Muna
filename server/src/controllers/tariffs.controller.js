const { getAllTariffs, getTariffById } = require('../services/tariff.service');

async function listTariffs(req, res, next) {
  try {
    const data = await getAllTariffs();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getTariff(req, res, next) {
  try {
    const { id } = req.params;
    const tariff = await getTariffById(id);
    if (!tariff) {
      return res.status(404).json({ success: false, error: 'Tariff not found' });
    }
    res.status(200).json({ success: true, data: tariff });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTariffs, getTariff };
