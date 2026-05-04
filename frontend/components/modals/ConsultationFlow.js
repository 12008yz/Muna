'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { HINT_TOP } from '@/components/common/ClickOutsideHint';
import { dispatchNavigateToOrderLanding } from '@/lib/navigateToOrderLanding';

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

function SelectedArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="#101010" />
      <path
        d="M6.41255 4.53019C6.50078 4.44207 6.62039 4.39257 6.7451 4.39257C6.8698 4.39257 6.98941 4.44207 7.07764 4.53019L10.2149 7.66745C10.303 7.75568 10.3525 7.87529 10.3525 8C10.3525 8.1247 10.303 8.24431 10.2149 8.33255L7.07765 11.4698C6.98844 11.5529 6.87045 11.5982 6.74853 11.596C6.62662 11.5939 6.5103 11.5445 6.42408 11.4583C6.33786 11.372 6.28847 11.2557 6.28632 11.1338C6.28417 11.0119 6.32942 10.8939 6.41255 10.8047L9.21647 8L6.41255 5.19529C6.32442 5.10706 6.27492 4.98745 6.27492 4.86274C6.27492 4.73804 6.32442 4.61843 6.41255 4.53019Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function UnselectedArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M-3.49691e-07 8C-2.80529e-07 9.58225 0.469191 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469191 9.58225 -4.18853e-07 8 -3.49691e-07C5.87903 0.00249074 3.84565 0.846145 2.3459 2.3459C0.846145 3.84565 0.00249042 5.87903 -3.49691e-07 8ZM15.0588 8C15.0588 9.3961 14.6448 10.7609 13.8692 11.9217C13.0936 13.0825 11.9911 13.9872 10.7013 14.5215C9.41146 15.0558 7.99217 15.1956 6.62289 14.9232C5.25361 14.6508 3.99585 13.9785 3.00866 12.9913C2.02146 12.0041 1.34918 10.7464 1.07681 9.37711C0.804443 8.00783 0.944231 6.58854 1.4785 5.2987C2.01276 4.00887 2.91751 2.90644 4.07833 2.1308C5.23914 1.35517 6.60389 0.941176 8 0.941176C9.87148 0.943252 11.6657 1.68761 12.989 3.01095C14.3124 4.33429 15.0567 6.12852 15.0588 8ZM6.41255 4.53019C6.50078 4.44207 6.62039 4.39257 6.7451 4.39257C6.8698 4.39257 6.98941 4.44207 7.07764 4.53019L10.2149 7.66745C10.303 7.75568 10.3525 7.87529 10.3525 8C10.3525 8.1247 10.303 8.24431 10.2149 8.33255L7.07765 11.4698C6.98844 11.5529 6.87045 11.5982 6.74853 11.596C6.62662 11.5939 6.5103 11.5445 6.42408 11.4583C6.33786 11.372 6.28847 11.2557 6.28632 11.1338C6.28417 11.0119 6.32942 10.8939 6.41255 10.8047L9.21647 8L6.41255 5.19529C6.32442 5.10706 6.27492 4.98745 6.27492 4.86274C6.27492 4.73804 6.32442 4.61843 6.41255 4.53019Z"
        fill="#101010"
        fillOpacity={0.5}
      />
    </svg>
  );
}

