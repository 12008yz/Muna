-- Референсная схема (таблицы создаёт Sequelize sync; файл — для DBA / ручного деплоя).
-- CREATE DATABASE mana_db;

CREATE TABLE IF NOT EXISTS consultation_leads (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(120),
  "contactMethod" VARCHAR(32),
  source VARCHAR(100),
  "privacyAccepted" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS consultation_leads_phone ON consultation_leads (phone);
CREATE INDEX IF NOT EXISTS consultation_leads_created_at ON consultation_leads ("createdAt");

CREATE TABLE IF NOT EXISTS tariffs (
  id VARCHAR(64) PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  "priceRub" INTEGER NOT NULL,
  "billingNote" VARCHAR(255) NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);
