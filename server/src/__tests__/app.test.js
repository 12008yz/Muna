const request = require('supertest');
const { sequelize } = require('../config/database');
const { createApp } = require('../app');
const { resetTestDatabase } = require('../db/init');

describe('HTTP API', () => {
  let app;

  beforeEach(async () => {
    await resetTestDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('mana-api');
  });

  it('неизвестный путь — 404 JSON', async () => {
    const res = await request(app).get('/api/no-such-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Not found');
  });

  it('GET /api/tariffs возвращает два тарифа', async () => {
    const res = await request(app).get('/api/tariffs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0]).toHaveProperty('priceRub');
    expect(res.body.data[0]).toHaveProperty('features');
  });

  it('GET /api/tariffs/:id', async () => {
    const res = await request(app).get('/api/tariffs/group-preparation');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toContain('Формирование');
  });

  it('GET /api/tariffs/:id 404', async () => {
    const res = await request(app).get('/api/tariffs/unknown');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/legal/privacy', async () => {
    const res = await request(app).get('/api/legal/privacy');
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Политика приватности');
    expect(res.body.data.text).toContain('MANA');
  });

  it('POST /api/leads/consultation создаёт лид', async () => {
    const res = await request(app)
      .post('/api/leads/consultation')
      .send({
        phone: '+7 965 965 56 56',
        privacyAccepted: true,
        contactMethod: 'telegram',
        name: 'Иван',
        source: 'landing',
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.phone).toBe('79659655656');
    expect(res.body.data.contactMethod).toBe('telegram');
    expect(res.body.data.name).toBe('Иван');
    expect(res.body.data.id).toBeDefined();
  });

  it('POST /api/leads/consultation без согласия — 400', async () => {
    const res = await request(app).post('/api/leads/consultation').send({
      phone: '+79659655656',
      privacyAccepted: false,
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/leads/consultation без телефона — 400', async () => {
    const res = await request(app).post('/api/leads/consultation').send({
      privacyAccepted: true,
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/leads/consultation неверный contactMethod — 400', async () => {
    const res = await request(app)
      .post('/api/leads/consultation')
      .send({
        phone: '+79659655656',
        privacyAccepted: true,
        contactMethod: 'whatsapp',
      });
    expect(res.status).toBe(400);
  });

  it('POST /api/leads/consultation contactMethod опционален', async () => {
    const res = await request(app).post('/api/leads/consultation').send({
      phone: '+79659655656',
      privacyAccepted: true,
    });
    expect(res.status).toBe(201);
    expect(res.body.data.contactMethod).toBeNull();
  });

  it('POST /api/leads/consultation contactMethod с пробелами обрезается', async () => {
    const res = await request(app)
      .post('/api/leads/consultation')
      .send({
        phone: '+79659655656',
        privacyAccepted: true,
        contactMethod: '  telegram ',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.contactMethod).toBe('telegram');
  });
});
