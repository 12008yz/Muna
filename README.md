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

## Deploy на Render

В репозитории уже добавлен `render.yaml` для автосоздания:
- PostgreSQL: `learning-db`
- API: `learning-api` (Node/Express, `server/`)
- Frontend: `learning-frontend` (Next.js, `frontend/`)

### Как развернуть

1. Запушьте проект в GitHub/GitLab.
2. В Render: **New +** → **Blueprint**.
3. Подключите репозиторий и подтвердите создание ресурсов из `render.yaml`.
4. Дождитесь статуса `Live` у `learning-api` и `learning-frontend`.

### Переменные окружения (уже заведены в Blueprint)

- API:
  - `NODE_ENV=production`
  - `DATABASE_URL` (из Render PostgreSQL)
  - `DB_SSL=true`
- Frontend:
  - `NODE_ENV=production`
  - `NEXT_PUBLIC_API_URL` (URL сервиса `learning-api`)
