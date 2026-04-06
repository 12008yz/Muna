const express = require('express');
const { listTariffs, getTariff } = require('../controllers/tariffs.controller');

const router = express.Router();

router.get('/', listTariffs);
router.get('/:id', getTariff);

module.exports = router;
