const { ConsultationLead } = require('../models');

const VALID_CONTACT_METHODS = new Set(['max', 'telegram', 'phone']);

/**
 * @param {object} payload
 * @param {string} payload.phoneNormalized
 * @param {string | null} [payload.name]
 * @param {boolean} payload.privacyAccepted
 * @param {string | null} [payload.contactMethod]
 * @param {string | null} [payload.source]
 */
async function createLead(payload) {
  const row = await ConsultationLead.create({
    phone: payload.phoneNormalized,
    name: payload.name ?? null,
    privacyAccepted: payload.privacyAccepted,
    contactMethod: payload.contactMethod ?? null,
    source: payload.source ?? null,
    trainingType: payload.trainingType ?? null,
    grade: payload.grade ?? null,
    subjectIds: payload.subjectIds ?? null,
    durationId: payload.durationId ?? null,
  });
  return row.get({ plain: true });
}

async function listLeads() {
  const rows = await ConsultationLead.findAll({
    order: [['createdAt', 'DESC']],
    limit: 500,
  });
  return rows.map((row) => row.get({ plain: true }));
}

function isValidContactMethod(value) {
  if (value === undefined || value === null) return true;
  return VALID_CONTACT_METHODS.has(value);
}

module.exports = {
  createLead,
  listLeads,
  isValidContactMethod,
  VALID_CONTACT_METHODS,
};