export default function ConsultationFlow({ onClose, onSubmit, onSkip, initialStep = 'contact-method' }) {
  const SAVED_PHONE_KEY = 'leadPhone';
  const [step, setStep] = useState(initialStep);
  const [phoneNumber, setPhoneNumber] = useState('+7 ');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const [isBackBtnPressed, setIsBackBtnPressed] = useState(false);
  const [isNextBtnPressed, setIsNextBtnPressed] = useState(false);
  const [isPhoneNextBtnPressed, setIsPhoneNextBtnPressed] = useState(false);

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
        setPhoneNumber(formatted || '+7 ');
      }
    } catch {
      // ignore
    }
  }, []);

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
      const formatted = formatPhoneNumber(e.target.value) || '+7 ';
      setPhoneNumber(formatted);
    },
    [formatPhoneNumber]
  );

  const handleSubmitPhoneAfterMethod = useCallback(() => {
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length === 11) {
      try {
        localStorage.setItem(SAVED_PHONE_KEY, phoneNumber);
      } catch {
        // ignore
      }
      onSubmit({ phone: phoneNumber, method: 'phone' });
    }
  }, [phoneNumber, onSubmit, SAVED_PHONE_KEY]);

  const handleNextFromMethod = useCallback(() => {
    if (selectedMethod === 'phone') {
      onSubmit({ phone: phoneNumber, method: 'phone' });
    } else if (selectedMethod) {
      onSubmit({ phone: phoneNumber, method: selectedMethod });
    }
  }, [selectedMethod, phoneNumber, onSubmit]);

  const handleBack = useCallback(() => {
    if (step === 'phone-after-method') setStep('contact-method');
    else onClose();
  }, [step, onClose]);

  const isPhoneValid = useMemo(() => {
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    return phoneDigits.length === 11;
  }, [phoneNumber]);

  const handleBackgroundClick = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setShouldRender(false);
      if (onSkip) onSkip();
      else onClose();
    }, 300);
  }, [onSkip, onClose]);

  const renderContactMethod = () => (
    <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-background">
      <div className="relative flex-shrink-0" style={{ minHeight: '105px' }}>
        <div
          className="absolute left-0 right-0"
          style={{ top: HINT_TOP, left: 'var(--main-block-margin)', right: 'var(--main-block-margin)' }}
        >
          <button
            type="button"
            onClick={() => {
              dispatchNavigateToOrderLanding();
              onClose();
            }}
            className="box-border flex h-10 w-10 items-center justify-center rounded-[20px] border border-white/50 bg-white backdrop-blur-[5px] transition-opacity hover:opacity-90"
            aria-label="Свернуть окно"
          >
            <CollapseIcon />
          </button>
        </div>
      </div>
      <div
        className="mx-auto flex w-full min-w-0 flex-col rounded-[20px] bg-white"
        style={{
          marginLeft: 'var(--main-block-margin)',
          marginRight: 'var(--main-block-margin)',
          width: 'calc(100% - 2 * var(--main-block-margin))',
          boxSizing: 'border-box',
          marginTop: 'auto',
          marginBottom: 0,
          padding: '15px',
          border: '1px solid rgba(255,255,255,0.5)',
          backdropFilter: 'blur(7.5px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontFamily: 'var(--font-involve), system-ui, sans-serif', fontWeight: 500, fontSize: '18px', lineHeight: '110%', color: '#101010', marginBottom: '15px' }}>
          Консультирование
        </div>
        <div style={{ fontFamily: 'var(--font-involve), system-ui, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '110%', color: 'rgba(16, 16, 16, 0.5)', marginBottom: '20px' }}>
          Рекламы нет, только ваши вопросы <span style={{ color: '#EF4444' }}>❣️</span>
        </div>

        <div className="flex flex-col gap-[5px]" style={{ marginBottom: '20px' }}>
          <div className="flex items-center justify-between rounded-[10px] px-[15px]" style={{ height: '50px', border: '1px solid rgba(16, 16, 16, 0.15)', opacity: 0.25 }}>
            <span className="whitespace-nowrap" style={{ fontFamily: 'var(--font-involve), system-ui, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '125%', color: 'rgba(16, 16, 16, 0.5)' }}>
              Написать нам в «Max»
            </span>
            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path
                  d="M10.8424 5.82274L8.6651 8L10.8424 10.1773C10.8886 10.2203 10.9257 10.2723 10.9514 10.33C10.9771 10.3877 10.9909 10.4501 10.9921 10.5132C10.9932 10.5764 10.9816 10.6392 10.9579 10.6978C10.9342 10.7564 10.899 10.8096 10.8543 10.8543C10.8096 10.899 10.7564 10.9342 10.6978 10.9579C10.6392 10.9815 10.5764 10.9932 10.5132 10.9921C10.4501 10.9909 10.3877 10.9771 10.33 10.9514C10.2723 10.9257 10.2203 10.8886 10.1773 10.8424L8 8.6651L5.82275 10.8424C5.73354 10.9255 5.61555 10.9707 5.49364 10.9686C5.37172 10.9664 5.2554 10.917 5.16918 10.8308C5.08296 10.7446 5.03357 10.6283 5.03142 10.5064C5.02927 10.3844 5.07452 10.2665 5.15765 10.1773L7.3349 8L5.15765 5.82274C5.07452 5.73354 5.02927 5.61555 5.03142 5.49363C5.03357 5.37172 5.08296 5.2554 5.16918 5.16918C5.2554 5.08296 5.37172 5.03357 5.49364 5.03142C5.61555 5.02927 5.73354 5.07452 5.82275 5.15765L8 7.3349L10.1773 5.15765C10.2665 5.07452 10.3845 5.02927 10.5064 5.03142C10.6283 5.03357 10.7446 5.08296 10.8308 5.16918C10.917 5.2554 10.9664 5.37172 10.9686 5.49363C10.9707 5.61555 10.9255 5.73354 10.8424 5.82274ZM16 8C16 9.58225 15.5308 11.129 14.6518 12.4446C13.7727 13.7602 12.5233 14.7855 11.0615 15.391C9.59966 15.9965 7.99113 16.155 6.43928 15.8463C4.88743 15.5376 3.46197 14.7757 2.34315 13.6569C1.22433 12.538 0.462403 11.1126 0.153721 9.56072C-0.15496 8.00887 0.00346614 6.40034 0.608967 4.93853C1.21447 3.47672 2.23985 2.22729 3.55544 1.34824C4.87103 0.469192 6.41775 0 8 0C10.121 0.00249086 12.1544 0.846145 13.6541 2.3459C15.1539 3.84565 15.9975 5.87903 16 8ZM15.0588 8C15.0588 6.6039 14.6448 5.23914 13.8692 4.07833C13.0936 2.91751 11.9911 2.01276 10.7013 1.4785C9.41146 0.944232 7.99217 0.804443 6.62289 1.07681C5.25362 1.34918 3.99585 2.02146 3.00866 3.00866C2.02147 3.99585 1.34918 5.25361 1.07681 6.62289C0.804447 7.99217 0.944235 9.41146 1.4785 10.7013C2.01277 11.9911 2.91751 13.0936 4.07833 13.8692C5.23915 14.6448 6.6039 15.0588 8 15.0588C9.87148 15.0567 11.6657 14.3124 12.989 12.989C14.3124 11.6657 15.0567 9.87148 15.0588 8Z"
                  fill="#101010"
                  fillOpacity="0.5"
                />
              </svg>
            </div>
          </div>

          <div
            className="flex cursor-pointer items-center justify-between rounded-[10px] px-[15px]"
            style={{ height: '50px', border: selectedMethod === 'telegram' ? '1px solid rgba(16, 16, 16, 0.5)' : '1px solid rgba(16, 16, 16, 0.25)' }}
            onClick={() => setSelectedMethod('telegram')}
          >
            <span className="whitespace-nowrap" style={{ fontFamily: 'var(--font-involve), system-ui, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '125%', color: selectedMethod === 'telegram' ? '#101010' : 'rgba(16, 16, 16, 0.5)' }}>
              Написать нам в «Telegram»
            </span>
            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
              {selectedMethod === 'telegram' ? <SelectedArrowIcon /> : <UnselectedArrowIcon />}
            </div>
          </div>

          <div
            className="flex cursor-pointer items-center justify-between rounded-[10px] px-[15px]"
            style={{ height: '50px', border: selectedMethod === 'phone' ? '1px solid rgba(16, 16, 16, 0.5)' : '1px solid rgba(16, 16, 16, 0.15)' }}
            onClick={() => setSelectedMethod('phone')}
          >
            <span
              className="whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-involve), system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '125%',
                color: selectedMethod === 'phone' ? '#101010' : 'rgba(16, 16, 16, 0.5)',
              }}
            >
              Перезвонить на номер телефона
            </span>
            <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
              {selectedMethod === 'phone' ? <SelectedArrowIcon /> : <UnselectedArrowIcon />}
            </div>
          </div>
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
            style={{ border: '1px solid rgba(16, 16, 16, 0.15)', background: 'white', transform: isBackBtnPressed ? 'scale(0.92)' : 'scale(1)', transition: 'transform 0.15s ease-out' }}
          >
            <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }}>
              <path d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 -5.34251e-07 6 -5.24537e-07C6.11112 -5.14822e-07 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z" fill="#101010" />
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
            className="h-[50px] flex-1 cursor-pointer rounded-[10px] text-white outline-none disabled:cursor-not-allowed"
            style={{ background: selectedMethod ? '#101010' : 'rgba(16, 16, 16, 0.25)', fontFamily: 'var(--font-involve), system-ui, sans-serif', fontSize: '16px', transform: isNextBtnPressed && selectedMethod ? 'scale(0.97)' : 'scale(1)', transition: 'transform 0.15s ease-out' }}
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );

  const renderPhoneAfterMethod = () => (
    <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-background">
      <div className="relative flex-shrink-0" style={{ minHeight: '105px' }}>
        <div
          className="absolute left-0 right-0"
          style={{ top: HINT_TOP, left: 'var(--main-block-margin)', right: 'var(--main-block-margin)' }}
        >
          <button
            type="button"
            onClick={() => {
              dispatchNavigateToOrderLanding();
              onClose();
            }}
            className="box-border flex h-10 w-10 items-center justify-center rounded-[20px] border border-white/50 bg-white backdrop-blur-[5px] transition-opacity hover:opacity-90"
            aria-label="Свернуть окно"
          >
            <CollapseIcon />
          </button>
        </div>
      </div>
      <div
        className="mx-auto flex w-full min-w-0 flex-col rounded-[20px] bg-white"
        style={{
          marginLeft: 'var(--main-block-margin)',
          marginRight: 'var(--main-block-margin)',
          width: 'calc(100% - 2 * var(--main-block-margin))',
          boxSizing: 'border-box',
          marginTop: 'auto',
          marginBottom: 0,
          padding: '15px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontFamily: 'var(--font-involve), system-ui, sans-serif', fontSize: '20px', lineHeight: '125%', color: '#101010', marginBottom: '15px' }}>Консультация</div>
        <div style={{ fontFamily: 'var(--font-involve), system-ui, sans-serif', fontSize: '14px', lineHeight: '105%', color: 'rgba(16, 16, 16, 0.25)', marginBottom: '20px' }}>Напишите номер вашего сотового телефона. Пожалуйста, проверьте правильность</div>
        <div className="mb-[20px] w-full rounded-[10px]" style={{ height: '50px', border: isPhoneValid ? '1px solid #101010' : '1px solid rgba(16, 16, 16, 0.25)' }}>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            placeholder="Номер сотового телефона"
            className="h-full w-full rounded-[10px] bg-transparent px-[15px] outline-none"
            style={{ fontFamily: 'var(--font-involve), system-ui, sans-serif', fontSize: '16px', lineHeight: '125%', color: phoneFocused ? '#101010' : 'rgba(16, 16, 16, 0.5)', letterSpacing: '0.5px', transition: 'color 0.2s ease' }}
          />
        </div>
        <div className="flex items-center gap-[5px]">
          <button type="button" onClick={handleBack} onMouseDown={() => setIsBackBtnPressed(true)} onMouseUp={() => setIsBackBtnPressed(false)} onMouseLeave={() => setIsBackBtnPressed(false)} onTouchStart={() => setIsBackBtnPressed(true)} onTouchEnd={() => setIsBackBtnPressed(false)} className="flex h-[50px] w-[50px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] outline-none" style={{ border: '1px solid rgba(16, 16, 16, 0.15)', background: 'white', transform: isBackBtnPressed ? 'scale(0.92)' : 'scale(1)', transition: 'transform 0.15s ease-out' }}>
            <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }}>
              <path d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 -5.34251e-07 6 -5.24537e-07C6.11112 -5.14822e-07 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z" fill="#101010" />
            </svg>
          </button>
          <button type="button" onClick={handleSubmitPhoneAfterMethod} onMouseDown={() => setIsPhoneNextBtnPressed(true)} onMouseUp={() => setIsPhoneNextBtnPressed(false)} onMouseLeave={() => setIsPhoneNextBtnPressed(false)} onTouchStart={() => setIsPhoneNextBtnPressed(true)} onTouchEnd={() => setIsPhoneNextBtnPressed(false)} disabled={!isPhoneValid} className="h-[50px] flex-1 cursor-pointer rounded-[10px] text-white outline-none disabled:cursor-not-allowed" style={{ background: isPhoneValid ? '#101010' : 'rgba(16, 16, 16, 0.25)', fontFamily: 'var(--font-involve), system-ui, sans-serif', fontSize: '16px', transform: isPhoneNextBtnPressed && isPhoneValid ? 'scale(0.97)' : 'scale(1)', transition: 'transform 0.15s ease-out' }}>
            Далее
          </button>
        </div>
      </div>
    </div>
  );

  const renderPhoneFirst = () => (
    <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-background">
      <div className="relative flex-shrink-0" style={{ minHeight: '105px' }}>
        <div
          className="absolute left-0 right-0"
          style={{ top: HINT_TOP, left: 'var(--main-block-margin)', right: 'var(--main-block-margin)' }}
        >
          <button
            type="button"
            onClick={() => {
              dispatchNavigateToOrderLanding();
              onClose();
            }}
            className="box-border flex h-10 w-10 items-center justify-center rounded-[20px] border border-white/50 bg-white backdrop-blur-[5px] transition-opacity hover:opacity-90"
            aria-label="Свернуть окно"
          >
            <CollapseIcon />
          </button>
        </div>
      </div>
      <div
        className="mx-auto flex w-full min-w-0 flex-col rounded-[20px] bg-white"
        style={{
          marginLeft: 'var(--main-block-margin)',
          marginRight: 'var(--main-block-margin)',
          width: 'calc(100% - 2 * var(--main-block-margin))',
          boxSizing: 'border-box',
          marginTop: 'auto',
          marginBottom: 0,
          padding: '15px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontFamily: 'var(--font-involve), system-ui, sans-serif', fontSize: '20px', lineHeight: '125%', color: '#101010', marginBottom: '15px' }}>Консультация</div>
        <div style={{ fontFamily: 'var(--font-involve), system-ui, sans-serif', fontSize: '14px', lineHeight: '105%', color: 'rgba(16, 16, 16, 0.25)', marginBottom: '20px' }}>Напишите номер вашего сотового телефона. Пожалуйста, проверьте правильность</div>
        <div className="mb-[20px] w-full rounded-[10px]" style={{ height: '50px', border: isPhoneValid ? '1px solid #101010' : '1px solid rgba(16, 16, 16, 0.25)' }}>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            placeholder="Номер сотового телефона"
            className="h-full w-full rounded-[10px] bg-transparent px-[15px] outline-none"
            style={{ fontFamily: 'var(--font-involve), system-ui, sans-serif', fontSize: '16px', lineHeight: '125%', color: phoneFocused ? '#101010' : 'rgba(16, 16, 16, 0.5)', letterSpacing: '0.5px', transition: 'color 0.2s ease' }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!isPhoneValid) return;
            setSelectedMethod('phone');
            setStep('contact-method');
          }}
          disabled={!isPhoneValid}
          className="w-full cursor-pointer rounded-[10px] outline-none disabled:cursor-not-allowed"
          style={{
            height: '50px',
            fontFamily: 'var(--font-involve), system-ui, sans-serif',
            fontSize: '16px',
            background: isPhoneValid ? '#101010' : '#FFFFFF',
            color: isPhoneValid ? '#FFFFFF' : 'rgba(16, 16, 16, 0.5)',
            border: '1px solid rgba(16, 16, 16, 0.25)',
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
      className="fixed inset-0 z-[10050] flex w-full min-w-0 cursor-pointer flex-col items-stretch overflow-hidden bg-background"
      style={{
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        paddingTop: 'var(--sat, 0px)',
        paddingBottom: 'calc(var(--main-block-margin) + var(--sab, 0px))',
        height: '100dvh',
        boxSizing: 'border-box',
      }}
      onClick={handleBackgroundClick}
    >
      <div
        className="relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-background"
        style={{
          transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxSizing: 'border-box',
        }}
      >
        <div className="absolute bottom-0 left-0 right-[0.06%] top-0 bg-background" aria-hidden />
        {step === 'contact-method' && renderContactMethod()}
        {step === 'phone-after-method' && renderPhoneAfterMethod()}
        {step === 'phone-first' && renderPhoneFirst()}
      </div>
    </div>
  );
}
