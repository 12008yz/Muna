'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dispatchNavigateToOrderLanding } from '@/lib/navigateToOrderLanding';
import ConsultationFlow from '@/components/modals/ConsultationFlow';
import ManaMarketingHeader from '@/components/landing/ManaMarketingHeader';
import { OutlineCheckCircle16, OutlineCrossCircle16 } from '@/components/landing/OutlineListIcons';

const involve = {
  fontFamily: 'var(--font-involve), system-ui, sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSynthesis: 'none',
};

const EXAM_GROUP_FEATURES = [
  { title: '8 уроков в мес. в формате «1х11»', subtitle: 'Продолжение подготовки', enabled: true },
  { title: 'Наставление от экспертов', subtitle: 'Ведение подготовки', enabled: true },
  { title: '1 экзамен в квартал с отчетом', subtitle: 'Подтверждение подготовки', enabled: true },
  { title: 'Вознаграждение за успеваемость', subtitle: 'Геймефицирование подготовки', enabled: true },
  { title: '1000+ тестов повышенной сложности', subtitle: 'Повышение подготовки', enabled: true },
  { title: 'Не предусмотрено', subtitle: 'Не заполнено', enabled: false },
  { title: 'Не предусмотрено', subtitle: 'Не заполнено', enabled: false },
];

const EXAM_PERSONAL_FEATURES = [
  { title: '8 уроков в мес. в формате «1х1»', subtitle: 'Продолжение подготовки', enabled: true },
  { title: 'Наставление от экспертов', subtitle: 'Ведение подготовки', enabled: true },
  { title: '1 экзамен в квартал с отчетом', subtitle: 'Подтверждение подготовки', enabled: true },
  { title: 'Вознаграждение за успеваемость', subtitle: 'Геймефицирование подготовки', enabled: true },
  { title: '1000+ тестов повышенной сложности', subtitle: 'Повышение подготовки', enabled: true },
  { title: 'Место', subtitle: 'Дополнение подготовки', enabled: true },
  { title: 'Место', subtitle: 'Не заполнено', enabled: true },
];

const involveMana = {
  fontFamily: 'var(--font-involve), system-ui, sans-serif',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSynthesis: 'none',
};

/** Раскрывающийся блок «Информирование» — как Frame 2 в макете. */
const MANA_GLASS_INFORM_ROWS = [
  { title: 'Не заполнено', hint: 'Не заполнено' },
  { title: 'Не заполнено', hint: 'Не заполнено' },
  { title: 'Не заполнено', hint: 'Не заполнено' },
];

const DETAIL_TEXT =
  'Подготовка к экзаменам стала на изи. Подготовка к экзаменам стала на изи. Подготовка к экзаменам стала на изи. Подготовка к экзаменам стала на изи. Подготовка к экзаменам стала на изи.';

function CollapseIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17316C0.00433284 8.00042 -0.1937 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8078C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9972 7.34869 18.9427 4.80678 17.068 2.93202C15.1932 1.05727 12.6513 0.00279983 10 0ZM13.8462 10.7692H8.01058L9.775 12.5327C9.84647 12.6042 9.90316 12.689 9.94184 12.7824C9.98052 12.8758 10.0004 12.9758 10.0004 13.0769C10.0004 13.178 9.98052 13.2781 9.94184 13.3715C9.90316 13.4648 9.84647 13.5497 9.775 13.6212C9.70353 13.6926 9.61869 13.7493 9.52531 13.788C9.43193 13.8267 9.33184 13.8466 9.23077 13.8466C9.1297 13.8466 9.02962 13.8267 8.93624 13.788C8.84286 13.7493 8.75801 13.6926 8.68654 13.6212L5.60962 10.5442C5.5381 10.4728 5.48136 10.3879 5.44265 10.2946C5.40394 10.2012 5.38401 10.1011 5.38401 10C5.38401 9.89891 5.40394 9.79881 5.44265 9.70543C5.48136 9.61205 5.5381 9.52721 5.60962 9.45577L8.68654 6.37884C8.83088 6.23451 9.02665 6.15342 9.23077 6.15342C9.4349 6.15342 9.63066 6.23451 9.775 6.37884C9.91934 6.52318 10.0004 6.71895 10.0004 6.92308C10.0004 7.1272 9.91934 7.32297 9.775 7.46731L8.01058 9.23077H13.8462C14.0502 9.23077 14.2458 9.31181 14.3901 9.45607C14.5343 9.60033 14.6154 9.79599 14.6154 10C14.6154 10.204 14.5343 10.3997 14.3901 10.5439C14.2458 10.6882 14.0502 10.7692 13.8462 10.7692Z"
          fill="#101010"
        />
      </svg>
    </span>
  );
}

function LongTariffCard({ title, features }) {
  return (
    <div className="carousel-card box-border w-full shrink-0" style={{ scrollSnapAlign: 'start' }}>
      <article
        className="box-border w-full rounded-[20px] bg-white"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(7.5px)',
          height: 1360,
        }}
      >
      <div className="box-border px-[15px] pt-[15px]">
        <div style={{ width: 330, height: 45, marginBottom: 10 }}>
          <p className="m-0 flex items-center text-[14px] leading-[145%] text-[rgba(16,16,16,0.5)]" style={{ ...involve, height: 20 }}>
            Подготовка к государственным экзаменам
          </p>
          <h1 className="m-0 flex items-center text-[18px] leading-[140%] text-[#101010]" style={{ ...involve, height: 25 }}>
            {title}
          </h1>
        </div>
        <div className="h-0 w-full max-w-[330px] border-t border-[rgba(16,16,16,0.05)]" />

        <div className="mt-[10px] flex flex-col gap-[5px]">
          {features.map((feature, idx) => (
            <div key={`${feature.title}-${idx}`} className="w-[330px] max-w-full" style={{ height: 145 }}>
              <FeatureRow title={feature.title} subtitle={feature.subtitle} enabled={feature.enabled} />
              <p
                className="m-0 mt-[5px] w-[330px] max-w-full text-[16px] leading-[125%] text-[rgba(16,16,16,0.5)]"
                style={{ ...involve, height: 100 }}
              >
                {DETAIL_TEXT}
              </p>
            </div>
          ))}
        </div>

      </div>
      </article>

    </div>
  );
}

