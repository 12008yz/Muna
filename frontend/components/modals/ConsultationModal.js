'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { HINT_TOP } from '@/components/common/ClickOutsideHint';

const involve = {
  fontFamily: 'var(--font-involve), system-ui, sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSynthesis: 'none',
};
const SAVED_PHONE_KEY = 'leadPhone';

/** Как карточка мастера в OrderCreationLandingPage (Figma) */
const cardTitleStyle = {
  ...involve,
  width: 330,
  maxWidth: '100%',
  height: 20,
  minHeight: 20,
  fontSize: 18,
  lineHeight: '110%',
  color: '#101010',
  display: 'flex',
  alignItems: 'center',
  marginBottom: 10,
};

const cardSubtitleStyle = {
  ...involve,
  width: 330,
  maxWidth: '100%',
  minHeight: 15,
  fontSize: 14,
  lineHeight: '110%',
  color: 'rgba(16, 16, 16, 0.5)',
  marginBottom: 20,
};

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

/** Чёрный круг с белым «!» — ошибка поля */
function FieldErrorIcon() {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#101010]" aria-hidden>
      <span className="text-[10px] font-bold leading-none text-white" style={involve}>
        !
      </span>
    </span>
  );
}

/** Серый круг с белой галочкой — валидное поле */
function FieldSuccessIcon() {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[rgba(16,16,16,0.35)]" aria-hidden>
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 3L3 5L7 1" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function isNameValid(name) {
  return name.trim().length >= 2;
}

