'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import ConsultationFlow from '@/components/modals/ConsultationFlow';

const involve = {
  fontFamily: "'TT Firs Neue', system-ui, sans-serif",
  fontStyle: 'normal',
  fontWeight: 500,
  fontSynthesis: 'none',
};

const involveMana = {
  fontFamily: "'TT Firs Neue', system-ui, sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  fontSynthesis: 'none',
};

function findNearestVerticalScrollParentForDelta(startNode, deltaY) {
  if (typeof window === 'undefined') return null;
  let node = startNode?.parentElement ?? null;
  const scrollingUp = deltaY < 0;
  const scrollingDown = deltaY > 0;
  while (node) {
    const styles = window.getComputedStyle(node);
    const overflowY = styles.overflowY;
    const isScrollableContainer =
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') && node.scrollHeight > node.clientHeight + 1;
    if (isScrollableContainer) {
      const hasRoomUp = node.scrollTop > 0;
      const hasRoomDown = node.scrollTop + node.clientHeight < node.scrollHeight - 1;
      if ((scrollingUp && hasRoomUp) || (scrollingDown && hasRoomDown)) return node;
    }
    node = node.parentElement;
  }
  const docScroll = document.scrollingElement || document.documentElement;
  if (!docScroll) return null;
  const hasRoomUp = docScroll.scrollTop > 0;
  const hasRoomDown = docScroll.scrollTop + docScroll.clientHeight < docScroll.scrollHeight - 1;
  if ((scrollingUp && hasRoomUp) || (scrollingDown && hasRoomDown)) return docScroll;
  return docScroll;
}

function redirectVerticalWheelFromCarousel(event) {
  if (Math.abs(event.deltaY) < 1) return;
  const carousel = event.currentTarget;
  const scrollParent = findNearestVerticalScrollParentForDelta(carousel, event.deltaY);
  if (!scrollParent || scrollParent === carousel) {
    if (event.cancelable) event.preventDefault();
    return;
  }
  if (event.cancelable) event.preventDefault();
  scrollParent.scrollBy({ top: event.deltaY, behavior: 'auto' });
}

function getCarouselScrollPaddingLeft(el) {
  if (!el || typeof getComputedStyle === 'undefined') return 0;
  const n = parseFloat(getComputedStyle(el).scrollPaddingLeft);
  return Number.isFinite(n) ? n : 0;
}

