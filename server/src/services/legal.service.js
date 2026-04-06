/**
 * Краткий текст политики (полный — из макета / CMS). Для API — отдаём структурированный фрагмент.
 */
function getPrivacyPolicyMeta() {
  return {
    title: 'Политика приватности',
    site: 'mnozh.ru',
    updatedAt: '2026-01-01',
    operator: {
      type: 'ИП',
      name: 'ЖАРИНОВ МИХЕЙ КОНСТАНТИНОВИЧ',
      ogrnip: '2468024680248',
    },
    law: '152-ФЗ «О персональных данных»',
  };
}

function getPrivacyPolicyText() {
  const m = getPrivacyPolicyMeta();
  return [
    `${m.title} портала ${m.site}`,
    '',
    `Обработка персональных данных осуществляется в соответствии с законодательством РФ, в том числе ${m.law}.`,
    `Оператор: ${m.operator.type} ${m.operator.name}, ОГРНИП ${m.operator.ogrnip}.`,
    '',
    'Полный текст документа публикуется на сайте и может обновляться. Продолжая пользоваться порталом, вы подтверждаете ознакомление с условиями обработки данных.',
  ].join('\n');
}

module.exports = { getPrivacyPolicyMeta, getPrivacyPolicyText };
