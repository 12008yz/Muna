'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ManaMarketingHeader from '@/components/landing/ManaMarketingHeader';
import ConsultationLandingPage from '@/components/landing/ConsultationLandingPage';
import GroupTrainingPage from '@/components/landing/GroupTrainingPage';
import OrderCreationLandingPage from '@/components/landing/OrderCreationLandingPage';
import PrivacyPolicyPage from '@/components/privacy/PrivacyPolicyPage';

const SECTION_IDS = {
  hero: 'section-hero',
  tariffs: 'section-tariffs',
  order: 'section-order',
};

const SECTION_ORDER = [SECTION_IDS.hero, SECTION_IDS.tariffs, SECTION_IDS.order];
const WHEEL_SCROLL_DURATION_MS = 700;

function scrollSectionIntoView(id, behavior = 'auto') {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior, block: 'start' });
}

function sectionIdToKey(id) {
  if (id === SECTION_IDS.hero) return 'hero';
  if (id === SECTION_IDS.tariffs) return 'tariffs';
  if (id === SECTION_IDS.order) return 'order';
  return 'hero';
}

const sectionShellClass =
  'snap-start snap-normal md:snap-always box-border shrink-0 overflow-hidden bg-black';

/**
 * Главная: герой, тарифы, мастер заявки и финальный экран в одном вертикальном скролле (snap + поблочный wheel);
 * заявки и политика — отдельные маршруты /orders и /privacy-policy; политика из куки — оверлей.
 */
