const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Заявка на консультацию (аналог публичного POST профиля по телефону в next, но отдельная сущность — история обращений).
 */
const ConsultationLead = sequelize.define(
  'ConsultationLead',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Нормализованный номер 7XXXXXXXXXX',
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    contactMethod: {
      type: DataTypes.STRING(32),
      allowNull: true,
      comment: 'max | telegram | phone',
    },
    source: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'landing, tariff-page, …',
    },
    privacyAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'consultation_leads',
    timestamps: true,
    indexes: [{ fields: ['phone'] }, { fields: ['createdAt'] }],
  }
);

/**
 * Тарифы для витрины (как справочник в provider-service; правки через БД / админку позже).
 */
const Tariff = sequelize.define(
  'Tariff',
  {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    priceRub: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    billingNote: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: '[{ title, subtitle, included }]',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'tariffs',
    timestamps: true,
  }
);

module.exports = { sequelize, ConsultationLead, Tariff };
