# learning

Монорепозиторий: API (Node/Express/Sequelize) и фронт (Next.js).

## Запуск разработки

Из корня:

```bash
npm install
npm run dev
```

Один раз из корня: `npm install` ставит `concurrently` и через **`postinstall`** — зависимости в `server/` и `frontend/`. Если зависимости не подтянулись: выполните `npm install` отдельно в `server/` и в `frontend/`.

Перед первым запуском API скопируйте `server/.env.example` в `server/.env`. Для работы **без PostgreSQL** в `.env` должно быть `DATABASE_DEV=sqlite` (файл БД: `server/data/dev.sqlite`). Иначе API ожидает Postgres на `localhost:5432`.

- API: `http://localhost:3040` (см. `server/.env.example`, для локалки без Postgres — `DATABASE_DEV=sqlite`)
- Фронт: `http://localhost:3000` (шаблон `frontend/.env.local.example`)

Отдельно: `npm run dev:api`, `npm run dev:web`.
