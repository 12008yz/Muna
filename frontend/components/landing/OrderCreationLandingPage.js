'use client';

import { useState } from 'react';
import Link from 'next/link';
import LandingHeaderBar from '@/components/landing/LandingHeaderBar';
import ConsultationModal from '@/components/modals/ConsultationModal';

const involve = {
  fontFamily: 'var(--font-involve), system-ui, sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSynthesis: 'none',
};

function BadgeCheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M10.7928 5.36106C10.8464 5.41464 10.889 5.47827 10.918 5.5483C10.9471 5.61834 10.962 5.69341 10.962 5.76923C10.962 5.84505 10.9471 5.92012 10.918 5.99016C10.889 6.06019 10.8464 6.12382 10.7928 6.1774L6.75433 10.2159C6.70075 10.2695 6.63712 10.3121 6.56708 10.3411C6.49705 10.3701 6.42197 10.3851 6.34616 10.3851C6.27034 10.3851 6.19527 10.3701 6.12523 10.3411C6.05519 10.3121 5.99156 10.2695 5.93798 10.2159L4.20721 8.4851C4.09896 8.37684 4.03814 8.23002 4.03814 8.07692C4.03814 7.92383 4.09896 7.777 4.20721 7.66875C4.31547 7.56049 4.46229 7.49968 4.61539 7.49968C4.76848 7.49968 4.91531 7.56049 5.02356 7.66875L6.34616 8.99207L9.97644 5.36106C10.03 5.30742 10.0937 5.26486 10.1637 5.23583C10.2337 5.2068 10.3088 5.19185 10.3846 5.19185C10.4604 5.19185 10.5355 5.2068 10.6055 5.23583C10.6756 5.26486 10.7392 5.30742 10.7928 5.36106ZM15 7.5C15 8.98336 14.5601 10.4334 13.736 11.6668C12.9119 12.9001 11.7406 13.8614 10.3701 14.4291C8.99968 14.9968 7.49168 15.1453 6.03682 14.8559C4.58197 14.5665 3.2456 13.8522 2.1967 12.8033C1.14781 11.7544 0.433503 10.418 0.144114 8.96318C-0.145275 7.50832 0.00324965 6.00032 0.570907 4.62987C1.13856 3.25943 2.09986 2.08809 3.33323 1.26398C4.56659 0.439867 6.01664 0 7.5 0C9.48848 0.00209987 11.3949 0.79295 12.801 2.19902C14.2071 3.60509 14.9979 5.51152 15 7.5ZM13.8462 7.5C13.8462 6.24485 13.474 5.01788 12.7766 3.97426C12.0793 2.93065 11.0882 2.11724 9.92857 1.63692C8.76896 1.15659 7.49296 1.03092 6.26193 1.27579C5.0309 1.52065 3.90012 2.12507 3.01259 3.01259C2.12507 3.90012 1.52066 5.03089 1.27579 6.26193C1.03092 7.49296 1.1566 8.76896 1.63692 9.92857C2.11725 11.0882 2.93065 12.0793 3.97427 12.7766C5.01789 13.474 6.24485 13.8462 7.5 13.8462C9.18252 13.8442 10.7956 13.175 11.9853 11.9853C13.175 10.7956 13.8442 9.18252 13.8462 7.5Z"
        fill="#101010"
        fillOpacity={0.75}
      />
    </svg>
  );
}

