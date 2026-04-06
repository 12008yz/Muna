const { normalizeRussianMobile } = require('../utils/phone');

describe('normalizeRussianMobile', () => {
  it('принимает 11 цифр с ведущей 7', () => {
    const r = normalizeRussianMobile('+7 965 965 56 56');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('79659655656');
  });

  it('нормализует 8 в 7', () => {
    const r = normalizeRussianMobile('89659655656');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('79659655656');
  });

  it('добавляет 7 к 10 цифрам', () => {
    const r = normalizeRussianMobile('9659655656');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('79659655656');
  });

  it('отклоняет пустой ввод', () => {
    const r = normalizeRussianMobile('');
    expect(r.ok).toBe(false);
  });

  it('отклоняет неверную длину', () => {
    const r = normalizeRussianMobile('123');
    expect(r.ok).toBe(false);
  });
});