function TariffDetailsOverlay({ tariff, onCollapse, onConsultation }) {
  const scrollRef = useRef(null);
  const verticalScrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(tariff === 'personal' ? 1 : 0);
  const [priceBlockGray, setPriceBlockGray] = useState(false);

  const tariffMeta = [
    { price: '4800 руб.', buttonLabel: 'Консультирование' },
    { price: '20400 руб.', buttonLabel: 'Консультирование' },
  ];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const targetIndex = tariff === 'personal' ? 1 : 0;
    const cards = el.querySelectorAll('.carousel-card');
    const targetCard = cards[targetIndex];
    if (!targetCard) return;
    el.scrollTo({ left: targetCard.offsetLeft, behavior: 'auto' });
    setActiveIndex(targetIndex);
  }, [tariff]);

  useEffect(() => {
    const el = verticalScrollRef.current;
    if (!el) return;
    const update = () => {
      const { scrollTop, clientHeight, scrollHeight } = el;
      const canScroll = scrollHeight > clientHeight + 2;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 3;
      setPriceBlockGray(canScroll && atBottom);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      ro?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [tariff]);

  return (
    <div
      className="fixed inset-0 z-[10000] box-border flex w-full flex-col overflow-hidden bg-background text-[#101010]"
      style={{
        height: '100dvh',
        maxHeight: '100dvh',
        paddingTop: 'var(--sat, 0px)',
        boxSizing: 'border-box',
      }}
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[425px] flex-col">
        <div className="box-border shrink-0 px-[var(--main-block-margin)] pb-2 pt-[10px]">
          <button
            type="button"
            onClick={onCollapse}
            className="box-border flex h-10 w-10 items-center justify-center rounded-[20px] border border-white/50 bg-white backdrop-blur-[5px] transition-opacity hover:opacity-90"
            aria-label="Свернуть окно"
          >
            <CollapseIcon />
          </button>
          <div className="h-[10px]" aria-hidden />
        </div>

        {/* min-w-0: не растягивать flex по ширине карусели; без overflow-x-hidden — не срезать скругления карточек по краям */}
        <div ref={verticalScrollRef} className="scrollbar-hide min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className="tariff-carousel-cq-host min-w-0 w-full">
          <div
            ref={scrollRef}
            className="carousel-container scrollbar-hide flex min-h-min flex-nowrap items-start overflow-x-auto overflow-y-hidden"
            style={{
              gap: 10,
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              scrollSnapStop: 'always',
              overscrollBehaviorX: 'contain',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onScroll={() => {
              const el = scrollRef.current;
              if (!el) return;
              const cards = Array.from(el.querySelectorAll('.carousel-card'));
              if (!cards.length) return;
              let closest = 0;
              let best = Number.POSITIVE_INFINITY;
              cards.forEach((card, idx) => {
                const delta = Math.abs(card.offsetLeft - el.scrollLeft);
                if (delta < best) {
                  best = delta;
                  closest = idx;
                }
              });
              if (closest !== activeIndex) setActiveIndex(closest);
            }}
          >
            <div className="carousel-spacer-left" aria-hidden style={{ alignSelf: 'stretch' }} />
            <LongTariffCard title="Групповая подготовка" features={EXAM_GROUP_FEATURES} />
            <LongTariffCard title="Персональная подготовка" features={EXAM_PERSONAL_FEATURES} />
            <div className="carousel-spacer-right" aria-hidden style={{ alignSelf: 'stretch' }} />
          </div>
          </div>
        </div>

        {/* Задний full-bleed слой: внизу скролла — фон канваса; плашка с ценой внутри белая */}
        <div
          className={`relative z-[1] -mt-px w-full shrink-0 transition-colors duration-150 ${priceBlockGray ? 'bg-background' : 'bg-white'}`}
        >
          {/* Без тени с отрицательным offset по Y — она даёт тёмные «ушки» в скруглении; только border + overlap на 1px */}
          <div className="mx-auto box-border w-full max-w-[425px] overflow-hidden rounded-t-[20px] border-t border-[rgba(16,16,16,0.08)] bg-white">
            <div
              className="box-border w-full pt-5"
              style={{
                paddingLeft: 'calc(var(--main-block-margin) + 15px)',
                paddingRight: 'calc(var(--main-block-margin) + 15px)',
                paddingBottom: 'calc(15px + env(safe-area-inset-bottom, 0px))',
              }}
            >
              <p className="m-0 mb-1 text-[20px] leading-[125%] text-[#101010]" style={involve}>
                {tariffMeta[activeIndex].price}
              </p>
              <p className="m-0 mb-5 text-[14px] leading-[105%] text-[rgba(16,16,16,0.5)]" style={involve}>
                Месячная плата за один предмет
              </p>
              <button
                type="button"
                onClick={onConsultation}
                className="box-border flex h-[50px] w-full items-center justify-center rounded-[10px] border border-[#101010] bg-[#101010] text-center text-[16px] leading-[315%] text-white outline-none"
                style={involve}
              >
                {tariffMeta[activeIndex].buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ title, subtitle, enabled }) {
  return (
    <div
      className="feature-row flex w-full min-w-0 shrink-0 items-center gap-[9px]"
      style={{
        height: 40,
        minHeight: 40,
        opacity: enabled ? 1 : 0.25,
      }}
    >
      <span className="feature-icon flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
        {enabled ? <OutlineCheckCircle16 /> : <OutlineCrossCircle16 />}
      </span>
      <div className="min-w-0 flex-1" style={{ width: 305, minWidth: 0, height: 40 }}>
        <p
          className="feature-text m-0"
          style={{
            ...involve,
            fontSize: 16,
            lineHeight: '155%',
            color: '#101010',
            display: 'flex',
            alignItems: 'center',
            height: 25,
          }}
        >
          {title}
        </p>
        <p
          className="feature-desc m-0"
          style={{
            ...involve,
            fontSize: 14,
            lineHeight: '105%',
            color: 'rgba(16, 16, 16, 0.5)',
            display: 'flex',
            alignItems: 'center',
            height: 15,
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function ManaGlassDivider() {
  return <div className="h-0 w-full max-w-[330px] border-t border-[rgba(255,255,255,0.1)]" />;
}

/** Как в макете Frame 2: три одинаковые строки. */
const MANA_GLASS_PLACEHOLDER_ROWS = [
  { title: 'Не заполнено', hint: 'Не заполнено' },
  { title: 'Не заполнено', hint: 'Не заполнено' },
  { title: 'Не заполнено', hint: 'Не заполнено' },
];
const MANA_GLASS_SITE_ROWS = [
  { title: 'Повышение привлекательности до 65%', hint: 'Предпринимательская необходимость' },
  { title: 'Повышение удерживаемости до 65%', hint: 'Клиентская удерживаемость' },
  { title: 'Повышение лояльности до 95%', hint: 'Клиентская лояльность' },
];

function ManaGlassCheckCircle16() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="shrink-0">
      <path
        d="M11.5123 5.71846C11.5695 5.77561 11.6149 5.84348 11.6459 5.91819C11.6769 5.9929 11.6928 6.07297 11.6928 6.15384C11.6928 6.23472 11.6769 6.31479 11.6459 6.3895C11.6149 6.46421 11.5695 6.53208 11.5123 6.58923L7.20462 10.8969C7.14746 10.9541 7.07959 10.9995 7.00489 11.0305C6.93018 11.0615 6.8501 11.0774 6.76923 11.0774C6.68836 11.0774 6.60828 11.0615 6.53358 11.0305C6.45887 10.9995 6.391 10.9541 6.33385 10.8969L4.48769 9.05077C4.37222 8.9353 4.30735 8.77868 4.30735 8.61538C4.30735 8.45208 4.37222 8.29547 4.48769 8.18C4.60317 8.06453 4.75978 7.99966 4.92308 7.99966C5.08638 7.99966 5.24299 8.06453 5.35846 8.18L6.76923 9.59154L10.6415 5.71846C10.6987 5.66124 10.7666 5.61585 10.8413 5.58489C10.916 5.55392 10.9961 5.53798 11.0769 5.53798C11.1578 5.53798 11.2379 5.55392 11.3126 5.58489C11.3873 5.61585 11.4552 5.66124 11.5123 5.71846ZM16 8C16 9.58225 15.5308 11.129 14.6518 12.4446C13.7727 13.7602 12.5233 14.7855 11.0615 15.391C9.59966 15.9965 7.99113 16.155 6.43928 15.8463C4.88743 15.5376 3.46197 14.7757 2.34315 13.6569C1.22433 12.538 0.462403 11.1126 0.153721 9.56072C-0.15496 8.00887 0.00346628 6.40034 0.608967 4.93853C1.21447 3.47672 2.23985 2.22729 3.55544 1.34824C4.87103 0.469192 6.41775 0 8 0C10.121 0.00223986 12.1546 0.845814 13.6544 2.34562C15.1542 3.84542 15.9978 5.87895 16 8ZM14.7692 8C14.7692 6.66117 14.3722 5.35241 13.6284 4.23922C12.8846 3.12602 11.8274 2.25839 10.5905 1.74605C9.35356 1.2337 7.99249 1.09965 6.67939 1.36084C5.36629 1.62203 4.16013 2.26674 3.21343 3.21343C2.26674 4.16012 1.62203 5.36629 1.36084 6.67939C1.09965 7.99249 1.2337 9.35356 1.74605 10.5905C2.2584 11.8274 3.12603 12.8846 4.23922 13.6284C5.35241 14.3722 6.66117 14.7692 8 14.7692C9.79469 14.7672 11.5153 14.0534 12.7843 12.7843C14.0534 11.5153 14.7672 9.79468 14.7692 8Z"
        fill="white"
      />
    </svg>
  );
}

function ManaGiftHeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M10 17.5L8.825 16.45C4.5 12.6 1.75 10.2125 1.75 7.25C1.75 4.85 3.6 3 6 3C7.3 3 8.55 3.65 10 4.85C11.45 3.65 12.7 3 14 3C16.4 3 18.25 4.85 18.25 7.25C18.25 10.2125 15.5 12.6 11.175 16.45L10 17.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function ManaGlassChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346628 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9978 5.87895 15.1542 3.84542 13.6544 2.34562C12.1546 0.845814 10.121 0.00223986 8 0ZM8 14.7692C6.66117 14.7692 5.35241 14.3722 4.23922 13.6284C3.12603 12.8846 2.2584 11.8274 1.74605 10.5905C1.2337 9.35356 1.09965 7.99249 1.36084 6.67939C1.62203 5.36629 2.26674 4.16012 3.21343 3.21343C4.16013 2.26674 5.36629 1.62203 6.67939 1.36084C7.99249 1.09965 9.35356 1.2337 10.5905 1.74605C11.8274 2.25839 12.8846 3.12602 13.6284 4.23922C14.3722 5.35241 14.7692 6.66117 14.7692 8C14.7672 9.79468 14.0534 11.5153 12.7843 12.7843C11.5153 14.0534 9.79469 14.7672 8 14.7692ZM11.6923 8C11.6923 8.16321 11.6275 8.31973 11.5121 8.43514C11.3967 8.55055 11.2401 8.61538 11.0769 8.61538H8.61539V11.0769C8.61539 11.2401 8.55055 11.3967 8.43514 11.5121C8.31974 11.6275 8.16321 11.6923 8 11.6923C7.83679 11.6923 7.68027 11.6275 7.56486 11.5121C7.44945 11.3967 7.38462 11.2401 7.38462 11.0769V8.61538H4.92308C4.75987 8.61538 4.60334 8.55055 4.48794 8.43514C4.37253 8.31973 4.30769 8.16321 4.30769 8C4.30769 7.83679 4.37253 7.68026 4.48794 7.56486C4.60334 7.44945 4.75987 7.38461 4.92308 7.38461H7.38462V4.92308C7.38462 4.75987 7.44945 4.60334 7.56486 4.48793C7.68027 4.37253 7.83679 4.30769 8 4.30769C8.16321 4.30769 8.31974 4.37253 8.43514 4.48793C8.55055 4.60334 8.61539 4.75987 8.61539 4.92308V7.38461H11.0769C11.2401 7.38461 11.3967 7.44945 11.5121 7.56486C11.6275 7.68026 11.6923 7.83679 11.6923 8Z"
        fill="white"
      />
    </svg>
  );
}

function ManaGlassPriceFab({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(5,5,5,0.75)] backdrop-blur-[7.5px]"
      aria-label="Далее к заявке"
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path
          d="M15 7.5C15 8.98336 14.5601 10.4334 13.736 11.6668C12.9119 12.9001 11.7406 13.8614 10.3701 14.4291C8.99968 14.9967 7.49168 15.1453 6.03682 14.8559C4.58197 14.5665 3.2456 13.8522 2.1967 12.8033C1.14781 11.7544 0.433503 10.418 0.144114 8.96318C-0.145275 7.50832 0.00324963 6.00032 0.570907 4.62987C1.13856 3.25943 2.09986 2.08809 3.33323 1.26398C4.56659 0.439867 6.01664 0 7.5 0C9.48836 0.0024808 11.3946 0.793454 12.8006 2.19944C14.2065 3.60542 14.9975 5.51164 15 7.5Z"
          fill="#2525FF"
        />
        <path
          d="M8.03395 3.81418C7.9997 3.78571 7.95912 3.76589 7.91561 3.75639C7.8721 3.74689 7.82695 3.74799 7.78395 3.7596C7.74096 3.77121 7.70139 3.79298 7.66857 3.82309C7.63576 3.85319 7.61066 3.89075 7.5954 3.93258L6.83151 6.03017L5.99261 5.21732C5.96444 5.18999 5.9308 5.16895 5.8939 5.15557C5.857 5.14219 5.81769 5.13678 5.77855 5.1397C5.73941 5.14262 5.70133 5.1538 5.66683 5.17251C5.63233 5.19121 5.60218 5.21702 5.57837 5.24822C4.82628 6.23364 4.44434 7.22497 4.44434 8.19442C4.44434 9.00481 4.76626 9.78201 5.33929 10.355C5.91233 10.9281 6.68952 11.25 7.49991 11.25C8.3103 11.25 9.0875 10.9281 9.66054 10.355C10.2336 9.78201 10.5555 9.00481 10.5555 8.19442C10.5555 6.13017 8.79194 4.44439 8.03395 3.81418Z"
          fill="white"
        />
      </svg>
    </button>
  );
}

const manaGlassCardStyle = {
  boxSizing: 'border-box',
  background: 'rgba(5, 5, 5, 0.75)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(7.5px)',
  WebkitBackdropFilter: 'blur(7.5px)',
  borderRadius: 20,
};

/**
 * Первый слайд карусели на главной (MANA): тёмная стеклянная карточка по макету Figma (Rectangle 30).
 */
function ManaGlassMarketingCarouselCard({
  onArrowClick,
  onNavigateToOrder,
  initialVariant = 'content',
  allowInformSwitch = true,
  overrideTitle,
  overrideDescription,
  overridePrice,
  overrideButtonLabel,
  forceActionEnabled,
  expandedVariant,
  expandedTitleOverride,
  expandedPriceOverride,
  expandedButtonLabelOverride,
  expandedForceActionEnabled,
  arrowFlipped = true,
  expandedArrowFlipped = true,
}) {
  const isSiteVariant = initialVariant === 'site';
  const [showInformScreen, setShowInformScreen] = useState(false);
  const [leavingDown, setLeavingDown] = useState(false);
  const [baseEntering, setBaseEntering] = useState(false);
  const [expandedEntering, setExpandedEntering] = useState(false);
  const [expandedLeaving, setExpandedLeaving] = useState(false);
  const defaultTitle = isSiteVariant ? 'Формирование сайта' : 'Формирование контента';
  const defaultDescription = isSiteVariant
    ? 'Наличие комфортного сайта служит важным маркетинговым инструментом малого и среднего предпринимательства'
    : 'Наличие заразного контента служит важным маркетинговым инструментом малого и среднего предпринимательства';
  const defaultPrice = isSiteVariant ? 'около 35 тыс. р.' : 'около 45 тыс. р.';
  const cardTitle = overrideTitle || defaultTitle;
  const cardDescription = overrideDescription || defaultDescription;
  const cardPrice = overridePrice || defaultPrice;
  const isActionEnabled = typeof forceActionEnabled === 'boolean' ? forceActionEnabled : isSiteVariant;
  const actionLabel = overrideButtonLabel || (isSiteVariant ? 'Уточнение' : 'Недоступно');
  const expandedVariantResolved = expandedVariant || (isSiteVariant ? 'site' : 'content');

  const handleInformClick = () => {
    if (!allowInformSwitch || leavingDown || showInformScreen) return;
    setLeavingDown(true);
    window.setTimeout(() => {
      setShowInformScreen(true);
      setExpandedEntering(true);
      setLeavingDown(false);
      window.requestAnimationFrame(() => setExpandedEntering(false));
    }, 320);
  };

  const handleExpandedInformClick = () => {
    if (expandedLeaving || !showInformScreen) return;
    setExpandedLeaving(true);
    window.setTimeout(() => {
      setShowInformScreen(false);
      setLeavingDown(false);
      setExpandedLeaving(false);
      setBaseEntering(true);
      window.requestAnimationFrame(() => setBaseEntering(false));
    }, 320);
  };

  if (showInformScreen) {
    return (
      <ManaGlassMarketingCarouselCardTwo
        onGiftClick={() => {}}
        onArrowClick={onArrowClick}
        onNavigateToOrder={onNavigateToOrder}
        onInformClick={handleExpandedInformClick}
        variant={expandedVariantResolved}
        overrideTitle={expandedTitleOverride}
        overridePrice={expandedPriceOverride}
        overrideButtonLabel={expandedButtonLabelOverride}
        forceActionEnabled={expandedForceActionEnabled}
        arrowFlipped={expandedArrowFlipped}
        containerStyle={{
          transform: expandedEntering || expandedLeaving ? 'translateY(120%)' : 'translateY(0)',
          opacity: expandedEntering || expandedLeaving ? 0 : 1,
          transition: 'transform 320ms ease, opacity 320ms ease',
        }}
      />
    );
  }

  return (
    <div
      className="carousel-card relative flex shrink-0 flex-col overflow-hidden"
      style={{
        height: 'auto',
        alignSelf: 'flex-end',
        scrollSnapAlign: 'start',
        boxSizing: 'border-box',
        maxWidth: 'min(360px, 100%)',
        transform: leavingDown || baseEntering ? 'translateY(120%)' : 'translateY(0)',
        opacity: leavingDown || baseEntering ? 0 : 1,
        transition: 'transform 320ms ease, opacity 320ms ease',
      }}
    >
      <div className="mb-3 flex w-full items-center justify-end">
        <button
          type="button"
          onClick={onArrowClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(5,5,5,0.75)] backdrop-blur-[5px]"
          aria-label="Следующая карточка"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            style={arrowFlipped ? { transform: 'scaleX(-1)' } : undefined}
          >
            <path
              d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17316C0.00433284 8.00042 -0.1937 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8078C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9972 7.34869 18.9427 4.80678 17.068 2.93202C15.1932 1.05727 12.6513 0.00279983 10 0ZM13.8462 10.7692H8.01058L9.775 12.5327C9.84647 12.6042 9.90316 12.689 9.94184 12.7824C9.98052 12.8758 10.0004 12.9758 10.0004 13.0769C10.0004 13.178 9.98052 13.2781 9.94184 13.3715C9.90316 13.4648 9.84647 13.5497 9.775 13.6212C9.70353 13.6926 9.61869 13.7493 9.52531 13.788C9.43193 13.8267 9.33184 13.8466 9.23077 13.8466C9.1297 13.8466 9.02962 13.8267 8.93624 13.788C8.84286 13.7493 8.75801 13.6926 8.68654 13.6212L5.60962 10.5442C5.5381 10.4728 5.48136 10.3879 5.44265 10.2946C5.40394 10.2012 5.38401 10.1011 5.38401 10C5.38401 9.89891 5.40394 9.79881 5.44265 9.70543C5.48136 9.61205 5.5381 9.52721 5.60962 9.45577L8.68654 6.37884C8.83088 6.23451 9.02665 6.15342 9.23077 6.15342C9.4349 6.15342 9.63066 6.23451 9.775 6.37884C9.91934 6.52318 10.0004 6.71895 10.0004 6.92308C10.0004 7.1272 9.91934 7.32297 9.775 7.46731L8.01058 9.23077H13.8462C14.0502 9.23077 14.2458 9.31181 14.3901 9.45607C14.5343 9.60033 14.6154 9.79599 14.6154 10C14.6154 10.204 14.5343 10.3997 14.3901 10.5439C14.2458 10.6882 14.0502 10.7692 13.8462 10.7692Z"
              fill="#FFFFFF"
            />
          </svg>
        </button>
      </div>
      <article className="box-border w-full px-[15px] pb-5 pt-[15px]" style={manaGlassCardStyle}>
        <div className="w-full max-w-[330px]">
          <p
            className="m-0"
            style={{
              ...involveMana,
              fontSize: 16,
              lineHeight: '125%',
              color: 'rgba(255, 255, 255, 0.25)',
            }}
          >
            Маркетинговое сопровождение
          </p>
          <h2
            className="m-0 mt-1"
            style={{
              ...involveMana,
              fontSize: 18,
              lineHeight: '140%',
              color: '#FFFFFF',
            }}
          >
            {cardTitle}
          </h2>
          <p
            className="m-0 mt-2"
            style={{
              ...involveMana,
              fontSize: 16,
              lineHeight: '125%',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            {cardDescription}
          </p>
        </div>

        <div className="mt-4">
          <ManaGlassDivider />
        </div>

        <button
          type="button"
          className="mt-4 flex w-full max-w-[330px] cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left outline-none"
          onClick={handleInformClick}
        >
          <span className="shrink-0">
            <ManaGlassChevronRight />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block" style={{ ...involveMana, fontSize: 16, lineHeight: '155%', color: '#FFFFFF' }}>
              Информирование
            </span>
            <span className="mt-0.5 block" style={{ ...involveMana, fontSize: 14, lineHeight: '105%', color: 'rgba(255, 255, 255, 0.25)' }}>
              Нажмите здесь, если хотите открыть
            </span>
          </span>
        </button>

        <div className="mt-4">
          <ManaGlassDivider />
        </div>

        <div className="mt-4 flex max-w-[330px] items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="m-0" style={{ ...involveMana, fontSize: 20, lineHeight: '125%', color: '#FFFFFF' }}>
              {cardPrice}
            </p>
            <p className="m-0 mt-1" style={{ ...involveMana, fontSize: 14, lineHeight: '105%', color: 'rgba(255, 255, 255, 0.5)' }}>
              Рассрочка под ноль годовых до 3 мес.
            </p>
          </div>
          {typeof onNavigateToOrder === 'function' ? <ManaGlassPriceFab onClick={onNavigateToOrder} /> : null}
        </div>

        <div className="mt-4">
          <ManaGlassDivider />
        </div>

        <button
          type="button"
          disabled={!isActionEnabled}
          onClick={isActionEnabled ? onNavigateToOrder : undefined}
          className={`mt-4 box-border flex h-[50px] w-full max-w-[330px] items-center justify-center rounded-[10px] border border-solid border-white outline-none ${
            isActionEnabled ? 'cursor-pointer' : 'cursor-not-allowed'
          }`}
          style={{
            ...involveMana,
            fontSize: 16,
            lineHeight: '315%',
            color: isActionEnabled ? '#050505' : '#FFFFFF',
            background: isActionEnabled ? '#FFFFFF' : 'transparent',
            opacity: isActionEnabled ? 1 : 0.25,
          }}
        >
          {actionLabel}
        </button>
      </article>
    </div>
  );
}

/**
 * Второй слайд карусели (MANA): тёмное стекло, Frame 2, «Информирование», плашки «Подарок» и стрелка.
 */
function ManaGlassMarketingCarouselCardTwo({
  onGiftClick,
  onArrowClick,
  onNavigateToOrder,
  onInformClick,
  variant = 'content',
  overrideTitle,
  overridePrice,
  overrideButtonLabel,
  forceActionEnabled,
  arrowFlipped = true,
  containerStyle,
}) {
  const isSiteVariant = variant === 'site';
  const expandedTitle = overrideTitle || (isSiteVariant ? 'Формирование сайта' : 'Формирование контента');
  const expandedPrice = overridePrice || (isSiteVariant ? 'около 35 тыс. р.' : 'около 45 тыс. р.');
  const expandedRows = isSiteVariant ? MANA_GLASS_SITE_ROWS : MANA_GLASS_PLACEHOLDER_ROWS;
  const expandedButtonLabel = overrideButtonLabel || (isSiteVariant ? 'Уточнение' : 'Недоступно');
  const expandedButtonDisabled =
    typeof forceActionEnabled === 'boolean' ? !forceActionEnabled : !isSiteVariant;
  const topRowClass = isSiteVariant
    ? 'mb-[10px] flex w-full shrink-0 items-center justify-between'
    : 'mb-3 flex w-full shrink-0 items-center justify-between';
  const giftButtonClass = isSiteVariant
    ? 'flex h-10 w-[115px] items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#050505] pl-[10px] pr-[12px] backdrop-blur-[5px]'
    : 'flex h-10 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#050505] px-3 backdrop-blur-[5px]';
  const articlePaddingClass = isSiteVariant ? 'box-border w-full px-[15px] pb-[15px] pt-[15px]' : 'box-border w-full px-[15px] pb-5 pt-[15px]';
  const dividerGap = isSiteVariant ? 'mt-[10px]' : 'mt-[10px]';
  const infoGap = isSiteVariant ? 'mt-[10px]' : 'mt-[10px]';
  const priceGap = isSiteVariant ? 'mt-[10px]' : 'mt-[10px]';

  return (
    <div
      className="carousel-card relative flex shrink-0 flex-col overflow-hidden"
      style={{
        height: 'auto',
        alignSelf: 'flex-end',
        scrollSnapAlign: 'start',
        boxSizing: 'border-box',
        maxWidth: 'min(360px, 100%)',
        ...containerStyle,
      }}
    >
      <div className={topRowClass}>
        <button
          type="button"
          onClick={onGiftClick}
          className={giftButtonClass}
          style={{ ...involveMana, fontSize: 14, lineHeight: '145%', color: '#FFFFFF' }}
        >
          <ManaGiftHeartIcon />
          Подарок
        </button>
        <button
          type="button"
          onClick={onArrowClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(5,5,5,0.75)] backdrop-blur-[5px]"
          aria-label="Далее"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            style={arrowFlipped ? { transform: 'scaleX(-1)' } : undefined}
          >
            <path
              d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17316C0.00433284 8.00042 -0.1937 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8078C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9972 7.34869 18.9427 4.80678 17.068 2.93202C15.1932 1.05727 12.6513 0.00279983 10 0ZM13.8462 10.7692H8.01058L9.775 12.5327C9.84647 12.6042 9.90316 12.689 9.94184 12.7824C9.98052 12.8758 10.0004 12.9758 10.0004 13.0769C10.0004 13.178 9.98052 13.2781 9.94184 13.3715C9.90316 13.4648 9.84647 13.5497 9.775 13.6212C9.70353 13.6926 9.61869 13.7493 9.52531 13.788C9.43193 13.8267 9.33184 13.8466 9.23077 13.8466C9.1297 13.8466 9.02962 13.8267 8.93624 13.788C8.84286 13.7493 8.75801 13.6926 8.68654 13.6212L5.60962 10.5442C5.5381 10.4728 5.48136 10.3879 5.44265 10.2946C5.40394 10.2012 5.38401 10.1011 5.38401 10C5.38401 9.89891 5.40394 9.79881 5.44265 9.70543C5.48136 9.61205 5.5381 9.52721 5.60962 9.45577L8.68654 6.37884C8.83088 6.23451 9.02665 6.15342 9.23077 6.15342C9.4349 6.15342 9.63066 6.23451 9.775 6.37884C9.91934 6.52318 10.0004 6.71895 10.0004 6.92308C10.0004 7.1272 9.91934 7.32297 9.775 7.46731L8.01058 9.23077H13.8462C14.0502 9.23077 14.2458 9.31181 14.3901 9.45607C14.5343 9.60033 14.6154 9.79599 14.6154 10C14.6154 10.204 14.5343 10.3997 14.3901 10.5439C14.2458 10.6882 14.0502 10.7692 13.8462 10.7692Z"
              fill="#FFFFFF"
            />
          </svg>
        </button>
      </div>

      <article className={articlePaddingClass} style={manaGlassCardStyle}>
        <div className="w-full max-w-[330px]">
          <p
            className="m-0"
            style={{
              ...involveMana,
              fontSize: 16,
              lineHeight: '125%',
              color: 'rgba(255, 255, 255, 0.25)',
            }}
          >
            Маркетинговое сопровождение
          </p>
          <h2
            className="m-0 mt-1"
            style={{
              ...involveMana,
              fontSize: 18,
              lineHeight: '140%',
              color: '#FFFFFF',
            }}
          >
            {expandedTitle}
          </h2>
        </div>

        <div className={dividerGap}>
          <ManaGlassDivider />
        </div>

        <div className="mt-[10px] flex max-w-[330px] flex-col gap-[5px]">
          {expandedRows.map((row, idx) => (
            <div key={`mana-ph-${idx}`} className="flex items-center gap-2">
              <span className="shrink-0 self-center">
                <ManaGlassCheckCircle16 />
              </span>
              <span className="min-w-0">
                <span className="block" style={{ ...involveMana, fontSize: 16, lineHeight: '155%', color: '#FFFFFF' }}>
                  {row.title}
                </span>
                <span className="mt-0.5 block" style={{ ...involveMana, fontSize: 14, lineHeight: '105%', color: 'rgba(255, 255, 255, 0.25)' }}>
                  {row.hint}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className={dividerGap}>
          <ManaGlassDivider />
        </div>

        <button
          type="button"
          className={`${infoGap} flex w-full max-w-[330px] cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left outline-none`}
          onClick={onInformClick}
        >
          <span className="shrink-0">
            <ManaGlassChevronRight />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block" style={{ ...involveMana, fontSize: 16, lineHeight: '155%', color: '#FFFFFF' }}>
              Информирование
            </span>
            <span className="mt-0.5 block" style={{ ...involveMana, fontSize: 14, lineHeight: '105%', color: 'rgba(255, 255, 255, 0.25)' }}>
              Нажмите здесь, если хотите открыть
            </span>
          </span>
        </button>

        <div className={dividerGap}>
          <ManaGlassDivider />
        </div>

        <div className={`${priceGap} flex max-w-[330px] items-start justify-between gap-3`}>
          <div className="min-w-0 flex-1">
            <p className="m-0" style={{ ...involveMana, fontSize: 20, lineHeight: '125%', color: '#FFFFFF' }}>
              {expandedPrice}
            </p>
            <p className="m-0 mt-1" style={{ ...involveMana, fontSize: 14, lineHeight: '105%', color: 'rgba(255, 255, 255, 0.5)' }}>
              Рассрочка под ноль годовых до 3 мес.
            </p>
          </div>
          {typeof onNavigateToOrder === 'function' ? <ManaGlassPriceFab onClick={onNavigateToOrder} /> : null}
        </div>

        <div className={dividerGap}>
          <ManaGlassDivider />
        </div>

        <button
          type="button"
          disabled={expandedButtonDisabled}
          className={`mt-4 box-border flex h-[50px] w-full max-w-[330px] items-center justify-center rounded-[10px] border border-solid border-white outline-none ${
            expandedButtonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          style={{
            ...involveMana,
            fontSize: 16,
            lineHeight: '315%',
            color: '#050505',
            background: '#FFFFFF',
            opacity: expandedButtonDisabled ? 0.25 : 1,
          }}
        >
          {expandedButtonLabel}
        </button>
      </article>
    </div>
  );
}

/**
 * Карточка тарифа — структура как Frame3 (шапка / фичи / футер).
 * Высота по контенту: фиксированная 550px + flex-1 на середине давали пустоту между списком и ценой.
 */
function EducationTariffCard({
  eyebrow,
  title,
  intro,
  features,
  price,
  priceCaption,
  buttonLabel,
  onButtonClick,
}) {
  return (
    <div
      className="carousel-card relative flex shrink-0 flex-col overflow-hidden"
      style={{
        height: 'auto',
        alignSelf: 'flex-end',
        background: '#FFFFFF',
        borderRadius: 20,
        scrollSnapAlign: 'start',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: '15px 15px 0 15px', flexShrink: 0 }}>
        <div style={{ width: 330, maxWidth: '100%', marginBottom: 10 }}>
        <p
          className="m-0"
          style={{
            ...involve,
            fontSize: 14,
            lineHeight: '145%',
            color: 'rgba(16, 16, 16, 0.5)',
            marginBottom: 0,
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
            marginTop: 0,
          }}
        >
          {title}
        </h2>
        {intro ? (
          <p
            className="m-0 mt-2"
            style={{
              ...involve,
              fontSize: 16,
              lineHeight: '125%',
              color: 'rgba(16, 16, 16, 0.5)',
            }}
          >
            {intro}
          </p>
        ) : null}
        </div>
        <div
          style={{
            marginTop: 0,
            height: 0,
            borderTop: '1px solid rgba(16, 16, 16, 0.1)',
            width: '100%',
            maxWidth: 330,
          }}
        />
      </div>

      <div
        className="features-section scrollbar-hide flex flex-col overflow-hidden"
        style={{ marginTop: 10, padding: '0 15px 0 15px' }}
      >
        <div className="features-container flex flex-col" style={{ gap: 5 }}>
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

      <div
        style={{
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 15,
          paddingBottom: 20,
          flexShrink: 0,
        }}
      >
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

export default function GroupTrainingPage({ layout = 'viewport', exposeOpenConsultation, scrollNavigate } = {}) {
  const router = useRouter();
  const isStacked = layout === 'stacked';
  const stackedCarouselRef = useRef(null);
  const [consultationFlowOpen, setConsultationFlowOpen] = useState(false);
  const [detailsTariff] = useState(null);

  const openConsultation = () => {
    setDetailsTariff(null);
    setConsultationFlowOpen(true);
  };

  useEffect(() => {
    if (!isStacked || typeof exposeOpenConsultation !== 'function') return;
    exposeOpenConsultation(() => {
      setDetailsTariff(null);
      setConsultationFlowOpen(true);
    });
    return () => exposeOpenConsultation(null);
  }, [isStacked, exposeOpenConsultation]);
  const openTariffDetails = () => {
    if (isStacked && scrollNavigate?.toHero) {
      scrollNavigate.toHero();
      return;
    }
    router.push('/');
  };
  const closeTariffDetails = () => {
    dispatchNavigateToOrderLanding();
    setDetailsTariff(null);
  };

  const carouselTop = isStacked
    ? 'clamp(12px, 3vh, 36px)'
    : 'calc(var(--header-top, 50px) + 40px + clamp(45px, 8vh, 95px))';

  const mainColumnHeight = isStacked ? '100%' : '100dvh';

  const examTariffCards = [
    {
      eyebrow: 'Подготовка к государственным экзаменам',
      title: 'Групповая подготовка',
      intro: undefined,
      features: EXAM_GROUP_FEATURES,
      price: '4800 руб.',
      priceCaption: 'Месячная плата за один предмет',
      buttonLabel: 'Консультирование',
    },
    {
      eyebrow: 'Подготовка к государственным экзаменам',
      title: 'Персональная подготовка',
      intro: undefined,
      features: EXAM_PERSONAL_FEATURES,
      price: '20400 руб.',
      priceCaption: 'Месячная плата за один предмет',
      buttonLabel: 'Консультирование',
    },
  ];
  const [examCardA, examCardB] = examTariffCards;

  const scrollStackedCarouselToNext = () => {
    const el = stackedCarouselRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll('.carousel-card'));
    if (!cards.length) return;

    let currentIndex = 0;
    let smallestDelta = Number.POSITIVE_INFINITY;
    cards.forEach((card, idx) => {
      const delta = Math.abs(card.offsetLeft - el.scrollLeft);
      if (delta < smallestDelta) {
        smallestDelta = delta;
        currentIndex = idx;
      }
    });

    const nextIndex = (currentIndex + 1) % cards.length;
    const nextCard = cards[nextIndex];
    if (!nextCard) return;
    el.scrollTo({ left: nextCard.offsetLeft, behavior: 'smooth' });
  };

  const scrollStackedCarouselToFirst = () => {
    const el = stackedCarouselRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll('.carousel-card'));
    const firstCard = cards[0];
    if (!firstCard) return;
    el.scrollTo({ left: firstCard.offsetLeft, behavior: 'smooth' });
  };

  return (
    <>
      {detailsTariff ? (
        <TariffDetailsOverlay
          tariff={detailsTariff}
          onCollapse={closeTariffDetails}
          onConsultation={openConsultation}
        />
      ) : (
        <div
          className={
            isStacked
              ? 'relative z-0 flex h-full min-h-0 w-full min-w-0 flex-col items-stretch overflow-hidden bg-background'
              : 'fixed inset-0 z-[9999] flex w-full min-w-0 flex-col items-stretch overflow-hidden bg-background'
          }
          style={
            isStacked
              ? {
                  height: '100%',
                  minHeight: 0,
                  boxSizing: 'border-box',
                  paddingBottom: 'calc(var(--main-block-margin) + env(safe-area-inset-bottom, 0px))',
                }
              : {
                  height: '100dvh',
                  boxSizing: 'border-box',
                  paddingTop: 'var(--sat, 0px)',
                  paddingBottom: 'calc(var(--main-block-margin) + env(safe-area-inset-bottom, 0px))',
                }
          }
        >
          <div
            className="relative min-h-0 min-w-0 shrink-0 overflow-hidden bg-background"
            style={{
              width: '100%',
              maxWidth: '425px',
              height: mainColumnHeight,
              maxHeight: mainColumnHeight,
              boxSizing: 'border-box',
            }}
          >
            {!isStacked ? <ManaMarketingHeader onConsultationClick={openConsultation} menuHref="/" /> : null}

            {/* Контейнер карусели: адаптивный верхний отступ, чтобы в in-app браузерах карточки не обрезались */}
            <div
              className="tariff-carousel-cq-host carousel-wrapper flex min-h-0 min-w-0 flex-col justify-end"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: carouselTop,
                bottom: 0,
                zIndex: 1,
                background: 'var(--background)',
              }}
            >
              {/* Ряд без h-full: иначе cross-size строки = высота вьюпорта и карточка «растягивается» с пустотой под контентом */}
              <div
                ref={stackedCarouselRef}
                className="carousel-container carousel-learning scrollbar-hide box-border flex w-full max-h-full min-h-0 flex-nowrap items-end overflow-x-auto overflow-y-visible"
                style={{
                  height: 'auto',
                  gap: 10,
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'smooth',
                  scrollSnapStop: 'always',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  overscrollBehaviorX: 'contain',
                }}
              >
                <div className="carousel-spacer-left shrink-0" aria-hidden />

                {isStacked ? (
                  <ManaGlassMarketingCarouselCard
                    onArrowClick={scrollStackedCarouselToNext}
                    onNavigateToOrder={() => scrollNavigate?.toOrder?.()}
                  />
                ) : (
                  <EducationTariffCard
                    eyebrow={examCardA.eyebrow}
                    title={examCardA.title}
                    intro={examCardA.intro}
                    features={examCardA.features}
                    price={examCardA.price}
                    priceCaption={examCardA.priceCaption}
                    buttonLabel={examCardA.buttonLabel}
                    onButtonClick={openTariffDetails}
                  />
                )}

                {isStacked ? (
                  <ManaGlassMarketingCarouselCard
                    initialVariant="site"
                    allowInformSwitch
                    onArrowClick={scrollStackedCarouselToNext}
                    onNavigateToOrder={() => scrollNavigate?.toOrder?.()}
                  />
                ) : (
                  <EducationTariffCard
                    eyebrow={examCardB.eyebrow}
                    title={examCardB.title}
                    intro={examCardB.intro}
                    features={examCardB.features}
                    price={examCardB.price}
                    priceCaption={examCardB.priceCaption}
                    buttonLabel={examCardB.buttonLabel}
                    onButtonClick={openTariffDetails}
                  />
                )}

                {isStacked ? (
                  <ManaGlassMarketingCarouselCard
                    initialVariant="site"
                    allowInformSwitch
                    overrideTitle="Формирование имиджа"
                    overrideDescription="Наличие достойного имиджа служит важным маркетинговым инструментом малого и среднего предпринимательства"
                    overridePrice="около 35 тыс. р."
                    overrideButtonLabel="Уточнение"
                    forceActionEnabled
                    expandedVariant="content"
                    expandedTitleOverride="Формирование имиджа"
                    expandedPriceOverride="около 35 тыс. р."
                    expandedButtonLabelOverride="Уточнение"
                    expandedForceActionEnabled
                    arrowFlipped={false}
                    expandedArrowFlipped={false}
                    onArrowClick={scrollStackedCarouselToFirst}
                    onNavigateToOrder={() => scrollNavigate?.toOrder?.()}
                  />
                ) : null}

                <div className="carousel-spacer-right shrink-0" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      )}

      {consultationFlowOpen ? (
        <ConsultationFlow
          onClose={() => setConsultationFlowOpen(false)}
          onSkip={() => setConsultationFlowOpen(false)}
          onSubmit={(payload) => {
            setConsultationFlowOpen(false);
            if (payload?.method === 'phone') {
              if (isStacked && scrollNavigate?.toHero) scrollNavigate.toHero();
              else router.push('/');
            } else if (isStacked && scrollNavigate?.toOrder) {
              scrollNavigate.toOrder();
            } else {
              router.push('/order');
            }
          }}
          initialStep="contact-method"
        />
      ) : null}
    </>
  );
}
