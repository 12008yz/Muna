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

/** Как во next/frontend Frame3/index.tsx — карточки от низа на 20px + safe area */
const CARD_TO_BOTTOM_GAP_PX = 20;
const CARD_HEIGHT_PX = 550;

const GROUP_FEATURES = [
  { title: '8 уроков в мес. в формате «1х11»', subtitle: 'Продолжение подготовки', enabled: true },
  { title: 'Наставление от экспертов', subtitle: 'Ведение подготовки', enabled: true },
  { title: '1 экзамен в квартал с отчетом', subtitle: 'Подтверждение подготовки', enabled: true },
  { title: 'Вознаграждение за успеваемость', subtitle: 'Геймефицирование подготовки', enabled: true },
  { title: '1000+ тестов повышенной сложности', subtitle: 'Повышение подготовки', enabled: true },
  { title: 'Не предусмотрено', subtitle: 'Не заполнено', enabled: false },
  { title: 'Не предусмотрено', subtitle: 'Не заполнено', enabled: false },
];

const PERSONAL_FEATURES = [
  { title: '8 уроков в мес. в формате «1х1»', subtitle: 'Продолжение подготовки', enabled: true },
  { title: 'Наставление от экспертов', subtitle: 'Ведение подготовки', enabled: true },
  { title: '1 экзамен в квартал с отчетом', subtitle: 'Подтверждение подготовки', enabled: true },
  { title: 'Вознаграждение за успеваемость', subtitle: 'Геймефицирование подготовки', enabled: true },
  { title: '1000+ тестов повышенной сложности', subtitle: 'Повышение подготовки', enabled: true },
  { title: 'Место', subtitle: 'Дополнение подготовки', enabled: true },
  { title: 'Место', subtitle: 'Не заполнено', enabled: true },
];

function FeatureRow({ title, subtitle, enabled }) {
  return (
    <div
      className="feature-row flex w-full min-w-0 shrink-0 items-center gap-[9px]"
      style={{
        minHeight: 40,
        opacity: enabled ? 1 : 0.25,
      }}
    >
      <span className="feature-icon flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
        {enabled ? <OutlineCheckCircle16 /> : <OutlineCrossCircle16 />}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="feature-text m-0"
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
          className="feature-desc m-0 mt-0.5"
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

/**
 * Карточка тарифа — 360×550, структура как Frame3 (шапка / фичи / футер).
 * Галочки — контурные (OutlineListIcons), не как TT Firs в Frame3.
 */
function EducationTariffCard({
  eyebrow,
  title,
  features,
  price,
  priceCaption,
  buttonLabel,
  onButtonClick,
}) {
  return (
    <div
      className="carousel-card carousel-card--shadow-top relative flex shrink-0 flex-col overflow-hidden"
      style={{
        height: CARD_HEIGHT_PX,
        minHeight: CARD_HEIGHT_PX,
        background: '#FFFFFF',
        borderRadius: 20,
        scrollSnapAlign: 'start',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: '15px 15px 0 15px', flexShrink: 0 }}>
        <p
          className="m-0"
          style={{
            ...involve,
            fontSize: 14,
            lineHeight: '145%',
            color: 'rgba(16, 16, 16, 0.5)',
            marginBottom: 4,
          }}
        >
          {eyebrow}
        </p>
        <h2
          className="m-0"
          style={{
            ...involve,
            fontSize: 18,
            lineHeight: '140%',
            color: '#101010',
          }}
        >
          {title}
        </h2>
        <div
          style={{
            marginTop: 10,
            height: 0,
            borderTop: '1px solid rgba(16, 16, 16, 0.1)',
            width: '100%',
            maxWidth: 330,
          }}
        />
      </div>

      <div
        className="features-section scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto"
        style={{ padding: '10px 15px 0 15px' }}
      >
        <div className="features-container flex flex-col gap-[5px]">
          {features.map((f, i) => (
            <FeatureRow key={i} title={f.title} subtitle={f.subtitle} enabled={f.enabled} />
          ))}
        </div>
        <div
          style={{
            marginTop: 10,
            height: 0,
            borderTop: '1px solid rgba(16, 16, 16, 0.1)',
            width: '100%',
            maxWidth: 330,
          }}
        />
      </div>

      <div style={{ padding: '20px 15px 15px 15px', flexShrink: 0 }}>
        <p
          className="m-0"
          style={{
            ...involve,
            fontSize: 20,
            lineHeight: '125%',
            color: '#101010',
            marginBottom: 4,
          }}
        >
          {price}
        </p>
        <p
          className="m-0"
          style={{
            ...involve,
            fontSize: 14,
            lineHeight: '105%',
            color: 'rgba(16, 16, 16, 0.5)',
            marginBottom: 20,
          }}
        >
          {priceCaption}
        </p>
        <button
          type="button"
          className="box-border flex w-full cursor-pointer items-center justify-center rounded-[10px] border border-solid outline-none transition-opacity focus:outline-none"
          style={{
            ...involve,
            height: 50,
            minHeight: 50,
            maxWidth: 330,
            background: '#101010',
            borderColor: '#101010',
            fontSize: 16,
            lineHeight: '315%',
            color: '#FFFFFF',
            textAlign: 'center',
          }}
          onClick={onButtonClick}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default function GroupTrainingPage() {
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);

  const openConsultation = () => setConsultationModalOpen(true);

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
        <LandingHeaderBar onConsultationClick={openConsultation} />

        <ConsultationModal
          isOpen={consultationModalOpen}
          onClose={() => setConsultationModalOpen(false)}
          onComplete={() => setConsultationModalOpen(false)}
        />

        {/* Контейнер карусели — как Frame3: 165px под шапкой, снизу 20px + safe area */}
        <div
          className="carousel-wrapper"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 'calc(var(--header-top, 50px) + 40px + 165px)',
            bottom: `calc(${CARD_TO_BOTTOM_GAP_PX}px + var(--sab, 0px))`,
            zIndex: 1,
            background: '#F5F5F5',
          }}
        >
          <div
            className="carousel-container carousel-learning scrollbar-hide flex h-full flex-nowrap items-end overflow-x-auto overflow-y-hidden"
            style={{
              gap: 5,
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="carousel-spacer-left shrink-0" aria-hidden style={{ alignSelf: 'stretch' }} />

            <EducationTariffCard
              eyebrow="Подготовка к государственным экзаменам"
              title="Групповая подготовка"
              features={GROUP_FEATURES}
              price="4800 руб."
              priceCaption="Месячная плата за один предмет"
              buttonLabel="Консультирование"
              onButtonClick={openConsultation}
            />

            <EducationTariffCard
              eyebrow="Подготовка к государственным экзаменам"
              title="Персональная подготовка"
              features={PERSONAL_FEATURES}
              price="20400 руб."
              priceCaption="Месячная плата за один предмет"
              buttonLabel="Подробнее"
              onButtonClick={openConsultation}
            />

            <div className="carousel-spacer-right shrink-0" aria-hidden style={{ alignSelf: 'stretch' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
