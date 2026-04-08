const express = require('express');
const { postConsultationLead, getConsultationLeads } = require('../controllers/leads.controller');

const router = express.Router();

router.get('/consultation', getConsultationLeads);
router.post('/consultation', postConsultationLead);

module.exports = router;
