'use client';

import { useEffect, useMemo, useState } from 'react';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3040';
const API_BASE = /^https?:\/\//i.test(RAW_API_BASE) ? RAW_API_BASE : `https://${RAW_API_BASE}`;
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
const MOCK_LEADS = [
  {
    id: 1001,
    createdAt: new Date().toISOString(),
    phone: '79999999999',
    name: 'Тестовый пользователь',
    contactMethod: 'phone',
    source: 'landing',
  },
];

function formatPhone(value) {
  const d = String(value || '').replace(/\D/g, '');
  if (d.length !== 11 || !d.startsWith('7')) return value || '—';
  return `+7 ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9, 11)}`;
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('ru-RU');
}

export default function OrdersPanelPage({ embedded = false } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (USE_MOCKS) {
          if (mounted) setItems(MOCK_LEADS);
          return;
        }
        const res = await fetch(`${API_BASE}/api/leads/consultation`, { cache: 'no-store' });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json?.success) {
          throw new Error(json?.error || 'Не удалось загрузить заявки');
        }
        if (mounted) setItems(Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        if (mounted) {
          if (USE_MOCKS) setItems(MOCK_LEADS);
          else setError(e.message || 'Ошибка загрузки');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo(
    () =>
      items.map((lead) => ({
        id: lead.id,
        createdAt: formatDate(lead.createdAt),
        phone: formatPhone(lead.phone),
        name: lead.name || '—',
        contactMethod: lead.contactMethod || '—',
        source: lead.source || '—',
        trainingType: lead.trainingType === 'group' ? 'Групповая' : lead.trainingType === 'personal' ? 'Персональная' : '—',
        grade: lead.grade != null ? `${lead.grade}` : '—',
        details: Array.isArray(lead.subjectIds) && lead.subjectIds.length
          ? `Выборы: ${lead.subjectIds.join(', ')}${lead.durationId ? `; срок: ${lead.durationId}` : ''}`
          : lead.durationId
            ? `Срок: ${lead.durationId}`
            : '—',
      })),
    [items]
  );

  return (
    <div
      className={`bg-background text-[#101010] ${
        embedded
          ? 'flex h-full min-h-0 flex-col overflow-hidden p-3 pt-2'
          : 'min-h-[100dvh] p-6 pb-[calc(1.5rem+var(--sab))]'
      }`}
      style={embedded ? undefined : { paddingTop: 'calc(24px + var(--sat, 0px))' }}
    >
      <div
        className={`mx-auto w-full max-w-[1200px] rounded-[20px] border border-[rgba(255,255,255,0.5)] p-5 shadow-[0_1px_2px_rgba(16,16,16,0.06)] ${
          embedded ? 'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden' : ''
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(7.5px)',
          WebkitBackdropFilter: 'blur(7.5px)',
        }}
      >
        <h1 className="m-0 mb-2 text-[24px] font-semibold text-[#101010]">Заявки</h1>
        <p className="m-0 mb-4 text-[14px] text-[rgba(16,16,16,0.55)]">
          Телефоны, способы связи и источник обращений из формы консультации.
        </p>

        {loading ? <p className="m-0 text-[14px]">Загрузка...</p> : null}
        {!loading && error ? <p className="m-0 text-[14px] text-red-600">{error}</p> : null}
        {!loading && !error && rows.length === 0 ? <p className="m-0 text-[14px]">Пока нет заявок.</p> : null}

        {!loading && !error && rows.length > 0 ? (
          <div
            className={`scrollbar-hide overflow-auto rounded-[12px] border border-[rgba(16,16,16,0.16)] bg-white ${
              embedded ? 'min-h-0 min-w-0 flex-1' : ''
            }`}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(7.5px)',
              WebkitBackdropFilter: 'blur(7.5px)',
            }}
          >
            <table className="w-full min-w-[980px] border-collapse text-left text-[14px] text-[#101010]">
              <thead>
                <tr className="bg-[rgba(16,16,16,0.08)] text-[#101010]">
                  <th className="px-3 py-2 font-semibold">ID</th>
                  <th className="px-3 py-2 font-semibold">Дата</th>
                  <th className="px-3 py-2 font-semibold">Телефон</th>
                  <th className="px-3 py-2 font-semibold">Имя</th>
                  <th className="px-3 py-2 font-semibold">Канал</th>
                  <th className="px-3 py-2 font-semibold">Источник</th>
                  <th className="px-3 py-2 font-semibold">Формат</th>
                  <th className="px-3 py-2 font-semibold">Этап</th>
                  <th className="px-3 py-2 font-semibold">Детали</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-[rgba(16,16,16,0.1)] bg-white text-[#101010] even:bg-[rgba(16,16,16,0.02)]">
                    <td className="px-3 py-2">{row.id}</td>
                    <td className="px-3 py-2">{row.createdAt}</td>
                    <td className="px-3 py-2">{row.phone}</td>
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.contactMethod}</td>
                    <td className="px-3 py-2">{row.source}</td>
                    <td className="px-3 py-2">{row.trainingType}</td>
                    <td className="px-3 py-2">{row.grade}</td>
                    <td className="px-3 py-2">{row.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