function getCarouselScrollPaddingRight(el) {
  if (!el || typeof getComputedStyle === 'undefined') return 0;
  const n = parseFloat(getComputedStyle(el).scrollPaddingRight);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Целевой scrollLeft для выравнивания карточки под scroll-snap + scroll-padding.
 * Для последнего слайда используем end + scroll-padding-right, чтобы справа всегда было поле.
 */
function getCarouselSnapScrollLeftForCard(carousel, card, cardIndex, totalCards) {
  if (!carousel || !card) return 0;
  const max = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
  const useEndSnap =
    typeof cardIndex === 'number' &&
    typeof totalCards === 'number' &&
    totalCards >= 2 &&
    cardIndex === totalCards - 1;
  if (useEndSnap) {
    const padR = getCarouselScrollPaddingRight(carousel);
    const raw = card.offsetLeft + card.offsetWidth - carousel.clientWidth + padR;
    return Math.max(0, Math.min(raw, max));
  }
  const padL = getCarouselScrollPaddingLeft(carousel);
  const raw = card.offsetLeft - padL;
  return Math.max(0, Math.min(raw, max));
}

/** Индекс карточки, ближайшей к текущему scrollLeft (для стабильного восстановления после «Информирование»). */
function getStackedCarouselActiveCardIndex(carousel) {
  if (!carousel || typeof carousel.querySelectorAll !== 'function') return 0;
  const cards = Array.from(carousel.querySelectorAll('.carousel-card'));
  if (!cards.length) return 0;
  const sl = carousel.scrollLeft;
  let bestIdx = 0;
  let smallest = Number.POSITIVE_INFINITY;
  const n = cards.length;
  cards.forEach((card, idx) => {
    const ideal = getCarouselSnapScrollLeftForCard(carousel, card, idx, n);
    const delta = Math.abs(sl - ideal);
    if (delta < smallest) {
      smallest = delta;
      bestIdx = idx;
    }
  });
  return bestIdx;
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
    <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M12.6562 0C11.043 0 9.63047 0.69375 8.75 1.86641C7.86953 0.69375 6.45703 0 4.84375 0C3.55955 0.00144745 2.32837 0.512235 1.4203 1.4203C0.512235 2.32837 0.00144745 3.55955 0 4.84375C0 10.3125 8.10859 14.7391 8.45391 14.9219C8.54492 14.9708 8.64665 14.9965 8.75 14.9965C8.85335 14.9965 8.95508 14.9708 9.04609 14.9219C9.39141 14.7391 17.5 10.3125 17.5 4.84375C17.4986 3.55955 16.9878 2.32837 16.0797 1.4203C15.1716 0.512235 13.9404 0.00144745 12.6562 0ZM8.75 13.6563C7.32344 12.825 1.25 9.03828 1.25 4.84375C1.25124 3.89101 1.63026 2.97765 2.30396 2.30396C2.97765 1.63026 3.89101 1.25124 4.84375 1.25C6.36328 1.25 7.63906 2.05938 8.17188 3.35938C8.21896 3.47401 8.29907 3.57205 8.40201 3.64105C8.50494 3.71005 8.62607 3.7469 8.75 3.7469C8.87393 3.7469 8.99506 3.71005 9.09799 3.64105C9.20093 3.57205 9.28104 3.47401 9.32812 3.35938C9.86094 2.05703 11.1367 1.25 12.6562 1.25C13.609 1.25124 14.5224 1.63026 15.196 2.30396C15.8697 2.97765 16.2488 3.89101 16.25 4.84375C16.25 9.03203 10.175 12.8242 8.75 13.6563Z"
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
      <circle cx="8" cy="8" r="7.1" stroke="#FFFFFF" strokeWidth="1.4" />
      <path d="M8 4.2V11.8" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4.2 8H11.8" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5.35 5.35L10.65 10.65" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.65 5.35L5.35 10.65" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ManaGlassPriceFab({ onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 w-10 shrink-0 items-center justify-end rounded-[20px] bg-transparent ${className}`}
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
  onNavigateToOrder,
  onTransitionStart,
  isExpanded = false,
  onExpandedChange,
  onExpandedCollapseStart,
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
  parallelPhase = 'idle',
  /** Последний слайд в stacked MANA: snap end + поле 20px справа у края экрана. */
  stackCarouselLast = false,
}) {
  const isSiteVariant = initialVariant === 'site';
  const [leavingDown, setLeavingDown] = useState(false);
  const [baseEntering, setBaseEntering] = useState(false);
  const [expandedLeaving, setExpandedLeaving] = useState(false);
  const defaultTitle = isSiteVariant ? 'Формирование сайта' : 'Формирование медиа';
  const defaultDescription = 'Наличие интересного медиа служит важным маркетинговым инструментом малого и среднего предпринимательства';
  const defaultPrice = isSiteVariant ? 'около 35 тыс. р.' : 'около 45 тыс. р.';
  const cardTitle = overrideTitle || defaultTitle;
  const cardDescription = overrideDescription || defaultDescription;
  const cardPrice = overridePrice || defaultPrice;
  const isActionEnabled = typeof forceActionEnabled === 'boolean' ? forceActionEnabled : isSiteVariant;
  const actionLabel = overrideButtonLabel || (isSiteVariant ? 'Уточнение' : 'Недоступно');
  const expandedVariantResolved = expandedVariant || (isSiteVariant ? 'site' : 'content');
  const isParallelAnimating = parallelPhase !== 'idle';

  const handleInformClick = () => {
    if (!allowInformSwitch || leavingDown || isExpanded) return;
    onTransitionStart?.();
    setLeavingDown(true);
    window.setTimeout(() => {
      onExpandedChange?.(true);
      setLeavingDown(false);
    }, 420);
  };

  const handleExpandedInformClick = () => {
    if (!isExpanded || expandedLeaving) return;
    onTransitionStart?.();
    onExpandedCollapseStart?.();
    setExpandedLeaving(true);
    window.setTimeout(() => {
      onExpandedChange?.(false);
      setExpandedLeaving(false);
      setBaseEntering(true);
      window.requestAnimationFrame(() => setBaseEntering(false));
    }, 420);
  };
  if (isExpanded) {
    return (
      <ManaGlassMarketingCarouselCardTwo
        stackCarouselLast={stackCarouselLast}
        hideGiftButton
        onNavigateToOrder={onNavigateToOrder}
        onInformClick={handleExpandedInformClick}
        variant={expandedVariantResolved}
        overrideTitle={expandedTitleOverride}
        overridePrice={expandedPriceOverride}
        overrideButtonLabel={expandedButtonLabelOverride}
        forceActionEnabled={expandedForceActionEnabled}
        containerStyle={{
          transform: expandedLeaving || isParallelAnimating ? 'translateY(24px)' : 'translateY(0)',
          opacity: expandedLeaving || isParallelAnimating ? 0 : 1,
          transition: 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 460ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    );
  }

  return (
    <div
      data-fluid-cursor-block
      data-vertical-scroll-handle=""
      className={`carousel-card relative flex shrink-0 flex-col overflow-hidden${stackCarouselLast ? ' carousel-card--stacked-last' : ''}`}
      style={{
        height: 'auto',
        width: 'calc(100% - 40px)',
        minWidth: 'calc(100% - 40px)',
        alignSelf: 'flex-end',
        scrollSnapAlign: stackCarouselLast ? 'end' : 'start',
        boxSizing: 'border-box',
        maxWidth: 360,
        transform: leavingDown || baseEntering || isParallelAnimating ? 'translateY(24px)' : 'translateY(0)',
        opacity: leavingDown || baseEntering || isParallelAnimating ? 0 : 1,
        transition: 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 460ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div className="mb-3 flex w-full items-center justify-end">
        <div className="h-10 w-10" aria-hidden />
      </div>
      <article className="box-border w-full px-[15px] pb-[15px] pt-[15px]" style={manaGlassCardStyle}>
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
          <div className="mt-2">
            <ManaGlassDivider />
          </div>
          <p
            className="m-0 mt-2 w-full max-w-[330px]"
            style={{
              ...involveMana,
              width: 330,
              height: 60,
              fontSize: 16,
              lineHeight: '125%',
              color: 'rgba(255, 255, 255, 0.5)',
              overflow: 'hidden',
            }}
          >
            {cardDescription === defaultDescription ? (
              <>
                <span style={{ display: 'block' }}>Наличие интересного медиа служит</span>
                <span style={{ display: 'block' }}>важным маркетинговым инструментом</span>
                <span style={{ display: 'block', whiteSpace: 'nowrap', letterSpacing: '-0.020em' }}>
                  малого и среднего{'\u00A0'}предпринимательства
                </span>
              </>
            ) : (
              cardDescription
            )}
          </p>
        </div>

        <div className="mt-[10px]">
          <ManaGlassDivider />
        </div>

        <button
          type="button"
          className="mt-[10px] flex w-full max-w-[330px] cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-left outline-none"
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

        <div className="mt-[10px]">
          <ManaGlassDivider />
        </div>

        <div className="relative mt-[10px] flex max-w-[330px] items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="m-0" style={{ ...involveMana, fontSize: 20, lineHeight: '125%', color: '#FFFFFF' }}>
              {cardPrice}
            </p>
            <p className="m-0 mt-1" style={{ ...involveMana, fontSize: 14, lineHeight: '105%', color: 'rgba(255, 255, 255, 0.5)' }}>
              Рассрочка под ноль годовых до 3 мес.
            </p>
          </div>
          {typeof onNavigateToOrder === 'function' ? <ManaGlassPriceFab onClick={onNavigateToOrder} className="absolute right-0 top-[16px]" /> : null}
        </div>

        <button
          type="button"
          disabled={!isActionEnabled}
          onClick={isActionEnabled ? onNavigateToOrder : undefined}
          className={`mt-[20px] box-border flex h-[50px] w-full max-w-[330px] items-center justify-center rounded-[10px] border border-solid border-white outline-none ${
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

function ManaGiftFlowCard({ onBack, containerStyle, stackCarouselLast = false, renderPlaceholder = true }) {
  const [portalReady, setPortalReady] = useState(false);
  const [email, setEmail] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [newsAccepted, setNewsAccepted] = useState(false);
  const overlayRootRef = useRef(null);
  const closeTimerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const normalizedEmail = email.trim();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

  const canSubmit = normalizedEmail.length > 0 && privacyAccepted && newsAccepted;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    const showTimer = window.setTimeout(() => setIsVisible(true), 24);
    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(
    () => () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    },
    []
  );

  const handleBackAnimated = useCallback(() => {
    setIsVisible(false);
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      if (typeof onBack === 'function') onBack();
    }, 320);
  }, [onBack]);

  useEffect(() => {
    if (!portalReady || typeof window === 'undefined') return undefined;

    let cancelled = false;
    let retryTimer = null;
    let prev = null;
    let previousParent = null;
    let previousNextSibling = null;

    const mountCanvasInsideGiftOverlay = () => {
      if (cancelled) return;
      const canvas = window.__fluidCursorInstance?.canvas;
      const host = overlayRootRef.current;
      if (!canvas || !host) {
        retryTimer = window.setTimeout(mountCanvasInsideGiftOverlay, 120);
        return;
      }

      if (!prev) {
        prev = {
          position: canvas.style.position,
          inset: canvas.style.inset,
          width: canvas.style.width,
          height: canvas.style.height,
          zIndex: canvas.style.zIndex,
          display: canvas.style.display,
          opacity: canvas.style.opacity,
          filter: canvas.style.filter,
          mixBlendMode: canvas.style.mixBlendMode,
          pointerEvents: canvas.style.pointerEvents,
        };
        previousParent = canvas.parentElement;
        previousNextSibling = canvas.nextSibling;
      }

      if (canvas.parentElement !== host) {
        host.appendChild(canvas);
      }

      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '1';
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
      canvas.style.filter = 'blur(0px) saturate(1.38) brightness(1.18)';
      canvas.style.mixBlendMode = 'normal';
      canvas.style.pointerEvents = 'none';
    };

    mountCanvasInsideGiftOverlay();

    return () => {
      cancelled = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      const canvas = window.__fluidCursorInstance?.canvas;
      if (!canvas || !prev) return;
      canvas.style.position = prev.position;
      canvas.style.inset = prev.inset;
      canvas.style.width = prev.width;
      canvas.style.height = prev.height;
      canvas.style.zIndex = prev.zIndex;
      canvas.style.display = prev.display;
      canvas.style.opacity = prev.opacity;
      canvas.style.filter = prev.filter;
      canvas.style.mixBlendMode = prev.mixBlendMode;
      canvas.style.pointerEvents = prev.pointerEvents;
      if (previousParent && previousParent.isConnected) {
        if (previousNextSibling && previousNextSibling.parentNode === previousParent) {
          previousParent.insertBefore(canvas, previousNextSibling);
        } else {
          previousParent.appendChild(canvas);
        }
      }
    };
  }, [portalReady]);

  const carouselPlaceholder = renderPlaceholder ? (
    <div
      className={`carousel-card box-border min-h-[473px] w-[360px] shrink-0${stackCarouselLast ? ' carousel-card--stacked-last' : ''}`}
      data-vertical-scroll-handle=""
      style={{
        width: 'calc(100% - 40px)',
        minWidth: 'calc(100% - 40px)',
        alignSelf: 'flex-end',
        scrollSnapAlign: stackCarouselLast ? 'end' : 'start',
        maxWidth: 360,
        ...containerStyle,
      }}
      aria-hidden
    />
  ) : null;

  if (!portalReady) return carouselPlaceholder;

  return (
    <>
      {carouselPlaceholder}
      {createPortal(
        <div
          ref={overlayRootRef}
          className="fixed inset-0 z-[20000] flex items-end justify-center px-[var(--main-block-margin)] pb-[20px] pt-[80px]"
          style={{
            background: '#050505',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <button
            type="button"
            data-fluid-cursor-block
            onClick={handleBackAnimated}
            className="absolute left-[20px] top-[calc(var(--sat,0px)+10px)] z-[3] flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(5,5,5,0.75)] backdrop-blur-[5px]"
            aria-label="Назад"
          >
            <svg
              className="block"
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
              style={{ transform: 'scaleX(-1)', transformOrigin: '50% 50%' }}
            >
              <path
                d="M8.125 0C9.73197 0 11.3029 0.476523 12.639 1.36931C13.9752 2.2621 15.0166 3.53105 15.6315 5.0157C16.2465 6.50035 16.4074 8.13401 16.0939 9.71011C15.7804 11.2862 15.0065 12.7339 13.8702 13.8702C12.7339 15.0065 11.2862 15.7804 9.7101 16.0939C8.13401 16.4074 6.50034 16.2465 5.01569 15.6315C3.53104 15.0166 2.26209 13.9752 1.36931 12.639C0.47652 11.3029 -3.8147e-06 9.73197 -3.8147e-06 8.125C0.00227165 5.97081 0.859026 3.90551 2.38227 2.38227C3.90551 0.85903 5.97081 0.00227486 8.125 0ZM8.125 15C9.48474 15 10.814 14.5968 11.9445 13.8414C13.0751 13.0859 13.9563 12.0122 14.4767 10.7559C14.997 9.49971 15.1332 8.11737 14.8679 6.78375C14.6026 5.45013 13.9478 4.22513 12.9864 3.26364C12.0249 2.30216 10.7999 1.64737 9.46624 1.3821C8.13262 1.11683 6.75029 1.25298 5.49405 1.77333C4.23781 2.29368 3.16408 3.17487 2.40864 4.30545C1.65321 5.43604 1.25 6.76525 1.25 8.125C1.25206 9.94773 1.97706 11.6952 3.26592 12.9841C4.55479 14.2729 6.30227 14.9979 8.125 15ZM4.375 8.125C4.375 8.29076 4.44084 8.44973 4.55805 8.56694C4.67526 8.68415 4.83424 8.75 5 8.75H9.7414L8.30781 10.1828C8.24974 10.2409 8.20368 10.3098 8.17225 10.3857C8.14082 10.4616 8.12465 10.5429 8.12465 10.625C8.12465 10.7071 8.14082 10.7884 8.17225 10.8643C8.20368 10.9402 8.24974 11.0091 8.30781 11.0672C8.36588 11.1253 8.43482 11.1713 8.51069 11.2027C8.58656 11.2342 8.66787 11.2503 8.75 11.2503C8.83212 11.2503 8.91344 11.2342 8.98931 11.2027C9.06518 11.1713 9.13412 11.1253 9.19218 11.0672L11.6922 8.56719C11.7503 8.50914 11.7964 8.44021 11.8278 8.36434C11.8593 8.28846 11.8755 8.20713 11.8755 8.125C11.8755 8.04287 11.8593 7.96154 11.8278 7.88566C11.7964 7.80979 11.7503 7.74086 11.6922 7.68281L9.19218 5.18281C9.07491 5.06554 8.91585 4.99965 8.75 4.99965C8.58414 4.99965 8.42508 5.06554 8.30781 5.18281C8.19053 5.30009 8.12465 5.45915 8.12465 5.625C8.12465 5.79085 8.19053 5.94991 8.30781 6.06719L9.7414 7.5H5C4.83424 7.5 4.67526 7.56585 4.55805 7.68306C4.44084 7.80027 4.375 7.95924 4.375 8.125Z"
                fill="#FFFFFF"
              />
            </svg>
          </button>

          <div
            data-fluid-cursor-block
            data-vertical-scroll-handle=""
            className="relative z-[3] flex w-full shrink-0 flex-col overflow-hidden"
            style={{
              height: 335,
              boxSizing: 'border-box',
              ...containerStyle,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <article className="box-border h-[335px] w-full max-w-full px-[15px] pb-[15px] pt-[15px]" style={manaGlassCardStyle}>
          <p className="m-0" style={{ ...involveMana, fontSize: 18, lineHeight: '110%', color: '#FFFFFF' }}>
            Подарок, как маркетинговая карта
          </p>
          <p className="m-0 mt-[10px]" style={{ ...involveMana, fontSize: 14, lineHeight: '110%', color: 'rgba(255,255,255,0.25)' }}>
            Рассылка неполезного отсутствует.
            <br />
            Рассылка неинтересного тоже отсутствует
          </p>

          <div className="relative mt-[15px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Имя электронного ящика"
              className="h-[50px] w-full rounded-[10px] border border-[rgba(255,255,255,0.5)] bg-transparent px-[15px] pr-[44px] outline-none placeholder:text-[rgba(255,255,255,0.5)]"
              style={{ ...involveMana, fontSize: 16, lineHeight: '125%', color: '#FFFFFF' }}
            />
            {isEmailValid ? (
              <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="8" fill="white" />
                  <path d="M4.8 8.2L6.8 10.2L11.2 5.8" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setPrivacyAccepted((v) => !v)}
            className="mt-[5px] flex h-[50px] w-full items-center gap-[10px] rounded-[10px] border border-[rgba(255,255,255,0.1)] pl-[15px] pr-[10px] text-left"
          >
            <span className="h-4 w-4 shrink-0" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7.5" stroke="rgba(255,255,255,0.5)" />
                {privacyAccepted ? <circle cx="8" cy="8" r="8" fill="white" /> : null}
                {privacyAccepted ? (
                  <path d="M4.8 8.2L6.8 10.2L11.2 5.8" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                ) : null}
              </svg>
            </span>
            <span style={{ ...involveMana, fontSize: 14, lineHeight: '105%', color: '#FFFFFF' }}>
              Я, полностью соглашаюсь с условиями
              <br />
              <span className="underline">политики конфиденциальности сайта</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setNewsAccepted((v) => !v)}
            className="mt-[8px] flex h-[50px] w-full items-center gap-[10px] rounded-[10px] border border-[rgba(255,255,255,0.1)] pl-[15px] pr-[10px] text-left"
          >
            <span className="h-4 w-4 shrink-0" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="7.5" stroke="rgba(255,255,255,0.5)" />
                {newsAccepted ? <circle cx="8" cy="8" r="8" fill="white" /> : null}
                {newsAccepted ? (
                  <path d="M4.8 8.2L6.8 10.2L11.2 5.8" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                ) : null}
              </svg>
            </span>
            <span style={{ ...involveMana, fontSize: 14, lineHeight: '105%', color: '#FFFFFF' }}>
              Я, полностью соглашаюсь с условиями
              <br />
              <span className="underline">политики новостной отправки сайта</span>
            </span>
          </button>

          <button
            type="button"
            disabled={!canSubmit}
            className={`mt-[10px] h-[50px] w-full rounded-[10px] border border-white ${canSubmit ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            style={{ ...involveMana, fontSize: 16, lineHeight: '315%', color: '#050505', background: '#FFFFFF', opacity: 1 }}
          >
            Подтверждение
          </button>
            </article>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/**
 * Второй слайд карусели (MANA): тёмное стекло, Frame 2, «Информирование», плашки «Подарок» и стрелка.
 */
function ManaGlassMarketingCarouselCardTwo({
  onNavigateToOrder,
  onInformClick,
  variant = 'content',
  overrideTitle,
  overridePrice,
  overrideButtonLabel,
  forceActionEnabled,
  containerStyle,
  stackCarouselLast = false,
  hideGiftButton = false,
}) {
  const isSiteVariant = variant === 'site';
  const expandedTitle = overrideTitle || (isSiteVariant ? 'Формирование сайта' : 'Формирование медиа');
  const expandedPrice = overridePrice || (isSiteVariant ? 'около 35 тыс. р.' : 'около 45 тыс. р.');
  const expandedRows = isSiteVariant ? MANA_GLASS_SITE_ROWS : MANA_GLASS_PLACEHOLDER_ROWS;
  const expandedButtonLabel = overrideButtonLabel || (isSiteVariant ? 'Уточнение' : 'Недоступно');
  const expandedButtonDisabled =
    typeof forceActionEnabled === 'boolean' ? !forceActionEnabled : !isSiteVariant;
  const topRowClass = 'mb-[10px] flex h-10 w-full shrink-0 items-center justify-between';
  const giftButtonClass = isSiteVariant
    ? 'flex h-10 w-[115px] items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#050505] pl-[10px] pr-[12px] backdrop-blur-[5px]'
    : 'flex h-10 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[#050505] px-3 backdrop-blur-[5px]';
  const articlePaddingClass = 'box-border min-h-[423px] w-full px-[15px] pb-[15px] pt-[15px]';
  const dividerGap = 'mt-[10px]';
  const infoGap = 'mt-[10px]';
  const priceGap = 'mt-[10px]';

  return (
    <div
      data-fluid-cursor-block
      data-vertical-scroll-handle=""
      className={`carousel-card relative flex shrink-0 flex-col overflow-visible${stackCarouselLast ? ' carousel-card--stacked-last' : ''}`}
      style={{
        minHeight: 473,
        height: 'auto',
        width: 'calc(100% - 40px)',
        minWidth: 'calc(100% - 40px)',
        alignSelf: 'flex-end',
        scrollSnapAlign: stackCarouselLast ? 'end' : 'start',
        boxSizing: 'border-box',
        maxWidth: 360,
        ...containerStyle,
      }}
    >
      <div className={topRowClass}>
        {!hideGiftButton ? (
          <button
            type="button"
            className={giftButtonClass}
            style={{ ...involveMana, fontSize: 14, lineHeight: '145%', color: '#FFFFFF' }}
          >
            <ManaGiftHeartIcon />
            Подарок
          </button>
        ) : (
          <div className="h-10 w-[115px]" aria-hidden />
        )}
        <div className="h-10 w-10" aria-hidden />
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
          <div className="mt-2">
            <ManaGlassDivider />
          </div>
        </div>

        <div className="mt-[10px] flex h-[130px] w-full max-w-[330px] flex-col gap-[5px]">
          {expandedRows.map((row, idx) => (
            <div key={`mana-ph-${idx}`} className="relative h-10 w-[330px]">
              <span className="absolute left-0 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center">
                <ManaGlassCheckCircle16 />
              </span>
              <span className="block h-10 w-[330px] min-w-0 pl-[25px]">
                <span
                  className="block h-[25px]"
                  style={{
                    ...involveMana,
                    fontSize: 16,
                    lineHeight: '155%',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {row.title}
                </span>
                <span
                  className="block h-[15px]"
                  style={{
                    ...involveMana,
                    fontSize: 14,
                    lineHeight: '105%',
                    color: 'rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'clip',
                  }}
                >
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

        <div className={`${priceGap} relative flex max-w-[330px] items-start justify-between gap-3`}>
          <div className="min-w-0 flex-1">
            <p className="m-0" style={{ ...involveMana, fontSize: 20, lineHeight: '125%', color: '#FFFFFF' }}>
              {expandedPrice}
            </p>
            <p className="m-0 mt-1" style={{ ...involveMana, fontSize: 14, lineHeight: '105%', color: 'rgba(255, 255, 255, 0.5)' }}>
              Рассрочка под ноль годовых до 3 мес.
            </p>
          </div>
          {typeof onNavigateToOrder === 'function' ? <ManaGlassPriceFab onClick={onNavigateToOrder} className="absolute right-0 top-[16px]" /> : null}
        </div>

        <button
          type="button"
          onClick={expandedButtonDisabled ? undefined : onNavigateToOrder}
          disabled={expandedButtonDisabled}
          className={`mt-[20px] box-border flex h-[50px] w-full max-w-[330px] items-center justify-center rounded-[10px] border border-solid border-white outline-none ${
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
 * Секция карусели тарифов MANA на главной (высота секции задаётся родителем).
 */
export default function GroupTrainingPage({ exposeOpenConsultation, scrollNavigate } = {}) {
  const router = useRouter();
  const stackedCarouselFrameRef = useRef(null);
  const stackedCarouselRef = useRef(null);
  const [consultationFlowOpen, setConsultationFlowOpen] = useState(false);
  const [consultationInitialStep, setConsultationInitialStep] = useState('contact-method');
  const [expandAllCards, setExpandAllCards] = useState(false);
  const [showSingleGiftCta, setShowSingleGiftCta] = useState(false);
  const [isGlobalGiftOpen, setIsGlobalGiftOpen] = useState(false);
  const [stackedCardsParallelPhase, setStackedCardsParallelPhase] = useState('idle');

  useEffect(() => {
    if (typeof exposeOpenConsultation !== 'function') return;
    exposeOpenConsultation(() => {
      setConsultationInitialStep('contact-method');
      setConsultationFlowOpen(true);
    });
    return () => exposeOpenConsultation(null);
  }, [exposeOpenConsultation]);

  const openConsultationCallbackForm = useCallback(() => {
    setConsultationInitialStep('phone-callback-form');
    setConsultationFlowOpen(true);
  }, []);

  const carouselTop = 'clamp(12px, 3vh, 36px)';

  const mainColumnHeight = '100%';
  const [hideStackedArrow, setHideStackedArrow] = useState(false);
  const [isGiftOpenInStacked, setIsGiftOpenInStacked] = useState(false);
  const [stackedActiveIndex, setStackedActiveIndex] = useState(0);
  const [stackedCardsCount, setStackedCardsCount] = useState(0);
  const [stackedArrowTop, setStackedArrowTop] = useState(null);
  const stackedArrowTimerRef = useRef(null);
  const giftOriginScrollLeftRef = useRef(0);
  /** Индекс карточки для восстановления горизонтального скролла после «Информирование» (точнее, чем сырой scrollLeft). */
  const pendingCarouselCardIndexRef = useRef(null);
  /** Пока true — не дёргаем стрелку/meta от ResizeObserver/scroll (убирает «ходун» при смене высоты ряда). */
  const carouselLayoutSettlingRef = useRef(false);
  /** На время раскрытия карточки фиксируем горизонтальный скролл (иначе WebKit/snap уводит ряд). */
  const stackedCarouselScrollLockLeftRef = useRef(null);
  /** Каждый кадр подтягиваем scrollLeft — часть движков меняет позицию без события scroll. */
  const carouselScrollLockRafRef = useRef(0);
  const stackedCardsParallelPhaseRef = useRef({ enterId: null, resetId: null });

  const startStackedCardsParallelAnimation = useCallback(() => {
    const refs = stackedCardsParallelPhaseRef.current;
    if (refs.enterId) window.clearTimeout(refs.enterId);
    if (refs.resetId) window.clearTimeout(refs.resetId);
    setStackedCardsParallelPhase('leaving');
    refs.enterId = window.setTimeout(() => {
      setStackedCardsParallelPhase('entering');
      refs.enterId = null;
    }, 420);
    refs.resetId = window.setTimeout(() => {
      setStackedCardsParallelPhase('idle');
      refs.resetId = null;
    }, 520);
  }, []);

  const updateStackedArrowPosition = useCallback(() => {
    // Фиксируем позицию стрелки после первого расчёта:
    // при переключении карточек больше не двигаем её вверх/вниз.
    if (stackedArrowTop != null) return;
    const frame = stackedCarouselFrameRef.current;
    const carousel = stackedCarouselRef.current;
    if (!frame || !carousel) return;

    const cards = Array.from(carousel.querySelectorAll('.carousel-card'));
    if (!cards.length) return;

    const safeIndex = Math.max(0, Math.min(stackedActiveIndex, cards.length - 1));
    const activeCard = cards[safeIndex] || cards[0];

    const ARROW_SIZE = 40;
    const GAP_ABOVE_CARD = 10;
    const cardMainBlock = activeCard.querySelector('article');
    const blockTop = cardMainBlock ? activeCard.offsetTop + cardMainBlock.offsetTop : activeCard.offsetTop;
    const nextTop = Math.max(0, blockTop - ARROW_SIZE - GAP_ABOVE_CARD);
    setStackedArrowTop(nextTop);
  }, [stackedActiveIndex, stackedArrowTop]);

  const updateStackedCarouselMeta = useCallback(() => {
    const carousel = stackedCarouselRef.current;
    if (!carousel) return;

    const cards = Array.from(carousel.querySelectorAll('.carousel-card'));
    if (!cards.length) return;
    setStackedCardsCount(cards.length);

    let currentIndex = 0;
    let smallestDelta = Number.POSITIVE_INFINITY;
    const n = cards.length;
    cards.forEach((card, idx) => {
      const ideal = getCarouselSnapScrollLeftForCard(carousel, card, idx, n);
      const delta = Math.abs(carousel.scrollLeft - ideal);
      if (delta < smallestDelta) {
        smallestDelta = delta;
        currentIndex = idx;
      }
    });
    setStackedActiveIndex(currentIndex);
  }, []);

  useEffect(() => {
    return () => {
      if (stackedArrowTimerRef.current) {
        window.clearTimeout(stackedArrowTimerRef.current);
      }
      if (carouselScrollLockRafRef.current) {
        cancelAnimationFrame(carouselScrollLockRafRef.current);
        carouselScrollLockRafRef.current = 0;
      }
      const refs = stackedCardsParallelPhaseRef.current;
      if (refs.enterId) window.clearTimeout(refs.enterId);
      if (refs.resetId) window.clearTimeout(refs.resetId);
    };
  }, []);

  useEffect(() => {
    const el = stackedCarouselRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let hasTouch = false;

    const onTouchStart = (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      hasTouch = true;
      startX = t.clientX;
      startY = t.clientY;
    };

    const onTouchMove = (e) => {
      if (!hasTouch) return;
      const t = e.touches?.[0];
      if (!t) return;

      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) <= Math.abs(dy)) return;

      const atLeftEdge = el.scrollLeft <= 0.5;
      const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      const atRightEdge = el.scrollLeft >= maxLeft - 0.5;
      const draggingOutLeft = atLeftEdge && dx > 0;
      const draggingOutRight = atRightEdge && dx < 0;

      if ((draggingOutLeft || draggingOutRight) && e.cancelable) {
        e.preventDefault();
      }
    };

    const onTouchEnd = () => {
      hasTouch = false;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  useEffect(() => {
    updateStackedArrowPosition();
    updateStackedCarouselMeta();

    const carousel = stackedCarouselRef.current;
    if (!carousel) return;

    const onResize = () => {
      const el = stackedCarouselRef.current;
      if (
        carouselLayoutSettlingRef.current &&
        el &&
        stackedCarouselScrollLockLeftRef.current != null
      ) {
        el.scrollLeft = stackedCarouselScrollLockLeftRef.current;
        return;
      }
      if (carouselLayoutSettlingRef.current) return;
      updateStackedArrowPosition();
    };
    window.addEventListener('resize', onResize);

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            const el = stackedCarouselRef.current;
            if (
              carouselLayoutSettlingRef.current &&
              el &&
              stackedCarouselScrollLockLeftRef.current != null
            ) {
              el.scrollLeft = stackedCarouselScrollLockLeftRef.current;
              return;
            }
            if (carouselLayoutSettlingRef.current) return;
            updateStackedArrowPosition();
          })
        : null;

    ro?.observe(carousel);
    Array.from(carousel.querySelectorAll('.carousel-card')).forEach((card) => ro?.observe(card));

    return () => {
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [updateStackedArrowPosition, updateStackedCarouselMeta]);

  const hideStackedArrowDuringCardTransition = (lockedCardIndex) => {
    startStackedCardsParallelAnimation();
    const carousel = stackedCarouselRef.current;
    let prevSnapType = '';
    let prevOverflowX = '';
    let prevScrollBehavior = '';
    if (carouselScrollLockRafRef.current) {
      cancelAnimationFrame(carouselScrollLockRafRef.current);
      carouselScrollLockRafRef.current = 0;
    }
    if (carousel) {
      pendingCarouselCardIndexRef.current =
        typeof lockedCardIndex === 'number' ? lockedCardIndex : getStackedCarouselActiveCardIndex(carousel);
      stackedCarouselScrollLockLeftRef.current = carousel.scrollLeft;
      carouselLayoutSettlingRef.current = true;
      /* Без этого iOS/WebKit при смене высоты/snap-цели может «дотянуть» scrollLeft к соседней карточке. */
      prevSnapType = carousel.style.scrollSnapType;
      carousel.style.scrollSnapType = 'none';
      /* Гасим горизонтальный дрейф и «рваный» snap, пока карточка меняет высоту/transform. */
      prevOverflowX = carousel.style.overflowX;
      carousel.style.overflowX = 'hidden';
      /* smooth + snap даёт догоняющую анимацию и визуальный «уход» ряда вбок. */
      prevScrollBehavior = carousel.style.scrollBehavior;
      carousel.style.scrollBehavior = 'auto';

      const tickScrollLock = () => {
        if (
          !carouselLayoutSettlingRef.current ||
          stackedCarouselScrollLockLeftRef.current == null
        ) {
          carouselScrollLockRafRef.current = 0;
          return;
        }
        const el = stackedCarouselRef.current;
        const lock = stackedCarouselScrollLockLeftRef.current;
        if (el != null && Math.abs(el.scrollLeft - lock) > 0.5) {
          el.scrollLeft = lock;
        }
        carouselScrollLockRafRef.current = requestAnimationFrame(tickScrollLock);
      };
      carouselScrollLockRafRef.current = requestAnimationFrame(tickScrollLock);
    } else {
      stackedCarouselScrollLockLeftRef.current = null;
    }
    setHideStackedArrow(true);
    if (stackedArrowTimerRef.current) {
      window.clearTimeout(stackedArrowTimerRef.current);
    }
    /* 320ms transition + reflow; три rAF — стабильный offsetLeft в WebKit перед финальным scrollTo. */
    stackedArrowTimerRef.current = window.setTimeout(() => {
      if (carouselScrollLockRafRef.current) {
        cancelAnimationFrame(carouselScrollLockRafRef.current);
        carouselScrollLockRafRef.current = 0;
      }
      setHideStackedArrow(false);
      const el = stackedCarouselRef.current;
      const idx = pendingCarouselCardIndexRef.current;
      pendingCarouselCardIndexRef.current = null;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            if (el != null && typeof idx === 'number') {
              const cards = Array.from(el.querySelectorAll('.carousel-card'));
              const card = cards[idx];
              const n = cards.length;
              if (card) {
                const targetLeft = getCarouselSnapScrollLeftForCard(el, card, idx, n);
                el.scrollTo({ left: targetLeft, behavior: 'auto' });
                /* Дубль без анимации: иногда snap/композитор двигают позицию на следующий кадр. */
                requestAnimationFrame(() => {
                  if (el && Math.abs(el.scrollLeft - targetLeft) > 1) {
                    el.scrollLeft = targetLeft;
                  }
                });
              }
            }
            stackedCarouselScrollLockLeftRef.current = null;
            if (el) {
              el.style.scrollSnapType = prevSnapType || 'x mandatory';
              el.style.overflowX = prevOverflowX || '';
              el.style.scrollBehavior = prevScrollBehavior || '';
            }
            carouselLayoutSettlingRef.current = false;
            updateStackedArrowPosition();
            updateStackedCarouselMeta();
          });
        });
      });
      stackedArrowTimerRef.current = null;
    }, 500);
  };

  const scrollStackedCarouselToNext = () => {
    const el = stackedCarouselRef.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll('.carousel-card'));
    if (!cards.length) return;

    let currentIndex = 0;
    let smallestDelta = Number.POSITIVE_INFINITY;
    const n = cards.length;
    cards.forEach((card, idx) => {
      const ideal = getCarouselSnapScrollLeftForCard(el, card, idx, n);
      const delta = Math.abs(el.scrollLeft - ideal);
      if (delta < smallestDelta) {
        smallestDelta = delta;
        currentIndex = idx;
      }
    });

    const nextIndex = (currentIndex + 1) % cards.length;
    const nextCard = cards[nextIndex];
    if (!nextCard) return;
    el.scrollTo({ left: getCarouselSnapScrollLeftForCard(el, nextCard, nextIndex, n), behavior: 'smooth' });
  };

  const handleGiftOpenChange = useCallback(
    (isOpen) => {
      setIsGiftOpenInStacked(isOpen);
      const carousel = stackedCarouselRef.current;
      if (!carousel) return;

      if (isOpen) {
        giftOriginScrollLeftRef.current = carousel.scrollLeft;
        return;
      }

      const restoreLeft = giftOriginScrollLeftRef.current;
      window.requestAnimationFrame(() => {
        carousel.scrollTo({ left: restoreLeft, behavior: 'auto' });
        updateStackedCarouselMeta();
        updateStackedArrowPosition();
      });
    },
    [updateStackedArrowPosition, updateStackedCarouselMeta]
  );

  const isLastStackedCard = stackedCardsCount > 0 && stackedActiveIndex === stackedCardsCount - 1;
  const handleExpandedCollapseStart = useCallback(() => {
    setShowSingleGiftCta(false);
    setIsGlobalGiftOpen(false);
    setIsGiftOpenInStacked(false);
  }, []);

  useEffect(() => {
    if (!expandAllCards) {
      setShowSingleGiftCta(false);
      setIsGlobalGiftOpen(false);
      setIsGiftOpenInStacked(false);
      return;
    }
    const id = window.setTimeout(() => setShowSingleGiftCta(true), 520);
    return () => window.clearTimeout(id);
  }, [expandAllCards]);

  return (
    <>
        <div
          className="relative z-0 flex h-full min-h-0 w-full min-w-0 flex-col items-stretch overflow-hidden bg-transparent"
          style={{
            height: '100%',
            minHeight: 0,
            boxSizing: 'border-box',
            paddingBottom: 'calc(var(--main-block-margin) + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div
            className="relative min-h-0 min-w-0 shrink-0 overflow-hidden bg-transparent"
            style={{
              width: '100%',
              maxWidth: '425px',
              height: mainColumnHeight,
              maxHeight: mainColumnHeight,
              boxSizing: 'border-box',
            }}
          >
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
                background: 'transparent',
              }}
            >
              {/* Ряд без h-full: иначе cross-size строки = высота вьюпорта и карточка «растягивается» с пустотой под контентом */}
              <div ref={stackedCarouselFrameRef} className="relative">
                  <div
                    className="pointer-events-none absolute left-5 z-[3]"
                    style={{
                      top: 0,
                      opacity: showSingleGiftCta && !isGlobalGiftOpen ? 1 : 0,
                      transform: showSingleGiftCta && !isGlobalGiftOpen ? 'translateY(0)' : 'translateY(8px)',
                      transition: 'opacity 260ms cubic-bezier(0.22, 1, 0.36, 1), transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    <button
                      type="button"
                      data-fluid-cursor-block
                      onClick={() => {
                        setIsGlobalGiftOpen(true);
                        setIsGiftOpenInStacked(true);
                      }}
                      className="pointer-events-auto flex h-10 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(5,5,5,0.75)] pl-[10px] pr-[12px] backdrop-blur-[5px]"
                      style={{ ...involveMana, fontSize: 14, lineHeight: '145%', color: '#FFFFFF' }}
                    >
                      <ManaGiftHeartIcon />
                      Подарок
                    </button>
                  </div>
                  <div className="pointer-events-none absolute right-5 z-[3]" style={{ top: stackedArrowTop ?? 0, transition: 'top 180ms ease' }}>
                    <button
                      type="button"
                      data-fluid-cursor-block
                      data-vertical-scroll-handle=""
                      onClick={scrollStackedCarouselToNext}
                      className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(5,5,5,0.75)] backdrop-blur-[5px]"
                      aria-label="Следующая карточка"
                      style={{
                        opacity: hideStackedArrow || isGiftOpenInStacked ? 0 : 1,
                        pointerEvents: hideStackedArrow || isGiftOpenInStacked ? 'none' : 'auto',
                        transition: 'opacity 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                      }}
                    >
                      <svg
                        className="block"
                        width="17"
                        height="16"
                        viewBox="0 0 17 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                        style={{
                          transform: `${isLastStackedCard ? 'rotate(180deg) translateY(0px)' : 'rotate(0deg) translateY(1px)'}`,
                          transformOrigin: '50% 50%',
                          transition: 'transform 160ms ease',
                        }}
                      >
                        <path
                          d="M8.125 0C9.73197 0 11.3029 0.476523 12.639 1.36931C13.9752 2.2621 15.0166 3.53105 15.6315 5.0157C16.2465 6.50035 16.4074 8.13401 16.0939 9.71011C15.7804 11.2862 15.0065 12.7339 13.8702 13.8702C12.7339 15.0065 11.2862 15.7804 9.7101 16.0939C8.13401 16.4074 6.50034 16.2465 5.01569 15.6315C3.53104 15.0166 2.26209 13.9752 1.36931 12.639C0.47652 11.3029 -3.8147e-06 9.73197 -3.8147e-06 8.125C0.00227165 5.97081 0.859026 3.90551 2.38227 2.38227C3.90551 0.85903 5.97081 0.00227486 8.125 0ZM8.125 15C9.48474 15 10.814 14.5968 11.9445 13.8414C13.0751 13.0859 13.9563 12.0122 14.4767 10.7559C14.997 9.49971 15.1332 8.11737 14.8679 6.78375C14.6026 5.45013 13.9478 4.22513 12.9864 3.26364C12.0249 2.30216 10.7999 1.64737 9.46624 1.3821C8.13262 1.11683 6.75029 1.25298 5.49405 1.77333C4.23781 2.29368 3.16408 3.17487 2.40864 4.30545C1.65321 5.43604 1.25 6.76525 1.25 8.125C1.25206 9.94773 1.97706 11.6952 3.26592 12.9841C4.55479 14.2729 6.30227 14.9979 8.125 15ZM4.375 8.125C4.375 8.29076 4.44084 8.44973 4.55805 8.56694C4.67526 8.68415 4.83424 8.75 5 8.75H9.7414L8.30781 10.1828C8.24974 10.2409 8.20368 10.3098 8.17225 10.3857C8.14082 10.4616 8.12465 10.5429 8.12465 10.625C8.12465 10.7071 8.14082 10.7884 8.17225 10.8643C8.20368 10.9402 8.24974 11.0091 8.30781 11.0672C8.36588 11.1253 8.43482 11.1713 8.51069 11.2027C8.58656 11.2342 8.66787 11.2503 8.75 11.2503C8.83212 11.2503 8.91344 11.2342 8.98931 11.2027C9.06518 11.1713 9.13412 11.1253 9.19218 11.0672L11.6922 8.56719C11.7503 8.50914 11.7964 8.44021 11.8278 8.36434C11.8593 8.28846 11.8755 8.20713 11.8755 8.125C11.8755 8.04287 11.8593 7.96154 11.8278 7.88566C11.7964 7.80979 11.7503 7.74086 11.6922 7.68281L9.19218 5.18281C9.07491 5.06554 8.91585 4.99965 8.75 4.99965C8.58414 4.99965 8.42508 5.06554 8.30781 5.18281C8.19053 5.30009 8.12465 5.45915 8.12465 5.625C8.12465 5.79085 8.19053 5.94991 8.30781 6.06719L9.7414 7.5H5C4.83424 7.5 4.67526 7.56585 4.55805 7.68306C4.44084 7.80027 4.375 7.95924 4.375 8.125Z"
                          fill="#FFFFFF"
                        />
                      </svg>
                    </button>
                  </div>
                <div
                  ref={stackedCarouselRef}
                  className="carousel-container carousel-learning scrollbar-hide box-border flex w-full max-h-full min-h-0 flex-nowrap items-end overflow-x-auto overflow-y-hidden"
                  style={{
                    height: 'auto',
                    gap: 5,
                    /* Покарточный скролл (как секции по вертикали). Срыв на соседний слайд при «Информирование» гасится restore по индексу. */
                    scrollSnapType: 'x mandatory',
                    /* auto: иначе при mandatory snap после смены высоты карточки ряд «подползает» вбок. Кнопка «далее» сама передаёт behavior: 'smooth'. */
                    scrollBehavior: 'auto',
                    scrollSnapStop: 'always',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    scrollPaddingLeft: '20px',
                    scrollPaddingRight: '20px',
                    overflowAnchor: 'none',
                    /* touch: убираем momentum-узел iOS — иначе жест «липнет» к горизонтали и ломает плавный вертикальный скролл родителя (snap-y). */
                    WebkitOverflowScrolling: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    overscrollBehaviorX: 'none',
                  }}
                  onScroll={() => {
                    const el = stackedCarouselRef.current;
                    if (
                      carouselLayoutSettlingRef.current &&
                      el &&
                      stackedCarouselScrollLockLeftRef.current != null
                    ) {
                      const lock = stackedCarouselScrollLockLeftRef.current;
                      if (Math.abs(el.scrollLeft - lock) > 0.5) {
                        el.scrollLeft = lock;
                      }
                      return;
                    }
                    updateStackedArrowPosition();
                    updateStackedCarouselMeta();
                  }}
                  onWheel={redirectVerticalWheelFromCarousel}
                >
                <ManaGlassMarketingCarouselCard
                  overrideButtonLabel="Уточнение"
                  forceActionEnabled
                  expandedTitleOverride="Формирование контента"
                  expandedButtonLabelOverride="Уточнение"
                  expandedForceActionEnabled
                  parallelPhase={stackedCardsParallelPhase}
                  onTransitionStart={() => hideStackedArrowDuringCardTransition(0)}
                  isExpanded={expandAllCards}
                  onExpandedChange={setExpandAllCards}
                  onExpandedCollapseStart={handleExpandedCollapseStart}
                  onNavigateToOrder={openConsultationCallbackForm}
                />

                <ManaGlassMarketingCarouselCard
                  initialVariant="site"
                  allowInformSwitch
                  overrideDescription="Наличие комфортного сайта служит важным маркетинговым инструментом малого и среднего предпринимательства"
                  overrideButtonLabel="Уточнение"
                  parallelPhase={stackedCardsParallelPhase}
                  onTransitionStart={() => hideStackedArrowDuringCardTransition(1)}
                  isExpanded={expandAllCards}
                  onExpandedChange={setExpandAllCards}
                  onExpandedCollapseStart={handleExpandedCollapseStart}
                  onNavigateToOrder={openConsultationCallbackForm}
                />

                <ManaGlassMarketingCarouselCard
                  initialVariant="site"
                  allowInformSwitch
                  stackCarouselLast
                  overrideTitle="Формирование имиджа"
                  overrideDescription="Наличие достойного имиджа служит важным маркетинговым инструментом малого и среднего предпринимательства"
                  overridePrice="около 35 тыс. р."
                  overrideButtonLabel="Уточнение"
                  forceActionEnabled
                  onTransitionStart={() => hideStackedArrowDuringCardTransition(2)}
                  isExpanded={expandAllCards}
                  onExpandedChange={setExpandAllCards}
                  onExpandedCollapseStart={handleExpandedCollapseStart}
                  expandedVariant="content"
                  expandedTitleOverride="Формирование имиджа"
                  expandedPriceOverride="около 35 тыс. р."
                  expandedButtonLabelOverride="Уточнение"
                  expandedForceActionEnabled
                  parallelPhase={stackedCardsParallelPhase}
                  onNavigateToOrder={openConsultationCallbackForm}
                />
                </div>
              </div>
            </div>
          </div>
        </div>
      {isGlobalGiftOpen ? (
        <ManaGiftFlowCard
          renderPlaceholder={false}
          onBack={() => {
            setIsGlobalGiftOpen(false);
            setIsGiftOpenInStacked(false);
          }}
          containerStyle={{
            transform: 'translateY(0)',
            opacity: 1,
            transition: 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 460ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      ) : null}

      {consultationFlowOpen && typeof document !== 'undefined'
        ? createPortal(
            <ConsultationFlow
              overlayZIndex={40000}
              onClose={() => setConsultationFlowOpen(false)}
              onSkip={() => setConsultationFlowOpen(false)}
              onSubmit={() => {
                setConsultationFlowOpen(false);
              }}
              onPhoneCallbackBack={() => {
                setConsultationFlowOpen(false);
                setConsultationInitialStep('contact-method');
              }}
              initialStep={consultationInitialStep}
            />,
            document.body
          )
        : null}
    </>
  );
}