function ConsentCheckIcon() {
  return (
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden>
      <path d="M1 3L3 5L7 1" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function OrderCreationLandingPage() {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  /** Как на /: тёмная рамка блока политики после клика по нему или попытки «Формирование» без согласия */
  const [privacyConsentTouched, setPrivacyConsentTouched] = useState(false);
  /** Как «Консультирование» на / без телефона: после попытки без согласия — светлая кнопка (прозрачный фон на белой карточке) */
  const [submitAttemptedWithoutPrivacy, setSubmitAttemptedWithoutPrivacy] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);

  const submitButtonSolid = !submitAttemptedWithoutPrivacy || privacyAccepted;
  const privacyBorderMuted = 'rgba(16,16,16,0.25)';
  const privacyBorderStrong = 'rgba(16,16,16,0.75)';
  const privacyShowStrongBorder = !privacyAccepted && privacyConsentTouched;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center overflow-x-hidden overflow-y-auto bg-[#F5F5F5]"
      style={{ height: '100dvh', boxSizing: 'border-box', paddingTop: 'var(--sat, 0px)', paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="relative shrink-0 bg-[#F5F5F5]" style={{ width: 400, minWidth: 400, maxWidth: 400, minHeight: 230 + 355 + 20, boxSizing: 'border-box' }}>
        <LandingHeaderBar onConsultationClick={() => setConsultationModalOpen(true)} />

        <ConsultationModal
          isOpen={consultationModalOpen}
          onClose={() => setConsultationModalOpen(false)}
          onComplete={() => setConsultationModalOpen(false)}
        />

        <div
          className="absolute box-border bg-white"
          style={{
            left: 20,
            top: 230,
            width: 360,
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            padding: 15,
            boxSizing: 'border-box',
            gap: 5,
          }}
        >
          <h1 className="m-0 flex-shrink-0" style={{ ...involve, fontSize: 20, lineHeight: '125%', color: '#101010', paddingBottom: 15 }}>
            Подготавливание школьников
            <br />
            с 5 по 11 класс, чтобы все
            <br />
            государственные экзамены
            <br />
            сдали на топ баллов
          </h1>

          <div className="box-border flex shrink-0 items-center gap-[5px] self-start rounded-[100px] bg-[#F5F5F5] px-[5px]" style={{ width: 330, height: 25 }}>
            <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center" aria-hidden>
              <BadgeCheckIcon />
            </span>
            <span className="flex min-h-0 min-w-0 flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[25px] text-[rgba(16,16,16,0.75)]" style={involve}>
              свыше 999+ школьников подготовились с нами
            </span>
          </div>

          <div className="shrink-0" style={{ width: 330, maxWidth: '100%', marginTop: 5 }}>
            <button
              type="button"
              className="relative box-border flex cursor-pointer items-center rounded-[10px] border border-solid bg-white text-left outline-none focus:outline-none"
              style={{
                width: 330,
                maxWidth: '100%',
                height: 50,
                minHeight: 50,
                paddingLeft: 10,
                paddingRight: 10,
                boxSizing: 'border-box',
                borderColor: privacyAccepted ? privacyBorderMuted : privacyShowStrongBorder ? privacyBorderStrong : privacyBorderMuted,
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
                  marginRight: 8,
                  borderColor: privacyAccepted ? 'transparent' : privacyShowStrongBorder ? privacyBorderStrong : privacyBorderMuted,
                  background: privacyAccepted ? '#101010' : 'transparent',
                }}
              >
                {privacyAccepted ? <ConsentCheckIcon /> : null}
              </span>
              <span className="text-[14px] font-medium leading-[105%] text-[#101010]" style={{ ...involve, flex: 1, minWidth: 0 }}>
                Я, полностью соглашаюсь с условиями
                <br />
                <Link href="/privacy-policy" className="text-[#2563eb] underline decoration-solid [text-underline-offset:3px]" style={{ textDecorationSkipInk: 'none' }} onClick={(e) => e.stopPropagation()}>
                  политики приватности
                </Link>{' '}
                этого портала
              </span>
            </button>
          </div>

          <button
            type="button"
            className="box-border mt-[15px] flex w-[330px] max-w-full shrink-0 cursor-pointer items-center justify-center rounded-[10px] outline-none transition-[background,color] duration-150 focus:outline-none"
            style={{
              ...involve,
              height: 50,
              minHeight: 50,
              background: submitButtonSolid ? '#101010' : '#FFFFFF',
              border: 'none',
              borderRadius: 10,
              fontSize: 16,
              lineHeight: '315%',
              color: submitButtonSolid ? '#FFFFFF' : 'rgba(16, 16, 16, 0.5)',
            }}
            onClick={() => {
              if (!privacyAccepted) {
                setPrivacyConsentTouched(true);
                setSubmitAttemptedWithoutPrivacy(true);
                return;
              }
              setConsultationModalOpen(true);
            }}
          >
            Формирование
          </button>
        </div>
      </div>
    </div>
  );
}
