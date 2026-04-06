'use client';

import { useState } from 'react';
import ConsultationModal from '@/components/modals/ConsultationModal';
import LandingHeaderBar from '@/components/landing/LandingHeaderBar';
import { OutlineCheckCircle16, OutlineCrossCircle16 } from '@/components/landing/OutlineListIcons';

const involve = {
  fontFamily: 'var(--font-involve), system-ui, sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSynthesis: 'none',
};

const FEATURES = [
  { title: '8 уроков в мес. в формате «1х11»', subtitle: 'Продолжение подготовки', enabled: true },
  { title: 'Наставление от экспертов', subtitle: 'Ведение подготовки', enabled: true },
  { title: '1 экзамен в квартал с отчетом', subtitle: 'Подтверждение подготовки', enabled: true },
  { title: 'Вознаграждение за успеваемость', subtitle: 'Геймефицирование подготовки', enabled: true },
  { title: '1000+ тестов повышенной сложности', subtitle: 'Повышение подготовки', enabled: true },
  { title: 'Не предусмотрено', subtitle: 'Не заполнено', enabled: false },
  { title: 'Не предусмотрено', subtitle: 'Не заполнено', enabled: false },
];

function FeatureRow({ title, subtitle, enabled }) {
  return (
    <div
      className="flex w-[330px] max-w-full shrink-0 items-start gap-[9px]"
      style={{
        minHeight: 40,
        opacity: enabled ? 1 : 0.25,
      }}
    >
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
        {enabled ? <OutlineCheckCircle16 /> : <OutlineCrossCircle16 />}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="m-0"
          style={{
            ...involve,
            fontSize: 16,
            lineHeight: '155%',
            color: '#101010',
          }}
        >
          {title}
        </p>
        <p
          className="m-0 mt-0.5"
          style={{
            ...involve,
            fontSize: 14,
            lineHeight: '105%',
            color: 'rgba(16, 16, 16, 0.5)',
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function GroupTrainingPage() {
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center overflow-hidden bg-[#F5F5F5]"
      style={{
        height: '100dvh',
        boxSizing: 'border-box',
        paddingTop: 'var(--sat, 0px)',
        paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div
        className="relative shrink-0 overflow-hidden bg-[#F5F5F5]"
        style={{
          width: 400,
          minWidth: 400,
          maxWidth: 400,
          height: '100dvh',
          maxHeight: '100dvh',
          boxSizing: 'border-box',
        }}
      >
        <LandingHeaderBar onConsultationClick={() => setConsultationModalOpen(true)} />

        <ConsultationModal
          isOpen={consultationModalOpen}
          onClose={() => setConsultationModalOpen(false)}
          onComplete={() => setConsultationModalOpen(false)}
        />

        {/* Rectangle 30 — макет: 5% / 5%, top 20.11%, bottom 16.67% */}
        <div
          className="absolute box-border flex min-h-0 flex-col overflow-hidden"
          style={{
            left: '5%',
            right: '5%',
            top: '20.11%',
            bottom: '16.67%',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(7.5px)',
            WebkitBackdropFilter: 'blur(7.5px)',
            borderRadius: 20,
            boxSizing: 'border-box',
            padding: 15,
            alignItems: 'center',
          }}
        >
          <header className="flex w-[330px] max-w-full flex-col" style={{ minHeight: 45 }}>
            <p
              className="m-0"
              style={{
                ...involve,
                fontSize: 14,
                lineHeight: '145%',
                color: 'rgba(16, 16, 16, 0.5)',
              }}
            >
              Подготовка к государственным экзаменам
            </p>
            <h1
              className="m-0 mt-1"
              style={{
                ...involve,
                fontSize: 18,
                lineHeight: '140%',
                color: '#101010',
              }}
            >
              Групповая подготовка
            </h1>
          </header>

          <div
            className="my-[10px] w-[330px] max-w-full shrink-0 border-0"
            style={{ borderTop: '1px solid rgba(16, 16, 16, 0.05)' }}
            role="presentation"
          />

          <div className="flex w-full max-w-[330px] flex-col gap-[5px]">
            {FEATURES.map((f, i) => (
              <FeatureRow key={i} title={f.title} subtitle={f.subtitle} enabled={f.enabled} />
            ))}
          </div>

          <div
            className="my-[10px] w-[330px] max-w-full shrink-0 border-0"
            style={{ borderTop: '1px solid rgba(16, 16, 16, 0.05)' }}
            role="presentation"
          />

          <div className="flex w-[330px] max-w-full flex-col gap-1">
            <p
              className="m-0 flex items-center"
              style={{
                ...involve,
                fontSize: 20,
                lineHeight: '125%',
                color: '#101010',
              }}
            >
              4800 руб.
            </p>
            <p
              className="m-0 flex items-center"
              style={{
                ...involve,
                fontSize: 14,
                lineHeight: '105%',
                color: 'rgba(16, 16, 16, 0.5)',
              }}
            >
              Месячная плата за один предмет
            </p>
          </div>

          <button
            type="button"
            className="mt-4 box-border flex w-[330px] max-w-full shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid outline-none transition-opacity focus:outline-none"
            style={{
              ...involve,
              height: 50,
              minHeight: 50,
              background: '#101010',
              borderColor: '#101010',
              fontSize: 16,
              lineHeight: '315%',
              color: '#FFFFFF',
              textAlign: 'center',
            }}
            onClick={() => setConsultationModalOpen(true)}
          >
            Консультирование
          </button>
        </div>
      </div>
    </div>
  );
}
