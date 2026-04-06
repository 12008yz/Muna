/**
 * Нормализация и проверка российского номера (как во frontend Next: 11 цифр, начало с 7).
 * @param {string|undefined|null} input
 * @returns {{ ok: true, value: string } | { ok: false, error: string }}
 */
function normalizeRussianMobile(input) {
  if (input === undefined || input === null || String(input).trim() === '') {
    return { ok: false, error: 'Phone number is required' };
  }
  let digits = String(input).replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '8') {
    digits = '7' + digits.slice(1);
  }
  if (digits.length === 10) {
    digits = '7' + digits;
  }
  if (digits.length !== 11) {
    return { ok: false, error: 'Invalid phone number format' };
  }
  if (digits[0] !== '7') {
    return { ok: false, error: 'Invalid phone number format' };
  }
  return { ok: true, value: digits };
}

module.exports = { normalizeRussianMobile };
