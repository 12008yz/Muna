/** Дефолтные тарифы (макет Figma) — сид в БД при пустой таблице. */
const DEFAULT_TARIFFS = [
  {
    id: 'group-preparation',
    category: 'Подготовка к государственным экзаменам',
    name: 'Групповая подготовка',
    priceRub: 4800,
    billingNote: 'Месячная плата за один предмет',
    sortOrder: 0,
    features: [
      { title: '8 уроков в мес. в формате «1х11»', subtitle: 'Продолжение подготовки', included: true },
      { title: 'Наставление от экспертов', subtitle: 'Ведение подготовки', included: true },
      { title: '1 экзамен в квартал с отчетом', subtitle: 'Подтверждение подготовки', included: true },
      { title: 'Вознаграждение за успеваемость', subtitle: 'Геймифицирование подготовки', included: true },
      { title: '1000+ тестов повышенной сложности', subtitle: 'Повышение подготовки', included: true },
      { title: 'Не предусмотрено', subtitle: 'Не заполнено', included: false },
      { title: 'Не предусмотрено', subtitle: 'Не заполнено', included: false },
    ],
  },
  {
    id: 'personal-preparation',
    category: 'Подготовка к государственным экзаменам',
    name: 'Персональная подготовка',
    priceRub: 20400,
    billingNote: 'Месячная плата за один предмет',
    sortOrder: 1,
    features: [
      { title: '8 уроков в мес. в формате «1х1»', subtitle: 'Продолжение подготовки', included: true },
      { title: 'Наставление от экспертов', subtitle: 'Ведение подготовки', included: true },
      { title: '1 экзамен в квартал с отчетом', subtitle: 'Подтверждение подготовки', included: true },
      { title: 'Вознаграждение за успеваемость', subtitle: 'Геймифицирование подготовки', included: true },
      { title: '1000+ тестов повышенной сложности', subtitle: 'Повышение подготовки', included: true },
      { title: 'Место', subtitle: 'Не заполнено', included: true },
      { title: 'Место', subtitle: 'Не заполнено', included: true },
    ],
  },
];

module.exports = { DEFAULT_TARIFFS };
