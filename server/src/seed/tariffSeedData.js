/** Дефолтные тарифы (MANA) — сид в БД при пустой таблице. Идентификаторы сохранены для совместимости API. */
const DEFAULT_TARIFFS = [
  {
    id: 'group-preparation',
    category: 'Сервис MANA',
    name: 'Формирование медиа',
    priceRub: 45000,
    billingNote: 'Ориентировочная стоимость проекта',
    sortOrder: 0,
    features: [
      { title: 'Контент и визуал под задачи МСП', subtitle: 'Маркетинговый инструмент', included: true },
      { title: 'Согласование концепции и форматов', subtitle: 'Прозрачный процесс', included: true },
      { title: 'Передача материалов для публикации', subtitle: 'Готовый результат', included: true },
      { title: 'Сопровождение на этапе запуска', subtitle: 'Поддержка', included: true },
      { title: 'Не предусмотрено', subtitle: 'Не заполнено', included: false },
      { title: 'Не предусмотрено', subtitle: 'Не заполнено', included: false },
      { title: 'Не предусмотрено', subtitle: 'Не заполнено', included: false },
    ],
  },
  {
    id: 'personal-preparation',
    category: 'Сервис MANA',
    name: 'Формирование сайта',
    priceRub: 35000,
    billingNote: 'Ориентировочная стоимость проекта',
    sortOrder: 1,
    features: [
      { title: 'Структура и оформление под бренд', subtitle: 'Сайт как витрина', included: true },
      { title: 'Адаптивная вёрстка', subtitle: 'Удобство на устройствах', included: true },
      { title: 'Базовая SEO-подготовка', subtitle: 'Находимость в поиске', included: true },
      { title: 'Интеграция форм и аналитики', subtitle: 'Заявки и метрики', included: true },
      { title: 'Обучение работе с сайтом', subtitle: 'Самостоятельное ведение', included: true },
      { title: 'Не предусмотрено', subtitle: 'Не заполнено', included: false },
      { title: 'Не предусмотрено', subtitle: 'Не заполнено', included: false },
    ],
  },
];

module.exports = { DEFAULT_TARIFFS };
