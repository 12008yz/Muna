'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { HINT_TOP } from '@/components/common/ClickOutsideHint';

const PRIVACY_HREF = '/privacy-policy';

function ConsentCheckDarkIcon() {
  return (
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M1 3L3 5L7 1" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FieldErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="rgba(255, 255, 255, 0.5)" />
      <path
        d="M7.38462 4.30769C7.38462 4.14448 7.44945 3.98796 7.56486 3.87255C7.68027 3.75714 7.83679 3.69231 8 3.69231C8.16321 3.69231 8.31974 3.75714 8.43514 3.87255C8.55055 3.98796 8.61539 4.14448 8.61539 4.30769V8.61538C8.61539 8.77859 8.55055 8.93512 8.43514 9.05053C8.31974 9.16593 8.16321 9.23077 8 9.23077C7.83679 9.23077 7.68027 9.16593 7.56486 9.05053C7.44945 8.93512 7.38462 8.77859 7.38462 8.61538V4.30769ZM8 12.3077C7.81743 12.3077 7.63897 12.2536 7.48717 12.1521C7.33537 12.0507 7.21706 11.9065 7.14719 11.7379C7.07732 11.5692 7.05904 11.3836 7.09466 11.2045C7.13028 11.0255 7.21819 10.861 7.34729 10.7319C7.47638 10.6028 7.64086 10.5149 7.81992 10.4793C7.99898 10.4437 8.18458 10.4619 8.35325 10.5318C8.52192 10.6017 8.66608 10.72 8.76751 10.8718C8.86894 11.0236 8.92308 11.202 8.92308 11.3846C8.92308 11.6294 8.82583 11.8642 8.65271 12.0373C8.4796 12.2104 8.24482 12.3077 8 12.3077Z"
        fill="#050505"
      />
    </svg>
  );
}

function FieldSuccessIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="#FFFFFF" />
      <path
        d="M11.5123 6.58923L7.20462 10.8969C7.14747 10.9541 7.0796 10.9995 7.00489 11.0305C6.93018 11.0615 6.8501 11.0774 6.76923 11.0774C6.68836 11.0774 6.60828 11.0615 6.53358 11.0305C6.45887 10.9995 6.391 10.9541 6.33385 10.8969L4.4877 9.05077C4.37222 8.9353 4.30735 8.77868 4.30735 8.61538C4.30735 8.45208 4.37222 8.29547 4.4877 8.18C4.60317 8.06453 4.75978 7.99966 4.92308 7.99966C5.08638 7.99966 5.24299 8.06453 5.35846 8.18L6.76923 9.59154L10.6415 5.71846C10.6987 5.66128 10.7666 5.61593 10.8413 5.58499C10.916 5.55404 10.9961 5.53812 11.0769 5.53812C11.1578 5.53812 11.2379 5.55404 11.3126 5.58499C11.3873 5.61593 11.4551 5.66128 11.5123 5.71846C11.5695 5.77564 11.6148 5.84351 11.6458 5.91822C11.6767 5.99292 11.6927 6.07299 11.6927 6.15384C11.6927 6.2347 11.6767 6.31477 11.6458 6.38947C11.6148 6.46418 11.5695 6.53205 11.5123 6.58923Z"
        fill="#050505"
      />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
        <path
          d="M8.125 0C9.73197 0 11.3029 0.476523 12.639 1.36931C13.9752 2.2621 15.0166 3.53105 15.6315 5.0157C16.2465 6.50035 16.4074 8.13401 16.0939 9.71011C15.7804 11.2862 15.0065 12.7339 13.8702 13.8702C12.7339 15.0065 11.2862 15.7804 9.7101 16.0939C8.13401 16.4074 6.50034 16.2465 5.01569 15.6315C3.53104 15.0166 2.26209 13.9752 1.36931 12.639C0.47652 11.3029 -3.8147e-06 9.73197 -3.8147e-06 8.125C0.00227165 5.97081 0.859026 3.90551 2.38227 2.38227C3.90551 0.85903 5.97081 0.00227486 8.125 0ZM8.125 15C9.48474 15 10.814 14.5968 11.9445 13.8414C13.0751 13.0859 13.9563 12.0122 14.4767 10.7559C14.997 9.49971 15.1332 8.11737 14.8679 6.78375C14.6026 5.45013 13.9478 4.22513 12.9864 3.26364C12.0249 2.30216 10.7999 1.64737 9.46624 1.3821C8.13262 1.11683 6.75029 1.25298 5.49405 1.77333C4.23781 2.29368 3.16408 3.17487 2.40864 4.30545C1.65321 5.43604 1.25 6.76525 1.25 8.125C1.25206 9.94773 1.97706 11.6952 3.26592 12.9841C4.55479 14.2729 6.30227 14.9979 8.125 15ZM4.375 8.125C4.375 8.29076 4.44084 8.44973 4.55805 8.56694C4.67526 8.68415 4.83424 8.75 5 8.75H9.7414L8.30781 10.1828C8.24974 10.2409 8.20368 10.3098 8.17225 10.3857C8.14082 10.4616 8.12465 10.5429 8.12465 10.625C8.12465 10.7071 8.14082 10.7884 8.17225 10.8643C8.20368 10.9402 8.24974 11.0091 8.30781 11.0672C8.36588 11.1253 8.43482 11.1713 8.51069 11.2027C8.58656 11.2342 8.66787 11.2503 8.75 11.2503C8.83212 11.2503 8.91344 11.2342 8.98931 11.2027C9.06518 11.1713 9.13412 11.1253 9.19218 11.0672L11.6922 8.56719C11.7503 8.50914 11.7964 8.44021 11.8278 8.36434C11.8593 8.28846 11.8755 8.20713 11.8755 8.125C11.8755 8.04287 11.8593 7.96154 11.8278 7.88566C11.7964 7.80979 11.7503 7.74086 11.6922 7.68281L9.19218 5.18281C9.07491 5.06554 8.91585 4.99965 8.75 4.99965C8.58414 4.99965 8.42508 5.06554 8.30781 5.18281C8.19053 5.30009 8.12465 5.45915 8.12465 5.625C8.12465 5.79085 8.19053 5.94991 8.30781 6.06719L9.7414 7.5H5C4.83424 7.5 4.67526 7.56585 4.55805 7.68306C4.44084 7.80027 4.375 7.95924 4.375 8.125Z"
          fill="white"
        />
      </svg>
    </span>
  );
}

function SelectedArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="#FFFFFF" />
      <path
        d="M6.41255 4.53019C6.50078 4.44207 6.62039 4.39257 6.7451 4.39257C6.8698 4.39257 6.98941 4.44207 7.07764 4.53019L10.2149 7.66745C10.303 7.75568 10.3525 7.87529 10.3525 8C10.3525 8.1247 10.303 8.24431 10.2149 8.33255L7.07765 11.4698C6.98844 11.5529 6.87045 11.5982 6.74853 11.596C6.62662 11.5939 6.5103 11.5445 6.42408 11.4583C6.33786 11.372 6.28847 11.2557 6.28632 11.1338C6.28417 11.0119 6.32942 10.8939 6.41255 10.8047L9.21647 8L6.41255 5.19529C6.32442 5.10706 6.27492 4.98745 6.27492 4.86274C6.27492 4.73804 6.32442 4.61843 6.41255 4.53019Z"
        fill="#050505"
      />
    </svg>
  );
}

function UnselectedArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M-3.49691e-07 8C-2.80529e-07 9.58225 0.469191 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469191 9.58225 -4.18853e-07 8 -3.49691e-07C5.87903 0.00249074 3.84565 0.846145 2.3459 2.3459C0.846145 3.84565 0.00249042 5.87903 -3.49691e-07 8ZM15.0588 8C15.0588 9.3961 14.6448 10.7609 13.8692 11.9217C13.0936 13.0825 11.9911 13.9872 10.7013 14.5215C9.41146 15.0558 7.99217 15.1956 6.62289 14.9232C5.25361 14.6508 3.99585 13.9785 3.00866 12.9913C2.02146 12.0041 1.34918 10.7464 1.07681 9.37711C0.804443 8.00783 0.944231 6.58854 1.4785 5.2987C2.01276 4.00887 2.91751 2.90644 4.07833 2.1308C5.23914 1.35517 6.60389 0.941176 8 0.941176C9.87148 0.943252 11.6657 1.68761 12.989 3.01095C14.3124 4.33429 15.0567 6.12852 15.0588 8ZM6.41255 4.53019C6.50078 4.44207 6.62039 4.39257 6.7451 4.39257C6.8698 4.39257 6.98941 4.44207 7.07764 4.53019L10.2149 7.66745C10.303 7.75568 10.3525 7.87529 10.3525 8C10.3525 8.1247 10.303 8.24431 10.2149 8.33255L7.07765 11.4698C6.98844 11.5529 6.87045 11.5982 6.74853 11.596C6.62662 11.5939 6.5103 11.5445 6.42408 11.4583C6.33786 11.372 6.28847 11.2557 6.28632 11.1338C6.28417 11.0119 6.32942 10.8939 6.41255 10.8047L9.21647 8L6.41255 5.19529C6.32442 5.10706 6.27492 4.98745 6.27492 4.86274C6.27492 4.73804 6.32442 4.61843 6.41255 4.53019Z"
        fill="rgba(255, 255, 255, 0.5)"
      />
    </svg>
  );
}

const glassSheet = {
  boxSizing: 'border-box',
  background: 'rgba(5, 5, 5, 0.75)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(7.5px)',
  WebkitBackdropFilter: 'blur(7.5px)',
  borderRadius: 20,
};

const involve = { fontFamily: "'TT Firs Neue', system-ui, sans-serif" };
const subtitleTextStyle = {
  ...involve,
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '110%',
  color: 'rgba(255, 255, 255, 0.25)',
  width: 330,
  maxWidth: 330,
  height: 30,
};

