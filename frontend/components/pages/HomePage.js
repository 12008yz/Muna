'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LandingHeaderBar from '@/components/landing/LandingHeaderBar';
import ConsultationLandingPage from '@/components/landing/ConsultationLandingPage';
import GroupTrainingPage from '@/components/landing/GroupTrainingPage';
import OrderCreationLandingPage from '@/components/landing/OrderCreationLandingPage';
import PrivacyPolicyPage from '@/components/privacy/PrivacyPolicyPage';

const SECTION_IDS = {
  hero: 'section-hero',
  tariffs: 'section-tariffs',
  order: 'section-order',
  orderFinal: 'section-order-final',
};

const SECTION_ORDER = [SECTION_IDS.hero, SECTION_IDS.tariffs, SECTION_IDS.order, SECTION_IDS.orderFinal];

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
  if (id === SECTION_IDS.orderFinal) return 'orderFinal';
  return 'hero';
}

const sectionShellClass = 'snap-start snap-always box-border shrink-0 overflow-hidden';

/**
 * Главная: три экрана (герой, тарифы, заявка) в одном вертикальном скролле (snap + поблочный wheel);
 * заявки и политика — отдельные маршруты /orders и /privacy-policy; политика из куки — оверлей.
 */
export default function HomePage({ privacyPolicyOpen, onOpenPrivacyPolicy, onPrivacyCollapse }) {
  const router = useRouter();
  const scrollRef = useRef(null);
  const openersRef = useRef({ hero: null, tariffs: null, order: null, orderFinal: null });
  const [activeSection, setActiveSection] = useState('hero');
  const searchParams = useSearchParams();

  const scrollNavigate = useMemo(
    () => ({
      toOrder: () => scrollSectionIntoView(SECTION_IDS.order, 'auto'),
      toOrderFinal: () => scrollSectionIntoView(SECTION_IDS.orderFinal, 'auto'),
      toHero: () => scrollSectionIntoView(SECTION_IDS.hero, 'auto'),
      toTariffs: () => scrollSectionIntoView(SECTION_IDS.tariffs, 'auto'),
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
      root.scrollBy({ top: dir * step, behavior: 'auto' });
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    return () => root.removeEventListener('wheel', onWheel);
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
      orderFinal: SECTION_IDS.orderFinal,
    };
    const id = idMap[section];
    if (id) requestAnimationFrame(() => scrollSectionIntoView(id, 'auto'));
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
      [SECTION_IDS.orderFinal]: SECTION_IDS.orderFinal,
      tariffs: SECTION_IDS.tariffs,
      order: SECTION_IDS.order,
      orderFinal: SECTION_IDS.orderFinal,
    };
    const id = idMap[raw];
    if (id) requestAnimationFrame(() => scrollSectionIntoView(id, 'auto'));
  }, [router]);

  const handleHeaderConsultation = useCallback(() => {
    const fn = openersRef.current[activeSection];
    if (typeof fn === 'function') {
      fn();
      return;
    }
  }, [activeSection]);

  const exposeHero = useCallback((fn) => {
    openersRef.current.hero = fn;
  }, []);

  const exposeTariffs = useCallback((fn) => {
    openersRef.current.tariffs = fn;
  }, []);

  const exposeOrder = useCallback((fn) => {
    openersRef.current.order = fn;
  }, []);
  const exposeOrderFinal = useCallback((fn) => {
    openersRef.current.orderFinal = fn;
  }, []);

  /** Мастер заявки (шаги 1–4) на главной: вместо шапки — только «сворачивание окна» */
  const [orderStackedWizardSteps, setOrderStackedWizardSteps] = useState(false);
  const hideAppHeaderForOrderWizard = orderStackedWizardSteps && activeSection === 'order';

  const sectionHeightStyle = { height: 'var(--unified-section-min-h)' };

  return (
    <>
      <div
        className="fixed inset-0 z-0 flex w-full flex-col overflow-hidden bg-[#F5F5F5] text-[#101010]"
        style={{ height: '100dvh', maxHeight: '100dvh' }}
      >
        <header className="relative z-40 shrink-0 bg-[#F5F5F5] pt-[var(--sat)]">
          <div
            className="relative mx-auto w-full max-w-[425px]"
            style={{ height: 'calc(var(--header-top) + var(--header-height) + 8px)' }}
          >
            <div
              id="stacked-order-wizard-header-slot"
              className={
                hideAppHeaderForOrderWizard
                  ? 'absolute inset-0 z-[15] pointer-events-auto'
                  : 'pointer-events-none invisible absolute inset-0 z-[15]'
              }
            />
            {!hideAppHeaderForOrderWizard ? (
              <div className="relative z-20">
                <LandingHeaderBar onConsultationClick={handleHeaderConsultation} menuHref="#section-hero" />
              </div>
            ) : null}
          </div>
        </header>

        <div
          ref={scrollRef}
          className="scrollbar-hide min-h-0 flex-1 snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-y-contain"
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
              onAfterPhoneLead={scrollNavigate.toHero}
              onStackedWizardStepsActive={setOrderStackedWizardSteps}
            />
          </section>

          <section
            id={SECTION_IDS.orderFinal}
            className={`${sectionShellClass} mx-auto w-full max-w-[425px]`}
            style={sectionHeightStyle}
          >
            <OrderCreationLandingPage
              layout="stacked"
              initialOrderStep={5}
              exposeOpenConsultation={exposeOrderFinal}
            />
          </section>

        </div>
      </div>

      {privacyPolicyOpen ? (
        <div className="scrollbar-hide fixed inset-0 z-[10000] w-full min-w-0 overflow-y-auto overflow-x-hidden">
          <PrivacyPolicyPage onCollapse={onPrivacyCollapse} />
        </div>
      ) : null}
    </>
  );
}
