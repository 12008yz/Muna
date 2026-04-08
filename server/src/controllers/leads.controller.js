const { normalizeRussianMobile } = require('../utils/phone');
const { sanitizeString } = require('../utils/sanitize');
const leadService = require('../services/lead.service');

/**
 * POST /api/leads/consultation
 * Тело по аналогии с POST /api/users/profile во frontend: телефон, contactMethod, плюс согласие с политикой.
 */
async function postConsultationLead(req, res, next) {
  try {
    const body = req.body || {};
    const phoneResult = normalizeRussianMobile(body.phone);
    if (!phoneResult.ok) {
      return res.status(400).json({ success: false, error: phoneResult.error });
    }

    if (body.privacyAccepted !== true) {
      return res.status(400).json({
        success: false,
        error: 'Privacy policy acceptance is required',
      });
    }

    let contactMethod = null;
    if (body.contactMethod !== undefined && body.contactMethod !== null) {
      if (typeof body.contactMethod !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Invalid contactMethod',
        });
      }
      const trimmed = body.contactMethod.trim();
      contactMethod = trimmed === '' ? null : trimmed;
    }

    if (!leadService.isValidContactMethod(contactMethod)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid contactMethod',
      });
    }

    const name = sanitizeString(body.name, 120);
    const source = sanitizeString(body.source, 100);
    const trainingTypeRaw = sanitizeString(body.trainingType, 32);
    const trainingType = trainingTypeRaw === 'group' || trainingTypeRaw === 'personal' ? trainingTypeRaw : null;
    const grade = Number.isInteger(body.grade) && body.grade >= 1 && body.grade <= 11 ? body.grade : null;
    const subjectIds = Array.isArray(body.subjectIds)
      ? body.subjectIds.filter((v) => typeof v === 'string').slice(0, 20)
      : null;
    const durationId = sanitizeString(body.durationId, 32);

    const lead = await leadService.createLead({
      phoneNormalized: phoneResult.value,
      name,
      privacyAccepted: true,
      contactMethod,
      source,
      trainingType,
      grade,
      subjectIds,
      durationId,
    });

    return res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/leads/consultation
 * Простой список всех входящих заявок для внутренней панели.
 */
async function getConsultationLeads(req, res, next) {
  try {
    const leads = await leadService.listLeads();
    return res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { postConsultationLead, getConsultationLeads };
