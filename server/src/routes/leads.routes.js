const express = require('express');
const { postConsultationLead } = require('../controllers/leads.controller');

const router = express.Router();

router.post('/consultation', postConsultationLead);

module.exports = router;
