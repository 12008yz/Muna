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

    const lead = await leadService.createLead({
      phoneNormalized: phoneResult.value,
      name,
      privacyAccepted: true,
      contactMethod,
      source,
    });

    return res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { postConsultationLead };
