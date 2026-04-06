/**
 * @param {string | undefined | null} str
 * @param {number} maxLength
 * @returns {string | null}
 */
function sanitizeString(str, maxLength = 200) {
  if (!str || typeof str !== 'string') return null;
  const sanitized = str
    .trim()
    .replace(/[<>"']/g, '')
    .slice(0, maxLength);
  return sanitized || null;
}

module.exports = { sanitizeString };