export default function ConsultationModal({ isOpen, onClose, onComplete }) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+7 ');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setShouldRender(true);
    setName('');
    try {
      const saved = localStorage.getItem(SAVED_PHONE_KEY);
      if (saved) {
        const digits = saved.replace(/\D/g, '').slice(0, 11);
        const rest = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits;
        let formatted = '+7 ';
        if (rest.length > 0) formatted += rest.slice(0, 3);
        if (rest.length > 3) formatted += ` ${rest.slice(3, 6)}`;
        if (rest.length > 6) formatted += ` ${rest.slice(6, 8)}`;
        if (rest.length > 8) formatted += ` ${rest.slice(8, 10)}`;
        setPhoneNumber(formatted || '+7 ');
      } else {
        setPhoneNumber('+7 ');
      }
    } catch {
      setPhoneNumber('+7 ');
    }
    setSubmitAttempted(false);
    requestAnimationFrame(() => setIsAnimating(true));
  }, [isOpen]);

  const formatPhoneNumber = useCallback((value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    const rest = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits;
    let formatted = '+7 ';
    if (rest.length > 0) formatted += rest.slice(0, 3);
    if (rest.length > 3) formatted += ` ${rest.slice(3, 6)}`;
    if (rest.length > 6) formatted += ` ${rest.slice(6, 8)}`;
    if (rest.length > 8) formatted += ` ${rest.slice(8, 10)}`;
    return formatted;
  }, []);

  const phoneValid = useMemo(() => phoneNumber.replace(/\D/g, '').length === 11, [phoneNumber]);
  const nameValid = useMemo(() => isNameValid(name), [name]);
  const formValid = nameValid && phoneValid;

  /** Как «Формирование» на OrderCreationLandingPage: сначала активная чёрная кнопка; после попытки с ошибкой — светлая, пока форма невалидна */
  const confirmButtonSolid = !submitAttempted || formValid;

  const nameShowError = submitAttempted && !nameValid;
  const phoneShowError = submitAttempted && !phoneValid;
  const nameShowSuccess = nameValid && name.trim().length > 0;
  const phoneShowSuccess = phoneValid;

  const closeWithAnimation = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300);
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    if (!formValid) {
      setSubmitAttempted(true);
      return;
    }
    try {
      localStorage.setItem(SAVED_PHONE_KEY, phoneNumber);
    } catch {
      // ignore
    }
    if (typeof onComplete === 'function') onComplete({ name: name.trim(), phone: phoneNumber });
    closeWithAnimation();
  }, [closeWithAnimation, formValid, name, onComplete, phoneNumber]);

  if (!isOpen && !shouldRender) return null;

  const borderDefault = '1px solid rgba(16, 16, 16, 0.25)';
  const borderError = '1px solid #101010';
  const borderName = nameShowError ? borderError : borderDefault;
  const borderPhone = phoneShowError ? borderError : borderDefault;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center overflow-hidden cursor-pointer bg-[#F5F5F5]"
      style={{
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        paddingTop: 'var(--sat, 0px)',
        paddingBottom: 'calc(20px + var(--sab, 0px))',
        height: '100dvh',
        boxSizing: 'border-box',
      }}
      onClick={closeWithAnimation}
    >
      <div
        className="relative flex h-full w-full max-w-[400px] flex-col overflow-hidden bg-[#F5F5F5]"
        style={{
          transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div className="relative flex-shrink-0 cursor-pointer" style={{ minHeight: '105px' }}>
          <div className="absolute left-0 right-0" style={{ top: HINT_TOP, left: 20, right: 20 }}>
            <button
              type="button"
              onClick={closeWithAnimation}
              className="box-border flex h-10 max-w-[175px] items-center gap-2 rounded-[20px] border border-white/50 bg-white pl-2 pr-3 backdrop-blur-[5px] transition-opacity hover:opacity-90"
            >
              <CollapseIcon />
              <span className="text-[12px] leading-[40px] text-[rgba(16,16,16,0.5)]" style={{ ...involve, fontSize: 12 }}>
                сворачивание окна
              </span>
            </button>
          </div>
        </div>

        <div
          className="mx-auto mt-auto flex w-[360px] max-w-[90%] flex-col rounded-[20px] bg-white"
          style={{ padding: 15, marginBottom: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="m-0 flex max-w-full items-center self-stretch" style={cardTitleStyle}>
            Консультирование
          </h2>
          <p className="m-0 flex max-w-full items-center self-stretch" style={cardSubtitleStyle}>
            Рекламы нет, только ваши вопросы{' '}
            <span style={{ color: '#EF4444' }} aria-hidden>
              ❣️
            </span>
          </p>

          <div className="flex flex-col gap-[5px]" style={{ marginBottom: 20 }}>
            <div className="relative">
              <input
                type="text"
                name="consultation-name"
                autoComplete="name"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="box-border w-full rounded-[10px] bg-white pl-[15px] outline-none placeholder:text-[rgba(16,16,16,0.35)]"
                style={{
                  ...involve,
                  height: 50,
                  paddingRight: 44,
                  fontSize: 16,
                  lineHeight: '125%',
                  color: '#101010',
                  border: borderName,
                }}
              />
              <span className="pointer-events-none absolute right-[15px] top-1/2 flex -translate-y-1/2 items-center">
                {nameShowError ? <FieldErrorIcon /> : null}
                {!nameShowError && nameShowSuccess ? <FieldSuccessIcon /> : null}
              </span>
            </div>

            <div className="relative">
              <input
                type="tel"
                name="consultation-phone"
                autoComplete="tel"
                placeholder="Номер сотового телефона"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value) || '+7 ')}
                className="box-border w-full rounded-[10px] bg-white pl-[15px] outline-none placeholder:text-[rgba(16,16,16,0.35)]"
                style={{
                  ...involve,
                  height: 50,
                  paddingRight: 44,
                  fontSize: 16,
                  lineHeight: '125%',
                  color: '#101010',
                  border: borderPhone,
                }}
              />
              <span className="pointer-events-none absolute right-[15px] top-1/2 flex -translate-y-1/2 items-center">
                {phoneShowError ? <FieldErrorIcon /> : null}
                {!phoneShowError && phoneShowSuccess ? <FieldSuccessIcon /> : null}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="box-border w-full rounded-[10px] border-none outline-none transition-[background,color] duration-150 focus:outline-none"
            style={{
              ...involve,
              height: 50,
              minHeight: 50,
              fontSize: 16,
              lineHeight: '315%',
              cursor: 'pointer',
              background: confirmButtonSolid ? '#101010' : '#FFFFFF',
              color: confirmButtonSolid ? '#FFFFFF' : 'rgba(16, 16, 16, 0.5)',
            }}
          >
            Подтверждение
          </button>
        </div>
      </div>
    </div>
  );
}
