# learning

Монорепозиторий: API (Node/Express/Sequelize) и фронт (Next.js).

## Запуск разработки

Из корня:

```bash
npm install
npm run dev
```

- API: `http://localhost:3040` (см. `server/.env.example`, для локалки без Postgres — `DATABASE_DEV=sqlite`)
- Фронт: `http://localhost:3000` (шаблон `frontend/.env.local.example`)

Отдельно: `npm run dev:api`, `npm run dev:web`.
