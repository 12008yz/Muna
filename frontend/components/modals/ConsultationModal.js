'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import CloseIcon from '@/components/common/CloseIcon';
import { HINT_TOP } from '@/components/common/ClickOutsideHint';

function SelectedArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M-3.49691e-07 8C-2.80529e-07 9.58225 0.469192 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469192 9.58225 5.34821e-07 8 6.03983e-07C5.87895 0.00224088 3.84542 0.845815 2.34562 2.34562C0.845813 3.84543 0.00223942 5.87895 -3.49691e-07 8ZM7.20461 4.48769L10.2815 7.56461C10.3388 7.62177 10.3841 7.68964 10.4151 7.76434C10.4461 7.83905 10.462 7.91913 10.462 8C10.462 8.08087 10.4461 8.16095 10.4151 8.23565C10.3841 8.31036 10.3388 8.37823 10.2815 8.43538L7.20461 11.5123C7.08914 11.6278 6.93253 11.6926 6.76923 11.6926C6.60593 11.6926 6.44932 11.6278 6.33384 11.5123C6.21837 11.3968 6.1535 11.2402 6.1535 11.0769C6.1535 10.9136 6.21837 10.757 6.33384 10.6415L8.97615 8L6.33384 5.35846C6.27667 5.30129 6.23132 5.23341 6.20037 5.1587C6.16943 5.084 6.1535 5.00393 6.1535 4.92308C6.1535 4.84222 6.16943 4.76215 6.20037 4.68745C6.23132 4.61274 6.27667 4.54487 6.33384 4.48769C6.39102 4.43052 6.4589 4.38516 6.5336 4.35422C6.6083 4.32328 6.68837 4.30735 6.76923 4.30735C6.85009 4.30735 6.93015 4.32328 7.00486 4.35422C7.07956 4.38516 7.14744 4.43052 7.20461 4.48769Z" fill="#101010"/>
    </svg>
  );
}

function UnselectedArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M-3.49691e-07 8C-2.80529e-07 9.58225 0.469191 11.129 1.34824 12.4446C2.22729 13.7602 3.47672 14.7855 4.93853 15.391C6.40034 15.9965 8.00887 16.155 9.56072 15.8463C11.1126 15.5376 12.538 14.7757 13.6569 13.6569C14.7757 12.538 15.5376 11.1126 15.8463 9.56072C16.155 8.00887 15.9965 6.40034 15.391 4.93853C14.7855 3.47672 13.7602 2.22729 12.4446 1.34824C11.129 0.469191 9.58225 -4.18853e-07 8 -3.49691e-07C5.87903 0.00249074 3.84565 0.846145 2.3459 2.3459C0.846145 3.84565 0.00249042 5.87903 -3.49691e-07 8ZM15.0588 8C15.0588 9.3961 14.6448 10.7609 13.8692 11.9217C13.0936 13.0825 11.9911 13.9872 10.7013 14.5215C9.41146 15.0558 7.99217 15.1956 6.62289 14.9232C5.25361 14.6508 3.99585 13.9785 3.00866 12.9913C2.02146 12.0041 1.34918 10.7464 1.07681 9.37711C0.804443 8.00783 0.944231 6.58854 1.4785 5.2987C2.01276 4.00887 2.91751 2.90644 4.07833 2.1308C5.23914 1.35517 6.60389 0.941176 8 0.941176C9.87148 0.943252 11.6657 1.68761 12.989 3.01095C14.3124 4.33429 15.0567 6.12852 15.0588 8ZM6.41255 4.53019C6.50078 4.44207 6.62039 4.39257 6.7451 4.39257C6.8698 4.39257 6.98941 4.44207 7.07764 4.53019L10.2149 7.66745C10.303 7.75568 10.3525 7.87529 10.3525 8C10.3525 8.1247 10.303 8.24431 10.2149 8.33255L7.07765 11.4698C6.98844 11.5529 6.87045 11.5982 6.74853 11.596C6.62662 11.5939 6.5103 11.5445 6.42408 11.4583C6.33786 11.372 6.28847 11.2557 6.28632 11.1338C6.28417 11.0119 6.32942 10.8939 6.41255 10.8047L9.21647 8L6.41255 5.19529C6.32442 5.10706 6.27492 4.98745 6.27492 4.86274C6.27492 4.73804 6.32442 4.61843 6.41255 4.53019Z" fill="#101010" fillOpacity="0.5"/>
    </svg>
  );
}

function DisabledCrossIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="#101010" strokeWidth="1" fill="none" />
      <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#101010" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

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