export default function ConsultationFlow({
  onClose,
  onSubmit,
  onSkip,
  initialStep = 'contact-method',
  onPhoneCallbackBack,
  overlayZIndex = 20050,
  fluidBackdrop = false,
  fluidOnTop = false,
}) {
  const SAVED_PHONE_KEY = 'leadPhone';
  const modalRootRef = useRef(null);
  const [step, setStep] = useState(initialStep);
  const [displayedStep, setDisplayedStep] = useState(initialStep);
  const [stepVisualState, setStepVisualState] = useState('in');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [contactMethodAttempted, setContactMethodAttempted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const [isBackBtnPressed, setIsBackBtnPressed] = useState(false);
  const [isNextBtnPressed, setIsNextBtnPressed] = useState(false);
  const [isPhoneNextBtnPressed, setIsPhoneNextBtnPressed] = useState(false);

  const [callbackName, setCallbackName] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyConsentTouched, setPrivacyConsentTouched] = useState(false);
  const [callbackFormAttempted, setCallbackFormAttempted] = useState(false);
  const [flowToast, setFlowToast] = useState(null);
  const successSubmitTimerRef = useRef(null);
  const closeAnimationTimerRef = useRef(null);
  const [showPhoneFirstNextButton, setShowPhoneFirstNextButton] = useState(false);
  const stepTransitionTimerRef = useRef(null);
  const stepEnterRafRef = useRef(null);
  const phoneFirstNextButtonTimerRef = useRef(null);

  const clearStepTransitionHandles = useCallback(() => {
    if (stepTransitionTimerRef.current) {
      window.clearTimeout(stepTransitionTimerRef.current);
      stepTransitionTimerRef.current = null;
    }
    if (stepEnterRafRef.current) {
      window.cancelAnimationFrame(stepEnterRafRef.current);
      stepEnterRafRef.current = null;
    }
  }, []);

  const switchStepAnimated = useCallback(
    (nextStep) => {
      if (!nextStep || nextStep === displayedStep) return;
      clearStepTransitionHandles();
      setStepVisualState('out');
      stepTransitionTimerRef.current = window.setTimeout(() => {
        setStep(nextStep);
        setDisplayedStep(nextStep);
        setStepVisualState('enter');
        stepEnterRafRef.current = window.requestAnimationFrame(() => {
          stepEnterRafRef.current = window.requestAnimationFrame(() => {
            setStepVisualState('in');
            stepEnterRafRef.current = null;
          });
        });
        stepTransitionTimerRef.current = null;
      }, 220);
    },
    [clearStepTransitionHandles, displayedStep]
  );

  /* Таймер тоста привязан к toastKey нового показа, не к каждому тику countdown */
  useEffect(() => {
    if (!flowToast || flowToast.countdown <= 0) return undefined;
    const id = window.setInterval(() => {
      setFlowToast((prev) => {
        if (!prev) return null;
        if (prev.countdown <= 1) return null;
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only on new toast
  }, [flowToast?.toastKey]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsAnimating(true);
    });
    try {
      const saved = localStorage.getItem(SAVED_PHONE_KEY);
      if (saved) {
        const digits = saved.replace(/\D/g, '').slice(0, 11);
        const rest = digits.startsWith('7') ? digits.slice(1) : digits.startsWith('8') ? digits.slice(1) : digits;
        let formatted = '+7 ';
        if (rest.length > 0) formatted += rest.slice(0, 3);
        if (rest.length > 3) formatted += ` ${rest.slice(3, 6)}`;
        if (rest.length > 6) formatted += ` ${rest.slice(6, 8)}`;
        if (rest.length > 8) formatted += ` ${rest.slice(8, 10)}`;
        setPhoneNumber(formatted);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const lockedAncestors = [];
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    // В ряде экранов основной скролл сидит не в body, а в fixed/overflow-y-auto контейнере.
    let node = modalRootRef.current?.parentElement ?? null;
    while (node) {
      const styles = window.getComputedStyle(node);
      const overflowY = styles.overflowY;
      const isScrollable = (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') && node.scrollHeight > node.clientHeight + 1;
      if (isScrollable) {
        lockedAncestors.push({ node, prevOverflow: node.style.overflow, prevOverflowY: node.style.overflowY });
        node.style.overflow = 'hidden';
        node.style.overflowY = 'hidden';
      }
      node = node.parentElement;
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      lockedAncestors.forEach(({ node: lockedNode, prevOverflow, prevOverflowY }) => {
        lockedNode.style.overflow = prevOverflow;
        lockedNode.style.overflowY = prevOverflowY;
      });
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let cancelled = false;
    let retryTimer = null;
    let prev = null;
    let previousParent = null;
    let previousNextSibling = null;

    const mountCanvasInsideFlow = () => {
      if (cancelled) return;
      const canvas = window.__fluidCursorInstance?.canvas;
      const host = modalRootRef.current;
      if (!canvas || !host) {
        retryTimer = window.setTimeout(mountCanvasInsideFlow, 120);
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

      // Keep effect inside this screen, above opaque background, below content.
      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '1';
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
      canvas.style.filter = 'blur(0px) saturate(1.7) brightness(1.25) contrast(1.08)';
      canvas.style.mixBlendMode = 'normal';
      canvas.style.pointerEvents = 'none';
    };

    mountCanvasInsideFlow();

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
  }, []);

  useEffect(() => {
    if (!fluidOnTop || typeof window === 'undefined') return undefined;

    let cancelled = false;
    let prev = null;
    let retryTimer = null;

    const applyFluidOnTopStyles = () => {
      if (cancelled) return;
      const canvas = window.__fluidCursorInstance?.canvas;
      if (!canvas) {
        retryTimer = window.setTimeout(applyFluidOnTopStyles, 120);
        return;
      }

      if (!prev) {
        prev = {
          zIndex: canvas.style.zIndex,
          opacity: canvas.style.opacity,
          filter: canvas.style.filter,
          mixBlendMode: canvas.style.mixBlendMode,
          display: canvas.style.display,
        };
      }

      canvas.style.zIndex = String(overlayZIndex + 5);
      canvas.style.display = 'block';
      canvas.style.opacity = '1';
      canvas.style.filter = 'blur(0px) saturate(1.7) brightness(1.25) contrast(1.08)';
      canvas.style.mixBlendMode = 'normal';
    };

    applyFluidOnTopStyles();

    return () => {
      cancelled = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      const canvas = window.__fluidCursorInstance?.canvas;
      if (!canvas || !prev) return;
      canvas.style.zIndex = prev.zIndex;
      canvas.style.opacity = prev.opacity;
      canvas.style.filter = prev.filter;
      canvas.style.mixBlendMode = prev.mixBlendMode;
      canvas.style.display = prev.display;
    };
  }, [fluidOnTop, overlayZIndex]);

  useEffect(() => {
    setStep(initialStep);
    setDisplayedStep(initialStep);
    setStepVisualState('in');
    clearStepTransitionHandles();
  }, [initialStep, clearStepTransitionHandles]);

  useEffect(() => {
    if (phoneFirstNextButtonTimerRef.current) {
      window.clearTimeout(phoneFirstNextButtonTimerRef.current);
      phoneFirstNextButtonTimerRef.current = null;
    }
    if (displayedStep !== 'phone-first') {
      setShowPhoneFirstNextButton(false);
      return;
    }
    setShowPhoneFirstNextButton(false);
    phoneFirstNextButtonTimerRef.current = window.setTimeout(() => {
      setShowPhoneFirstNextButton(true);
      phoneFirstNextButtonTimerRef.current = null;
    }, 3000);
  }, [displayedStep]);

  const handleCloseAnimated = useCallback(
    (afterClose) => {
      if (closeAnimationTimerRef.current) {
        window.clearTimeout(closeAnimationTimerRef.current);
        closeAnimationTimerRef.current = null;
      }
      if (typeof afterClose === 'function') afterClose();
      else {
        setShouldRender(false);
        onClose();
      }
    },
    [onClose]
  );

  const handleCloseImmediate = useCallback(() => {
    if (closeAnimationTimerRef.current) {
      window.clearTimeout(closeAnimationTimerRef.current);
      closeAnimationTimerRef.current = null;
    }
    setShouldRender(false);
    onClose();
  }, [onClose]);

  const formatPhoneNumber = useCallback((value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';

    let formatted = '+7 ';
    const rest = digits.startsWith('7') ? digits.slice(1) : digits.startsWith('8') ? digits.slice(1) : digits;
    if (rest.length > 0) formatted += rest.slice(0, 3);
    if (rest.length > 3) formatted += ` ${rest.slice(3, 6)}`;
    if (rest.length > 6) formatted += ` ${rest.slice(6, 8)}`;
    if (rest.length > 8) formatted += ` ${rest.slice(8, 10)}`;
    return formatted;
  }, []);

  const handlePhoneChange = useCallback(
    (e) => {
      const formatted = formatPhoneNumber(e.target.value);
      setPhoneNumber(formatted);
    },
    [formatPhoneNumber]
  );

  const handlePhoneFocus = useCallback(() => {
    setPhoneNumber((prev) => {
      const digits = prev.replace(/\D/g, '');
      return digits.length === 0 || digits === '7' ? '+7 ' : prev;
    });
  }, []);

  const isPhoneValid = useMemo(() => {
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    return phoneDigits.length === 11;
  }, [phoneNumber]);

  const handleNextFromMethod = useCallback(() => {
    if (!selectedMethod) {
      setContactMethodAttempted(true);
      return;
    }
    if (selectedMethod === 'phone') {
      setContactMethodAttempted(false);
      setCallbackFormAttempted(false);
      setPrivacyConsentTouched(false);
      switchStepAnimated('phone-callback-form');
    } else if (selectedMethod) {
      setContactMethodAttempted(false);
      onSubmit({ phone: phoneNumber, method: selectedMethod });
    }
  }, [selectedMethod, phoneNumber, onSubmit]);

  const handleBack = useCallback(() => {
    if (step === 'phone-callback-form') {
      if (typeof onPhoneCallbackBack === 'function') {
        handleCloseAnimated(onPhoneCallbackBack);
        return;
      }
      clearStepTransitionHandles();
      setStep('contact-method');
      setDisplayedStep('contact-method');
      setStepVisualState('in');
      setCallbackFormAttempted(false);
      setCallbackName('');
      setPrivacyAccepted(false);
      setFlowToast(null);
      if (successSubmitTimerRef.current) {
        window.clearTimeout(successSubmitTimerRef.current);
        successSubmitTimerRef.current = null;
      }
      return;
    }
    else handleCloseAnimated();
  }, [step, onPhoneCallbackBack, handleCloseAnimated, clearStepTransitionHandles]);

  const handleCallbackFormSubmit = useCallback(() => {
    setPrivacyConsentTouched(true);
    const nameOk = callbackName.trim().length > 0;
    if (!nameOk || !isPhoneValid || !privacyAccepted) {
      setCallbackFormAttempted(true);
      setFlowToast({
        kind: 'error',
        message: 'Информация не заполнена',
        countdown: 7,
        toastKey: Date.now(),
      });
      return;
    }
    try {
      localStorage.setItem(SAVED_PHONE_KEY, phoneNumber);
    } catch {
      // ignore
    }
    if (successSubmitTimerRef.current) window.clearTimeout(successSubmitTimerRef.current);
    setFlowToast({
      kind: 'success',
      message: 'Информация отправлена',
      countdown: 7,
      toastKey: Date.now(),
    });
    successSubmitTimerRef.current = window.setTimeout(() => {
      successSubmitTimerRef.current = null;
      onSubmit({ phone: phoneNumber, method: 'phone', name: callbackName.trim() });
    }, 2500);
  }, [callbackName, isPhoneValid, privacyAccepted, phoneNumber, onSubmit, SAVED_PHONE_KEY]);

  useEffect(
    () => () => {
      if (successSubmitTimerRef.current) window.clearTimeout(successSubmitTimerRef.current);
      clearStepTransitionHandles();
      if (phoneFirstNextButtonTimerRef.current) window.clearTimeout(phoneFirstNextButtonTimerRef.current);
      if (closeAnimationTimerRef.current) window.clearTimeout(closeAnimationTimerRef.current);
    },
    [clearStepTransitionHandles]
  );

  const handleBackgroundClick = useCallback((e) => {
    // Пустой клик больше не закрывает модалку.
    e.stopPropagation();
  }, []);

  // Opaque screen to hide page + transparent inner layer so fluid canvas stays visible.
  const modalBackdropColor = '#050505';
  const modalLayerColor = 'transparent';

  const renderContactMethod = () => {
    const showRequired = contactMethodAttempted && !selectedMethod;
    const optionBase = {
      height: '50px',
      borderRadius: '10px',
      paddingLeft: '15px',
      paddingRight: '15px',
    };

    return (
      <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden" style={{ background: modalLayerColor }}>
        <div className="relative flex-shrink-0" style={{ minHeight: '105px' }}>
          <div
            className="absolute left-0 right-0"
            style={{ top: HINT_TOP, left: 'var(--main-block-margin)', right: 'var(--main-block-margin)' }}
          >
            <button
              type="button"
              onClick={handleCloseImmediate}
              className="box-border flex h-10 w-10 items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[#050505] backdrop-blur-[5px] transition-opacity hover:opacity-90"
              aria-label="Свернуть окно"
            >
              <CollapseIcon />
            </button>
          </div>
        </div>

        <div
          data-fluid-cursor-block
          className="mx-auto flex w-full min-w-0 flex-col"
          style={{
            ...glassSheet,
            marginLeft: 'var(--main-block-margin)',
            marginRight: 'var(--main-block-margin)',
            width: 'calc(100% - 2 * var(--main-block-margin))',
            minWidth: 0,
            maxWidth: 390,
            height: 335,
            minHeight: 335,
            marginTop: 'auto',
            marginBottom: 0,
            padding: '15px',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              ...involve,
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '110%',
              color: '#FFFFFF',
              marginBottom: '5px',
            }}
          >
            Взаимодействие
          </div>
          <div style={{ ...subtitleTextStyle, marginBottom: '20px' }}>
            Навязывание ненужного отсутствует.
            <br />
            Рекламирование ненужного тоже отсутствует.
          </div>

          <div className="flex flex-col gap-[5px]" style={{ marginBottom: '15px' }}>
            <div
              className="flex items-center justify-between"
              style={{
                ...optionBase,
                border: showRequired ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
                opacity: 0.25,
              }}
            >
              <span style={{ ...involve, fontWeight: 400, fontSize: '16px', lineHeight: '125%', color: '#FFFFFF' }}>Написать нам в «Макс»</span>
              <div className="flex h-4 w-4 items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path
                    d="M10.8424 5.82274L8.6651 8L10.8424 10.1773C10.8886 10.2203 10.9257 10.2723 10.9514 10.33C10.9771 10.3877 10.9909 10.4501 10.9921 10.5132C10.9932 10.5764 10.9816 10.6392 10.9579 10.6978C10.9342 10.7564 10.899 10.8096 10.8543 10.8543C10.8096 10.899 10.7564 10.9342 10.6978 10.9579C10.6392 10.9815 10.5764 10.9932 10.5132 10.9921C10.4501 10.9909 10.3877 10.9771 10.33 10.9514C10.2723 10.9257 10.2203 10.8886 10.1773 10.8424L8 8.6651L5.82275 10.8424C5.73354 10.9255 5.61555 10.9707 5.49364 10.9686C5.37172 10.9664 5.2554 10.917 5.16918 10.8308C5.08296 10.7446 5.03357 10.6283 5.03142 10.5064C5.02927 10.3844 5.07452 10.2665 5.15765 10.1773L7.3349 8L5.15765 5.82274C5.07452 5.73354 5.02927 5.61555 5.03142 5.49363C5.03357 5.37172 5.08296 5.2554 5.16918 5.16918C5.2554 5.08296 5.37172 5.03357 5.49364 5.03142C5.61555 5.02927 5.73354 5.07452 5.82275 5.15765L8 7.3349L10.1773 5.15765C10.2665 5.07452 10.3845 5.02927 10.5064 5.03142C10.6283 5.03357 10.7446 5.08296 10.8308 5.16918C10.917 5.2554 10.9664 5.37172 10.9686 5.49363C10.9707 5.61555 10.9255 5.73354 10.8424 5.82274ZM16 8C16 9.58225 15.5308 11.129 14.6518 12.4446C13.7727 13.7602 12.5233 14.7855 11.0615 15.391C9.59966 15.9965 7.99113 16.155 6.43928 15.8463C4.88743 15.5376 3.46197 14.7757 2.34315 13.6569C1.22433 12.538 0.462403 11.1126 0.153721 9.56072C-0.15496 8.00887 0.00346614 6.40034 0.608967 4.93853C1.21447 3.47672 2.23985 2.22729 3.55544 1.34824C4.87103 0.469192 6.41775 0 8 0C10.121 0.00249086 12.1544 0.846145 13.6541 2.3459C15.1539 3.84565 15.9975 5.87903 16 8ZM15.0588 8C15.0588 6.6039 14.6448 5.23914 13.8692 4.07833C13.0936 2.91751 11.9911 2.01276 10.7013 1.4785C9.41146 0.944232 7.99217 0.804443 6.62289 1.07681C5.25362 1.34918 3.99585 2.02146 3.00866 3.00866C2.02147 3.99585 1.34918 5.25361 1.07681 6.62289C0.804447 7.99217 0.944235 9.41146 1.4785 10.7013C2.01277 11.9911 2.91751 13.0936 4.07833 13.8692C5.23915 14.6448 6.6039 15.0588 8 15.0588C9.87148 15.0567 11.6657 14.3124 12.989 12.989C14.3124 11.6657 15.0567 9.87148 15.0588 8Z"
                    fill="#FFFFFF"
                  />
                </svg>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center justify-between cursor-pointer"
              style={{
                ...optionBase,
                border: selectedMethod === 'telegram' || showRequired ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
              }}
              onClick={() => {
                setSelectedMethod('telegram');
                setContactMethodAttempted(false);
              }}
            >
              <span style={{ ...involve, fontWeight: 400, fontSize: '16px', lineHeight: '125%', color: selectedMethod === 'telegram' ? '#FFFFFF' : 'rgba(255,255,255,0.5)' }}>
                Написать нам в «Телеграм»
              </span>
              <div className="flex h-4 w-4 items-center justify-center">
                {selectedMethod === 'telegram' ? <SelectedArrowIcon /> : <UnselectedArrowIcon />}
              </div>
            </button>

            <button
              type="button"
              className="flex items-center justify-between cursor-pointer"
              style={{
                ...optionBase,
                border: selectedMethod === 'phone' || showRequired ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.25)',
              }}
              onClick={() => {
                setSelectedMethod('phone');
                setContactMethodAttempted(false);
              }}
            >
              <span style={{ ...involve, fontWeight: 400, fontSize: '16px', lineHeight: '125%', color: selectedMethod === 'phone' ? '#FFFFFF' : 'rgba(255,255,255,0.5)' }}>
                Перезвонить на номер телефона
              </span>
              <div className="flex h-4 w-4 items-center justify-center">
                {selectedMethod === 'phone' ? <SelectedArrowIcon /> : <UnselectedArrowIcon />}
              </div>
            </button>
          </div>

          <div className="flex items-center gap-[5px]">
            <button
              type="button"
              onClick={handleBack}
              onMouseDown={() => setIsBackBtnPressed(true)}
              onMouseUp={() => setIsBackBtnPressed(false)}
              onMouseLeave={() => setIsBackBtnPressed(false)}
              onTouchStart={() => setIsBackBtnPressed(true)}
              onTouchEnd={() => setIsBackBtnPressed(false)}
              className="flex h-[50px] w-[50px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] outline-none"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'transparent',
                transform: isBackBtnPressed ? 'scale(0.92)' : 'scale(1)',
                transition: 'transform 0.15s ease-out',
              }}
            >
              <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }}>
                <path d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 -5.34251e-07 6 -5.24537e-07C6.11112 -5.14822e-07 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z" fill="#FFFFFF" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNextFromMethod}
              onMouseDown={() => setIsNextBtnPressed(true)}
              onMouseUp={() => setIsNextBtnPressed(false)}
              onMouseLeave={() => setIsNextBtnPressed(false)}
              onTouchStart={() => setIsNextBtnPressed(true)}
              onTouchEnd={() => setIsNextBtnPressed(false)}
              className="h-[50px] flex-1 cursor-pointer rounded-[10px] outline-none disabled:cursor-not-allowed"
              style={{
                ...involve,
                fontSize: '16px',
                lineHeight: '315%',
                border: !contactMethodAttempted || selectedMethod ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
                background: !contactMethodAttempted || selectedMethod ? '#FFFFFF' : 'transparent',
                color: !contactMethodAttempted || selectedMethod ? '#050505' : '#FFFFFF',
                opacity: !contactMethodAttempted || selectedMethod ? 1 : 0.25,
                transform: isNextBtnPressed && (!contactMethodAttempted || selectedMethod) ? 'scale(0.97)' : 'scale(1)',
                transition: 'transform 0.15s ease-out',
              }}
            >
              Далее
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPhoneCallbackForm = () => {
    const nameOk = callbackName.trim().length > 0;
    const nameErr = callbackFormAttempted && !nameOk;
    const phoneErr = callbackFormAttempted && !isPhoneValid;
    const nameTrail = nameErr || nameOk;
    const phoneTrail = phoneErr || isPhoneValid;
    const privacyShowStrongBorder = !privacyAccepted && privacyConsentTouched && callbackFormAttempted;
    const stackMuted = 'rgba(255, 255, 255, 0.25)';
    const stackStrong = 'rgba(255, 255, 255, 0.85)';
    const formCanSubmit = nameOk && isPhoneValid && privacyAccepted;
    const callbackNextSolid = !callbackFormAttempted || formCanSubmit;

    return (
      <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden" style={{ background: modalLayerColor }}>
        <div className="relative flex-shrink-0" style={{ minHeight: '105px' }}>
          <div
            className="absolute left-0 right-0"
            style={{ top: HINT_TOP, left: 'var(--main-block-margin)', right: 'var(--main-block-margin)' }}
          >
            <button
              type="button"
              onClick={handleCloseImmediate}
              className="box-border flex h-10 w-10 items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[#050505] backdrop-blur-[5px] transition-opacity hover:opacity-90"
              aria-label="Свернуть окно"
            >
              <CollapseIcon />
            </button>
          </div>
        </div>
        <div
          data-fluid-cursor-block
          className="mx-auto flex w-full min-w-0 flex-col"
          style={{
            ...glassSheet,
            marginLeft: 'var(--main-block-margin)',
            marginRight: 'var(--main-block-margin)',
            width: 'calc(100% - 2 * var(--main-block-margin))',
            minWidth: 0,
            maxWidth: 390,
            height: 335,
            minHeight: 335,
            marginTop: 'auto',
            marginBottom: 0,
            padding: '15px',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              ...involve,
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '110%',
              color: '#FFFFFF',
              marginBottom: '5px',
            }}
          >
            Взаимодействие
          </div>
        <div style={{ ...subtitleTextStyle, marginBottom: '20px' }}>
            Навязывание ненужного отсутствует.
            <br />
            Рекламирование ненужного тоже отсутствует.
          </div>

          <div className="flex flex-col gap-[5px]" style={{ marginBottom: '5px' }}>
            <label className="sr-only" htmlFor="consult-callback-name">
              Имя
            </label>
            <div className="relative w-full">
              <input
                id="consult-callback-name"
                type="text"
                autoComplete="name"
                placeholder="Имя"
                value={callbackName}
                onChange={(e) => setCallbackName(e.target.value)}
                className="box-border w-full rounded-[10px] border border-solid bg-transparent px-[15px] outline-none placeholder:text-[rgba(255,255,255,0.25)]"
                style={{
                  ...involve,
                  height: 50,
                  minHeight: 50,
                  paddingRight: nameTrail ? 39 : 16,
                  fontSize: 16,
                  lineHeight: '125%',
                  color: '#FFFFFF',
                  borderColor: nameErr ? stackStrong : stackMuted,
                }}
              />
              {nameErr ? (
                <span className="pointer-events-none absolute right-[15px] top-1/2 flex h-4 w-4 -translate-y-1/2" aria-hidden>
                  <FieldErrorIcon />
                </span>
              ) : nameOk ? (
                <span className="pointer-events-none absolute right-[15px] top-1/2 flex h-4 w-4 -translate-y-1/2" aria-hidden>
                  <FieldSuccessIcon />
                </span>
              ) : null}
            </div>

            <label className="sr-only" htmlFor="consult-callback-phone">
              Номер сотового телефона
            </label>
            <div className="relative w-full">
              <input
                id="consult-callback-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phoneNumber}
                onFocus={handlePhoneFocus}
                onChange={handlePhoneChange}
                placeholder="Номер сотового телефона"
                className="box-border w-full rounded-[10px] border border-solid bg-transparent px-[15px] outline-none placeholder:text-[rgba(255,255,255,0.25)]"
                style={{
                  ...involve,
                  height: 50,
                  minHeight: 50,
                  paddingRight: phoneTrail ? 39 : 16,
                  fontSize: 16,
                  lineHeight: '125%',
                  color: '#FFFFFF',
                  borderColor: phoneErr ? stackStrong : isPhoneValid ? 'rgba(255, 255, 255, 0.5)' : stackMuted,
                }}
              />
              {phoneErr ? (
                <span className="pointer-events-none absolute right-[15px] top-1/2 flex h-4 w-4 -translate-y-1/2" aria-hidden>
                  <FieldErrorIcon />
                </span>
              ) : isPhoneValid ? (
                <span className="pointer-events-none absolute right-[15px] top-1/2 flex h-4 w-4 -translate-y-1/2" aria-hidden>
                  <FieldSuccessIcon />
                </span>
              ) : null}
            </div>
          </div>

          <div className="mb-[15px] mt-0 w-full min-w-0 shrink-0">
            <button
              type="button"
              className="relative box-border flex w-full min-w-0 cursor-pointer items-center rounded-[10px] border border-solid bg-transparent text-left outline-none focus:outline-none"
              style={{
                minHeight: 50,
                paddingLeft: 15,
                paddingRight: 10,
                boxSizing: 'border-box',
                borderColor: privacyAccepted ? stackMuted : privacyShowStrongBorder ? stackStrong : 'rgba(255, 255, 255, 0.1)',
              }}
              onClick={() => {
                setPrivacyConsentTouched(true);
                setPrivacyAccepted(!privacyAccepted);
              }}
            >
              <span
                className="flex flex-shrink-0 items-center justify-center rounded-full border border-solid box-border"
                style={{
                  width: 16,
                  height: 16,
                  marginRight: 10,
                  borderColor: privacyAccepted ? 'transparent' : privacyShowStrongBorder ? stackStrong : 'rgba(255, 255, 255, 0.5)',
                  background: privacyAccepted ? '#FFFFFF' : 'transparent',
                }}
              >
                {privacyAccepted ? <ConsentCheckDarkIcon /> : null}
              </span>
              <span
                className="text-[14px] font-normal text-white"
                style={{
                  ...involve,
                  flex: 1,
                  minWidth: 0,
                  lineHeight: '110%',
                  display: 'block',
                  paddingTop: 1,
                }}
              >
                Я, полностью соглашаюсь с условиями{' '}
                <Link
                  href={PRIVACY_HREF}
                  className="text-white underline decoration-solid [text-underline-offset:3px]"
                  style={{ textDecorationSkipInk: 'none' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  политики конфиденциальности
                </Link>{' '}
                сайта
              </span>
            </button>
          </div>

          <div className="flex items-center gap-[5px]">
            <button
              type="button"
              onClick={handleBack}
              onMouseDown={() => setIsBackBtnPressed(true)}
              onMouseUp={() => setIsBackBtnPressed(false)}
              onMouseLeave={() => setIsBackBtnPressed(false)}
              onTouchStart={() => setIsBackBtnPressed(true)}
              onTouchEnd={() => setIsBackBtnPressed(false)}
              className="flex h-[50px] w-[50px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] outline-none"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'transparent',
                transform: isBackBtnPressed ? 'scale(0.92)' : 'scale(1)',
                transition: 'transform 0.15s ease-out',
              }}
            >
              <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }}>
                <path d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 -5.34251e-07 6 -5.24537e-07C6.11112 -5.14822e-07 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z" fill="#FFFFFF" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleCallbackFormSubmit}
              onMouseDown={() => setIsPhoneNextBtnPressed(true)}
              onMouseUp={() => setIsPhoneNextBtnPressed(false)}
              onMouseLeave={() => setIsPhoneNextBtnPressed(false)}
              onTouchStart={() => setIsPhoneNextBtnPressed(true)}
              onTouchEnd={() => setIsPhoneNextBtnPressed(false)}
              className="h-[50px] flex-1 cursor-pointer rounded-[10px] outline-none"
              style={{
                ...involve,
                fontSize: '16px',
                lineHeight: '315%',
                border: callbackNextSolid ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
                background: callbackNextSolid ? '#FFFFFF' : 'transparent',
                color: callbackNextSolid ? '#050505' : '#FFFFFF',
                opacity: callbackNextSolid ? 1 : 0.25,
                transform: isPhoneNextBtnPressed && callbackNextSolid ? 'scale(0.97)' : 'scale(1)',
                transition: 'transform 0.15s ease-out',
              }}
            >
              Далее
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPhoneFirst = () => (
    <div
      className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-[#050505]"
      style={{ background: modalLayerColor }}
    >
      <div className="relative flex-shrink-0" style={{ minHeight: '105px' }}>
        <div
          className="absolute left-0 right-0"
          style={{ top: HINT_TOP, left: 'var(--main-block-margin)', right: 'var(--main-block-margin)' }}
        >
          <button
            type="button"
            onClick={handleCloseImmediate}
            className="box-border flex h-10 w-10 items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[#050505] backdrop-blur-[5px] transition-opacity hover:opacity-90"
            aria-label="Свернуть окно"
          >
            <CollapseIcon />
          </button>
        </div>
      </div>
      <div
        data-fluid-cursor-block
        className="mx-auto flex w-full min-w-0 flex-col"
        style={{
          ...glassSheet,
          marginLeft: 'var(--main-block-margin)',
          marginRight: 'var(--main-block-margin)',
          width: 'calc(100% - 2 * var(--main-block-margin))',
          minWidth: 0,
          maxWidth: 390,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 'auto',
          marginBottom: 0,
          padding: '15px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ ...involve, fontWeight: 400, fontSize: '20px', lineHeight: '125%', color: '#FFFFFF', marginBottom: '15px' }}>Консультация</div>
        <div style={{ ...subtitleTextStyle, marginBottom: '20px' }}>
          Напишите номер вашего сотового телефона. Пожалуйста, проверьте правильность
        </div>
        <div
          className="mb-[20px] w-full rounded-[10px]"
          style={{
            height: '50px',
            border: isPhoneValid ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <input
            type="tel"
            value={phoneNumber}
            onFocus={handlePhoneFocus}
            onChange={handlePhoneChange}
            placeholder="Номер сотового телефона"
            className="h-full w-full rounded-[10px] bg-transparent px-[15px] outline-none placeholder:text-[rgba(255,255,255,0.25)]"
            style={{
              ...involve,
              fontSize: '16px',
              lineHeight: '125%',
              color: '#FFFFFF',
              letterSpacing: '0.5px',
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!isPhoneValid) return;
            setSelectedMethod('phone');
            switchStepAnimated('contact-method');
          }}
          disabled={!isPhoneValid}
          className="w-full cursor-pointer rounded-[10px] outline-none disabled:cursor-not-allowed"
          style={{
            ...involve,
            height: '50px',
            fontSize: '16px',
            lineHeight: '315%',
            border: isPhoneValid ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
            background: isPhoneValid ? '#FFFFFF' : 'transparent',
            color: isPhoneValid ? '#050505' : '#FFFFFF',
            opacity: showPhoneFirstNextButton ? (isPhoneValid ? 1 : 0.25) : 0,
            transform: showPhoneFirstNextButton ? 'translateY(0)' : 'translateY(8px)',
            pointerEvents: showPhoneFirstNextButton ? 'auto' : 'none',
            transition: 'opacity 1040ms cubic-bezier(0.22, 1, 0.36, 1), transform 1040ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          Далее
        </button>
      </div>
    </div>
  );

  if (!shouldRender) return null;

  return (
    <div
      ref={modalRootRef}
      data-vertical-scroll-handle=""
      className="fixed inset-0 flex w-full min-w-0 cursor-default flex-col items-stretch overflow-hidden"
      style={{
        zIndex: overlayZIndex,
        opacity: isAnimating ? 1 : 0,
        transform: isAnimating ? 'translateY(0)' : 'translateY(12px)',
        transition: 'none',
        paddingTop: 'var(--sat, 0px)',
        paddingBottom: 'calc(var(--main-block-margin) + var(--sab, 0px))',
        height: '100dvh',
        boxSizing: 'border-box',
        background: modalBackdropColor,
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      }}
      onClick={handleBackgroundClick}
    >
      <div
        className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden"
        style={{
          zIndex: 3,
          transform: isAnimating ? 'scale(1)' : 'scale(0.985)',
          transition: 'none',
          boxSizing: 'border-box',
          background: modalLayerColor,
        }}
      >
        <div className="absolute inset-0" style={{ background: modalLayerColor }} aria-hidden />
        <div
          className="h-full min-h-0 w-full min-w-0"
          style={{
            transform: stepVisualState === 'in' ? 'translateY(0)' : 'translateY(24px)',
            opacity: stepVisualState === 'in' ? 1 : 0,
            transition: 'none',
          }}
        >
          {displayedStep === 'contact-method' && renderContactMethod()}
          {displayedStep === 'phone-callback-form' && renderPhoneCallbackForm()}
          {displayedStep === 'phone-first' && renderPhoneFirst()}
        </div>
      </div>
      {flowToast ? (
        <div
          data-fluid-cursor-block
          role="status"
          className="fixed z-[10051] box-border"
          style={{
            left: 'var(--main-block-margin)',
            top: 'var(--notification-top)',
            width: 360,
            height: 70,
            boxSizing: 'border-box',
            background: 'rgba(5, 5, 5, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(7.5px)',
            WebkitBackdropFilter: 'blur(7.5px)',
            borderRadius: 20,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="absolute left-[15px] top-[15px] z-0 box-border flex h-[15px] w-[330px] items-center overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              ...involve,
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '105%',
              color: 'rgba(255, 255, 255, 0.25)',
            }}
          >
            Автоматически закроется через {flowToast.countdown}
          </span>
          <p
            className="absolute left-[15px] top-[40px] m-0 box-border h-[15px] w-[330px] overflow-hidden text-ellipsis whitespace-nowrap"
            style={{
              ...involve,
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '110%',
              color: '#FFFFFF',
            }}
          >
            {flowToast.message}
          </p>
        </div>
      ) : null}
    </div>
  );
}
