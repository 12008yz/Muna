# Muna — быстрый запуск после клона

**Нужно:** [Node.js 18+](https://nodejs.org/) и Git.

## 1. Клон и зависимости

```powershell
git clone https://github.com/12008yz/Muna.git
cd Muna
npm install
```

`npm install` в корне подтягивает зависимости и в `server/`, и в `frontend/` (скрипт `postinstall`). Если что-то пошло не так — выполните отдельно `npm install` в папках `server` и `frontend`.

## 2. Переменные окружения (один раз на машине)

Файлы `.env` в Git **не лежат** — их создаёте локально.

### API (`server/.env`)

**Вариант без PostgreSQL (проще всего):** SQLite, база создастся в `server/data/dev.sqlite`.

Создайте файл `server/.env` с таким содержимым:

```env
PORT=3040
NODE_ENV=development
DATABASE_DEV=sqlite
```

Можно скопировать пример и раскомментировать SQLite:

```powershell
copy server\.env.example server\.env
```

В `server/.env` оставьте строку `DATABASE_DEV=sqlite` (без одновременного «боевого» подключения к Postgres с теми же переменными, если не разбираетесь в настройке).

Если при старте API ругается на отсутствие папки под БД:

```powershell
mkdir server\data -ErrorAction SilentlyContinue
```

### Фронт (`frontend/.env.local`)

```powershell
copy frontend\.env.local.example frontend\.env.local
```

По умолчанию там `NEXT_PUBLIC_API_URL=http://localhost:3040` — так и оставьте, если API на порту **3040**.

## 3. Запуск

Из **корня** репозитория:

```powershell
npm run dev
```

Поднимутся сразу API и Next.js:

| Сервис | Адрес |
|--------|--------|
| API    | http://localhost:3040 |
| Сайт   | http://localhost:3000 |

Отдельно, если нужно только одно из них:

```powershell
npm run dev:api
npm run dev:web
```

## 4. Если порт занят

В `server/.env` поменяйте `PORT` и в `frontend/.env.local` — `NEXT_PUBLIC_API_URL` на тот же URL с новым портом.

## 5. С PostgreSQL локально

Не задавайте `DATABASE_DEV=sqlite`. Заполните в `server/.env` блок `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (как в `server/.env.example`) и поднимите Postgres с такой базой и пользователем. Схема подтянется при старте API (`sync` + сиды тарифов).

---

Кратко: **`npm install`** → **`server/.env`** (для простого старта — три строки с `DATABASE_DEV=sqlite`) → **`frontend/.env.local` из примера** → **`npm run dev`**.