export default function ConsultationModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState('contact-method');
  const [phoneNumber, setPhoneNumber] = useState('+7 ');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    setShouldRender(true);
    setStep('contact-method');
    setPhoneNumber('+7 ');
    setSelectedMethod(null);
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

  const isPhoneValid = useMemo(() => phoneNumber.replace(/\D/g, '').length === 11, [phoneNumber]);

  const closeWithAnimation = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, 300);
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    if (typeof onComplete === 'function') onComplete({ phone: phoneNumber, method: selectedMethod });
    closeWithAnimation();
  }, [closeWithAnimation, onComplete, phoneNumber, selectedMethod]);

  const handleBack = useCallback((e) => {
    if (e) e.stopPropagation();
    if (step === 'phone') {
      setStep('contact-method');
      return;
    }
    closeWithAnimation();
  }, [closeWithAnimation, step]);

  if (!isOpen && !shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center overflow-hidden bg-[#F5F5F5] cursor-pointer"
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
        className="relative w-full max-w-[400px] bg-[#F5F5F5] flex flex-col h-full overflow-hidden"
        style={{
          transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div className="flex-shrink-0 relative cursor-pointer" style={{ minHeight: '105px' }}>
          <div className="absolute left-0 right-0" style={{ top: HINT_TOP, left: 20, right: 20 }}>
            <button
              type="button"
              onClick={closeWithAnimation}
              className="box-border flex h-10 max-w-[175px] items-center gap-2 rounded-[20px] border border-white/50 bg-white pl-2 pr-3 backdrop-blur-[5px] transition-opacity hover:opacity-90"
            >
              <CollapseIcon />
              <span className="text-[12px] leading-[40px] text-[rgba(16,16,16,0.5)]">сворачивание окна</span>
            </button>
          </div>
        </div>

        <div
          className="flex flex-col rounded-[20px] bg-white mx-[5%]"
          style={{ width: 360, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', padding: 15 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontSize: 20, lineHeight: '125%', color: '#101010', marginBottom: 15 }}>Консультация</div>
          <div
            style={{
              width: 330,
              height: 15,
              fontFamily: 'var(--font-involve), system-ui, sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '110%',
              color: 'rgba(16, 16, 16, 0.5)',
              marginBottom: 20,
            }}
          >
            Рекламы нет, только ваши вопросы{' '}
            <span style={{ color: '#EF4444' }} aria-hidden>
              ❣️
            </span>
          </div>

          {step === 'contact-method' ? (
            <div className="flex flex-col gap-[5px]" style={{ marginBottom: 20 }}>
              <div className="rounded-[10px] flex items-center justify-between px-[15px]" style={{ height: 50, border: '1px solid rgba(16,16,16,0.25)', opacity: 0.25 }}>
                <span style={{ fontSize: 16, lineHeight: '125%', color: 'rgba(16,16,16,0.5)' }}>Написать нам в «Max»</span>
                <DisabledCrossIcon />
              </div>
              <button type="button" className="rounded-[10px] cursor-pointer flex items-center justify-between px-[15px] bg-white" style={{ height: 50, border: selectedMethod === 'telegram' ? '1px solid #101010' : '1px solid rgba(16,16,16,0.25)' }} onClick={() => setSelectedMethod('telegram')}>
                <span style={{ fontSize: 16, color: selectedMethod === 'telegram' ? '#101010' : 'rgba(16,16,16,0.5)' }}>Написать нам в «Telegram»</span>
                {selectedMethod === 'telegram' ? <SelectedArrowIcon /> : <UnselectedArrowIcon />}
              </button>
              <button type="button" className="rounded-[10px] cursor-pointer flex items-center justify-between px-[15px] bg-white" style={{ height: 50, border: selectedMethod === 'phone' ? '1px solid #101010' : '1px solid rgba(16,16,16,0.25)' }} onClick={() => setSelectedMethod('phone')}>
                <span style={{ fontSize: 16, color: '#101010' }}>Перезвонить на номер телефона</span>
                {selectedMethod === 'phone' ? <SelectedArrowIcon /> : <UnselectedArrowIcon />}
              </button>
            </div>
          ) : null}

          {step === 'phone' ? (
            <div className="rounded-[10px] w-full mb-[20px]" style={{ height: 50, border: isPhoneValid ? '1px solid #101010' : '1px solid rgba(16,16,16,0.25)' }}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value) || '+7 ')}
                className="w-full h-full px-[15px] bg-transparent outline-none rounded-[10px]"
                style={{ fontSize: 16, lineHeight: '125%', color: '#101010' }}
              />
            </div>
          ) : null}

          <div className="flex items-center gap-[5px]">
            <button
              type="button"
              className="rounded-[10px] flex items-center justify-center bg-white"
              style={{ width: 50, height: 50, border: '1px solid rgba(16,16,16,0.15)' }}
              onClick={handleBack}
            >
              <svg width="12" height="6" viewBox="0 0 12 6" fill="none" style={{ transform: 'rotate(-90deg)' }}><path d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 0 6 0C6.11112 0 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z" fill="#101010" /></svg>
            </button>
            <button
              type="button"
              className="flex-1 rounded-[10px] h-[50px] text-white"
              style={{ background: (selectedMethod || isPhoneValid) ? '#101010' : 'rgba(16,16,16,0.25)' }}
              onClick={() => {
                if (selectedMethod === 'phone') setStep('phone');
                else if (step === 'phone') {
                  if (isPhoneValid) handleSubmit();
                } else if (selectedMethod) handleSubmit();
              }}
              disabled={step === 'contact-method' ? !selectedMethod : !isPhoneValid}
            >
              {step === 'phone' ? 'Далее' : 'Далее'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