export default function HomePage({
  privacyPolicyOpen,
  onOpenPrivacyPolicy,
  onPrivacyCollapse,
  notificationsEnabled = true,
}) {
  const router = useRouter();
  const scrollRef = useRef(null);
  const wheelScrollRafRef = useRef(null);
  const openersRef = useRef({ hero: null, tariffs: null, order: null });
  const [activeSection, setActiveSection] = useState('hero');
  const [heroConsultationOpen, setHeroConsultationOpen] = useState(false);
  const [orderConsultationOpen, setOrderConsultationOpen] = useState(false);
  const searchParams = useSearchParams();
  const hideHeaderForConsultation = heroConsultationOpen || orderConsultationOpen;

  /**
   * Чистый заход на / — всегда первый слайд (герой). Иначе сохранённый ?section=order или scroll
   * restoration после «сворачивания» открывает сайт сразу на 3-й секции.
   */
  useLayoutEffect(() => {
    const root = scrollRef.current;
    if (!root || typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const sec = sp.get('section');
    const hasSectionParam = sec && ['tariffs', 'order'].includes(sec);
    const h = window.location.hash.replace(/^#/, '');
    const hasSectionHash = h === SECTION_IDS.tariffs || h === SECTION_IDS.order;
    if (!hasSectionParam && !hasSectionHash) {
      root.scrollTop = 0;
    }
  }, []);

  const scrollNavigate = useMemo(
    () => ({
      toOrder: () => scrollSectionIntoView(SECTION_IDS.order, 'smooth'),
      toHero: () => scrollSectionIntoView(SECTION_IDS.hero, 'smooth'),
      toTariffs: () => scrollSectionIntoView(SECTION_IDS.tariffs, 'smooth'),
    }),
    []
  );

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const elements = SECTION_ORDER.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const ranked = entries
          .filter((e) => e.isIntersecting && e.target instanceof HTMLElement)
          .map((e) => ({ id: e.target.id, ratio: e.intersectionRatio }))
          .sort((a, b) => b.ratio - a.ratio);
        if (!ranked.length) return;
        setActiveSection(sectionIdToKey(ranked[0].id));
      },
      { root, threshold: [0.2, 0.35, 0.5, 0.65, 0.8] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /** Поблочный wheel: целый «экран» за жест, если не скроллим вложенный overflow. */
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const animateWheelScrollBy = (deltaTop) => {
      if (wheelScrollRafRef.current) {
        cancelAnimationFrame(wheelScrollRafRef.current);
        wheelScrollRafRef.current = null;
      }

      const startTop = root.scrollTop;
      const maxTop = Math.max(0, root.scrollHeight - root.clientHeight);
      const targetTop = Math.min(maxTop, Math.max(0, startTop + deltaTop));
      const distance = targetTop - startTop;
      if (Math.abs(distance) < 1) return;

      const startTime = performance.now();
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / WHEEL_SCROLL_DURATION_MS);
        root.scrollTop = startTop + distance * easeOutCubic(progress);
        if (progress < 1) {
          wheelScrollRafRef.current = requestAnimationFrame(tick);
        } else {
          wheelScrollRafRef.current = null;
        }
      };

      wheelScrollRafRef.current = requestAnimationFrame(tick);
    };

    const onWheel = (e) => {
      let el = e.target;
      while (el && el !== root) {
        if (el instanceof HTMLElement) {
          const { overflowY } = window.getComputedStyle(el);
          const canY =
            (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 2;
          if (canY) {
            const atTop = el.scrollTop <= 0;
            const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
            if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
              return;
            }
          }
        }
        el = el.parentElement;
      }

      if (Math.abs(e.deltaY) < 28) return;
      e.preventDefault();
      const step = root.clientHeight;
      const dir = e.deltaY > 0 ? 1 : -1;
      animateWheelScrollBy(dir * step);
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      root.removeEventListener('wheel', onWheel);
      if (wheelScrollRafRef.current) {
        cancelAnimationFrame(wheelScrollRafRef.current);
        wheelScrollRafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'orders') {
      router.replace('/orders');
      return;
    }
    if (section === 'privacy') {
      router.replace('/privacy-policy');
      return;
    }
    const idMap = {
      tariffs: SECTION_IDS.tariffs,
      order: SECTION_IDS.order,
    };
    const id = idMap[section];
    if (id) {
      requestAnimationFrame(() => {
        scrollSectionIntoView(id, 'auto');
        router.replace('/', { scroll: false });
      });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.location.hash.replace(/^#/, '');
    if (raw === 'section-orders') {
      router.replace('/orders');
      return;
    }
    if (raw === 'section-privacy') {
      router.replace('/privacy-policy');
      return;
    }
    const idMap = {
      [SECTION_IDS.tariffs]: SECTION_IDS.tariffs,
      [SECTION_IDS.order]: SECTION_IDS.order,
      tariffs: SECTION_IDS.tariffs,
      order: SECTION_IDS.order,
    };
    const id = idMap[raw];
    if (id) {
      requestAnimationFrame(() => {
        scrollSectionIntoView(id, 'auto');
        router.replace('/', { scroll: false });
      });
    }
  }, [router]);

  const handleHeaderConsultation = useCallback(() => {
    // По клику на "самолётик" всегда открываем именно flow консультации
    // (MAX / Telegram / номер), независимо от активной секции.
    const fn = openersRef.current.hero;
    if (typeof fn === 'function') fn();
  }, []);

  const exposeHero = useCallback((fn) => {
    openersRef.current.hero = fn;
  }, []);

  const exposeTariffs = useCallback((fn) => {
    openersRef.current.tariffs = fn;
  }, []);

  const exposeOrder = useCallback((fn) => {
    openersRef.current.order = fn;
  }, []);

  /** Мастер заявки (шаги 1–4) на главной: вместо шапки — только «сворачивание окна» */
  const [orderStackedWizardSteps, setOrderStackedWizardSteps] = useState(false);
  const hideAppHeaderForOrderWizard = orderStackedWizardSteps && activeSection === 'order';

  const sectionHeightStyle = { height: '100dvh' };

  return (
    <>
        <div
        className="fixed inset-0 z-0 flex w-full flex-col overflow-hidden bg-black"
        style={{
          height: '100dvh',
          maxHeight: '100dvh',
        }}
      >
        <div
          id="muna-fluid-cursor-mount"
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden
        />
        {/*
          Шапка: fixed + bg-transparent на корне — по практике Safari (см. iOS 26 / «Liquid Glass»):
          тинт статус-бара/панели берётся с position:fixed у края; фон и backdrop-filter
          должны быть на position:absolute-ребёнке, иначе хром браузера «ломается».
          Размытие + mask — плавный сход с контентом при скролле.
        */}
        <header
          className={`pointer-events-none fixed left-0 right-0 top-0 z-40 w-full bg-transparent ${
            hideHeaderForConsultation ? 'invisible' : ''
          }`}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-0 bg-black/88 backdrop-blur-[14px]"
            style={{
              height:
                'calc(var(--sat) + var(--header-top) + var(--header-height) + 8px + 160px)',
              WebkitMaskImage:
                'radial-gradient(145% 110% at 50% 0%, #000 14%, rgba(0,0,0,0.92) 34%, rgba(0,0,0,0.55) 70%, transparent 100%)',
              maskImage:
                'radial-gradient(145% 110% at 50% 0%, #000 14%, rgba(0,0,0,0.92) 34%, rgba(0,0,0,0.55) 70%, transparent 100%)',
            }}
          />
          <div
            data-fluid-cursor-block
            className="relative z-10 mx-auto w-full max-w-[425px] pt-[var(--sat)] pointer-events-auto"
            style={{ height: 'calc(var(--header-top) + var(--header-height) + 8px)' }}
          >
            <div
              id="stacked-order-wizard-header-slot"
              data-fluid-cursor-block
              className={
                hideAppHeaderForOrderWizard
                  ? 'absolute inset-0 z-[15] pointer-events-auto'
                  : 'pointer-events-none invisible absolute inset-0 z-[15]'
              }
            />
            {!hideAppHeaderForOrderWizard ? (
              <div className="relative z-20">
                <ManaMarketingHeader onConsultationClick={handleHeaderConsultation} menuHref="#section-hero" />
              </div>
            ) : null}
          </div>
        </header>

        <div
          ref={scrollRef}
          className={`relative z-[10] bg-black scrollbar-hide min-h-0 flex-1 snap-y snap-mandatory overflow-x-hidden overscroll-y-contain pb-main-scroll-bottom ${
            orderStackedWizardSteps ? 'overflow-y-hidden' : 'overflow-y-auto'
          }`}
          style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}
        >
          <section
            id={SECTION_IDS.hero}
            className={`${sectionShellClass} mx-auto w-full max-w-[425px]`}
            style={sectionHeightStyle}
          >
            <ConsultationLandingPage
              layout="stacked"
              onOpenFullPrivacyPolicy={onOpenPrivacyPolicy}
              exposeOpenConsultation={exposeHero}
              scrollNavigate={scrollNavigate}
              notificationsEnabled={notificationsEnabled}
              onConsultationFlowOpenChange={setHeroConsultationOpen}
            />
          </section>

          <section
            id={SECTION_IDS.tariffs}
            className={`${sectionShellClass} mx-auto w-full max-w-[425px]`}
            style={sectionHeightStyle}
          >
            <GroupTrainingPage
              layout="stacked"
              exposeOpenConsultation={exposeTariffs}
              scrollNavigate={scrollNavigate}
            />
          </section>

          <section
            id={SECTION_IDS.order}
            className={`${sectionShellClass} mx-auto w-full max-w-[425px]`}
            style={sectionHeightStyle}
          >
            <OrderCreationLandingPage
              layout="stacked"
              exposeOpenConsultation={exposeOrder}
              onAfterPhoneLead={scrollNavigate.toOrder}
              onStackedWizardStepsActive={setOrderStackedWizardSteps}
              onConsultationFlowOpenChange={setOrderConsultationOpen}
            />
          </section>


        </div>
      </div>

      {privacyPolicyOpen ? (
        <div
          data-fluid-cursor-block
          className="scrollbar-hide fixed inset-0 z-[10000] w-full min-w-0 overflow-y-auto overflow-x-hidden"
        >
          <PrivacyPolicyPage onCollapse={onPrivacyCollapse} />
        </div>
      ) : null}
    </>
  );
}
