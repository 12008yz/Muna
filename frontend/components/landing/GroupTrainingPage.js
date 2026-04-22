'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dispatchNavigateToOrderLanding } from '@/lib/navigateToOrderLanding';
import ConsultationFlow from '@/components/modals/ConsultationFlow';
import LandingHeaderBar from '@/components/landing/LandingHeaderBar';
import { OutlineCheckCircle16, OutlineCrossCircle16 } from '@/components/landing/OutlineListIcons';

const involve = {
  fontFamily: 'var(--font-involve), system-ui, sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSynthesis: 'none',
};

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
      className="fixed inset-0 z-[10000] box-border flex w-full flex-col overflow-hidden bg-[#F5F5F5] text-[#101010]"
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
              gap: 5,
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
            <LongTariffCard title="Групповая подготовка" features={GROUP_FEATURES} />
            <LongTariffCard title="Персональная подготовка" features={PERSONAL_FEATURES} />
            <div className="carousel-spacer-right" aria-hidden style={{ alignSelf: 'stretch' }} />
          </div>
          </div>
        </div>

        {/* Задний full-bleed слой: внизу скролла — #F5F5F5; сама плашка с ценой внутри всегда белая */}
        <div
          className={`relative z-[1] -mt-px w-full shrink-0 transition-colors duration-150 ${priceBlockGray ? 'bg-[#F5F5F5]' : 'bg-white'}`}
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

/**
 * Карточка тарифа — структура как Frame3 (шапка / фичи / футер).
 * Высота по контенту: фиксированная 550px + flex-1 на середине давали пустоту между списком и ценой.
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
        <div style={{ width: 330, height: 45, marginBottom: 10 }}>
        <p
          className="m-0"
          style={{
            ...involve,
            fontSize: 14,
            lineHeight: '145%',
            color: 'rgba(16, 16, 16, 0.5)',
            display: 'flex',
            alignItems: 'center',
            height: 20,
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
            display: 'flex',
            alignItems: 'center',
            height: 25,
          }}
        >
          {title}
        </h2>
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
              ? 'relative z-0 flex h-full min-h-0 w-full min-w-0 flex-col items-stretch overflow-hidden bg-[#F5F5F5]'
              : 'fixed inset-0 z-[9999] flex w-full min-w-0 flex-col items-stretch overflow-hidden bg-[#F5F5F5]'
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
            className="relative min-h-0 min-w-0 shrink-0 overflow-hidden bg-[#F5F5F5]"
            style={{
              width: '100%',
              maxWidth: '425px',
              height: mainColumnHeight,
              maxHeight: mainColumnHeight,
              boxSizing: 'border-box',
            }}
          >
            {!isStacked ? <LandingHeaderBar onConsultationClick={openConsultation} /> : null}

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
                background: '#F5F5F5',
              }}
            >
              {/* Ряд без h-full: иначе cross-size строки = высота вьюпорта и карточка «растягивается» с пустотой под контентом */}
              <div
                className="carousel-container carousel-learning scrollbar-hide box-border flex w-full max-h-full min-h-0 flex-nowrap items-end overflow-x-auto overflow-y-visible"
                style={{
                  height: 'auto',
                  gap: 5,
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

                <EducationTariffCard
                  eyebrow="Подготовка к государственным экзаменам"
                  title="Групповая подготовка"
                  features={GROUP_FEATURES}
                  price="4800 руб."
                  priceCaption="Месячная плата за один предмет"
                  buttonLabel="Консультирование"
                  onButtonClick={openTariffDetails}
                />

                <EducationTariffCard
                  eyebrow="Подготовка к государственным экзаменам"
                  title="Персональная подготовка"
                  features={PERSONAL_FEATURES}
                  price="20400 руб."
                  priceCaption="Месячная плата за один предмет"
                  buttonLabel="Консультирование"
                  onButtonClick={openTariffDetails}
                />

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
