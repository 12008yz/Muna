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
  });
  return row.get({ plain: true });
}

function isValidContactMethod(value) {
  if (value === undefined || value === null) return true;
  return VALID_CONTACT_METHODS.has(value);
}

module.exports = {
  createLead,
  isValidContactMethod,
  VALID_CONTACT_METHODS,
};
