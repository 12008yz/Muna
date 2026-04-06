const express = require('express');
const { getPrivacy } = require('../controllers/legal.controller');

const router = express.Router();

router.get('/privacy', getPrivacy);

module.exports = router;
