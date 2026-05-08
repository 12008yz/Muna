'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import ConsultationFlow from '@/components/modals/ConsultationFlow';
import CookieBanner from '@/components/notifications/CookieBanner';
import ManaMarketingHeader from '@/components/landing/ManaMarketingHeader';

const involve = {
  fontFamily: "'TT Firs Neue', system-ui, sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  fontSynthesis: 'none',
};

const PRIVACY_HREF = '/privacy-policy';
const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3040';
const API_BASE = /^https?:\/\//i.test(RAW_API_BASE) ? RAW_API_BASE : `https://${RAW_API_BASE}`;
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
/** Длительность схлопывания баннера + небольшой запас до размонтирования */
const NOTIFICATION_EXIT_MS = 320;
const NOTIFICATION_EXIT_TRANSITION_MS = 300;
const SAVED_PHONE_KEY = 'leadPhone';

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
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M1 3L3 5L7 1" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneFieldErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346628 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9978 5.87895 15.1542 3.84542 13.6544 2.34562C12.1546 0.845814 10.121 0.00223986 8 0ZM7.38462 4.30769C7.38462 4.14448 7.44945 3.98796 7.56486 3.87255C7.68027 3.75714 7.83679 3.69231 8 3.69231C8.16321 3.69231 8.31974 3.75714 8.43514 3.87255C8.55055 3.98796 8.61539 4.14448 8.61539 4.30769V8.61538C8.61539 8.77859 8.55055 8.93512 8.43514 9.05053C8.31974 9.16593 8.16321 9.23077 8 9.23077C7.83679 9.23077 7.68027 9.16593 7.56486 9.05053C7.44945 8.93512 7.38462 8.77859 7.38462 8.61538V4.30769ZM8 12.3077C7.81743 12.3077 7.63897 12.2536 7.48717 12.1521C7.33537 12.0507 7.21706 11.9065 7.14719 11.7379C7.07732 11.5692 7.05904 11.3836 7.09466 11.2045C7.13028 11.0255 7.21819 10.861 7.34729 10.7319C7.47638 10.6028 7.64086 10.5149 7.81992 10.4793C7.99898 10.4437 8.18458 10.4619 8.35325 10.5318C8.52192 10.6017 8.66608 10.72 8.76751 10.8718C8.86894 11.0236 8.92308 11.202 8.92308 11.3846C8.92308 11.6294 8.82583 11.8642 8.65271 12.0373C8.4796 12.2104 8.24482 12.3077 8 12.3077Z"
        fill="#101010"
      />
    </svg>
  );
}

function PhoneFieldSuccessIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346631 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6568C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9978 5.87895 15.1542 3.84542 13.6544 2.34562C12.1546 0.845813 10.121 0.00223986 8 0ZM11.5123 6.58923L7.20462 10.8969C7.14747 10.9541 7.0796 10.9995 7.00489 11.0305C6.93018 11.0615 6.8501 11.0774 6.76923 11.0774C6.68836 11.0774 6.60828 11.0615 6.53358 11.0305C6.45887 10.9995 6.391 10.9541 6.33385 10.8969L4.4877 9.05077C4.37222 8.9353 4.30735 8.77868 4.30735 8.61538C4.30735 8.45208 4.37222 8.29547 4.4877 8.18C4.60317 8.06453 4.75978 7.99966 4.92308 7.99966C5.08638 7.99966 5.24299 8.06453 5.35846 8.18L6.76923 9.59154L10.6415 5.71846C10.6987 5.66128 10.7666 5.61593 10.8413 5.58499C10.916 5.55404 10.9961 5.53812 11.0769 5.53812C11.1578 5.53812 11.2379 5.55404 11.3126 5.58499C11.3873 5.61593 11.4551 5.66128 11.5123 5.71846C11.5695 5.77564 11.6148 5.84351 11.6458 5.91822C11.6767 5.99292 11.6927 6.07299 11.6927 6.15384C11.6927 6.2347 11.6767 6.31477 11.6458 6.38947C11.6148 6.46418 11.5695 6.53205 11.5123 6.58923Z"
        fill="#101010"
        fillOpacity={0.5}
      />
    </svg>
  );
}

function BadgeCheckIconMana() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M10.7928 5.36106C10.8464 5.41464 10.889 5.47827 10.918 5.5483C10.9471 5.61834 10.962 5.69341 10.962 5.76923C10.962 5.84505 10.9471 5.92012 10.918 5.99016C10.889 6.06019 10.8464 6.12382 10.7928 6.1774L6.75433 10.2159C6.70075 10.2695 6.63712 10.3121 6.56708 10.3411C6.49705 10.3701 6.42197 10.3851 6.34616 10.3851C6.27034 10.3851 6.19527 10.3701 6.12523 10.3411C6.05519 10.3121 5.99156 10.2695 5.93798 10.2159L4.20721 8.4851C4.09896 8.37684 4.03814 8.23002 4.03814 8.07692C4.03814 7.92383 4.09896 7.777 4.20721 7.66875C4.31547 7.56049 4.46229 7.49968 4.61539 7.49968C4.76848 7.49968 4.91531 7.56049 5.02356 7.66875L6.34616 8.99207L9.97644 5.36106C10.03 5.30742 10.0937 5.26486 10.1637 5.23583C10.2337 5.2068 10.3088 5.19185 10.3846 5.19185C10.4604 5.19185 10.5355 5.2068 10.6055 5.23583C10.6756 5.26486 10.7392 5.30742 10.7928 5.36106ZM15 7.5C15 8.98336 14.5601 10.4334 13.736 11.6668C12.9119 12.9001 11.7406 13.8614 10.3701 14.4291C8.99968 14.9968 7.49168 15.1453 6.03682 14.8559C4.58197 14.5665 3.2456 13.8522 2.1967 12.8033C1.14781 11.7544 0.433503 10.418 0.144114 8.96318C-0.145275 7.50832 0.00324965 6.00032 0.570907 4.62987C1.13856 3.25943 2.09986 2.08809 3.33323 1.26398C4.56659 0.439867 6.01664 0 7.5 0C9.48848 0.00209987 11.3949 0.79295 12.801 2.19902C14.2071 3.60509 14.9979 5.51152 15 7.5ZM13.8462 7.5C13.8462 6.24485 13.474 5.01788 12.7766 3.97426C12.0793 2.93065 11.0882 2.11724 9.92857 1.63692C8.76896 1.15659 7.49296 1.03092 6.26193 1.27579C5.0309 1.52065 3.90012 2.12507 3.01259 3.01259C2.12507 3.90012 1.52066 5.03089 1.27579 6.26193C1.03092 7.49296 1.1566 8.76896 1.63692 9.92857C2.11725 11.0882 2.93065 12.0793 3.97427 12.7766C5.01789 13.474 6.24485 13.8462 7.5 13.8462C9.18252 13.8442 10.7956 13.175 11.9853 11.9853C13.175 10.7956 13.8442 9.18252 13.8462 7.5Z"
        fill="#FFFFFF"
        fillOpacity={0.95}
      />
    </svg>
  );
}

function ConsentCheckDarkIcon() {
  return (
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M1 3L3 5L7 1" stroke="#050505" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ManaPhoneFieldErrorIcon() {
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

function ManaPhoneFieldSuccessIcon() {
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

/** Формат: +7 965 965 56 56 (11 цифр, моб. РФ) */
function formatPhoneRu(value) {
  let d = value.replace(/\D/g, '');
  if (d.length === 0) return '';
  if (d[0] === '8') d = `7${d.slice(1)}`;
  else if (d[0] === '9') d = `7${d}`;
  else if (d[0] !== '7') d = `7${d}`;
  d = d.slice(0, 11);
  const rest = d.slice(1);
  if (rest.length === 0) return '+7 ';
  if (rest.length <= 3) return `+7 ${rest}`;
  if (rest.length <= 6) return `+7 ${rest.slice(0, 3)} ${rest.slice(3)}`;
  if (rest.length <= 8) return `+7 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
  return `+7 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6, 8)} ${rest.slice(8, 10)}`;
}

function phoneDigits(value) {
  return value.replace(/\D/g, '');
}

/** Полный номер в формате +7: 11 цифр, начинается с 7 (не только 79… — иначе ручной ввод не проходит) */
function isPhoneInputValid(value) {
  const d = phoneDigits(value);
  return d.length === 11 && d.startsWith('7');
}

function isPhoneEmpty(value) {
  const d = phoneDigits(value);
  return d.length === 0 || d === '7';
}

/**
 * Лендинг по структуре next/frontend Frame1/index.tsx:
 * контейнер 400px, шапка absolute (20 / 340, --header-top), cookie 360×120, карточка left/right 15, top 230, padding 15, gap 5.
 */
export default function ConsultationLandingPage({
  onOpenFullPrivacyPolicy,
  layout = 'viewport',
  onAfterLeadSuccess,
  exposeOpenConsultation,
  /** В режиме stacked — скролл к секциям вместо перехода по маршрутам */
  scrollNavigate,
  notificationsEnabled = true,
  onConsultationFlowOpenChange,
} = {}) {
  const router = useRouter();
  const isStacked = layout === 'stacked';

  useEffect(() => {
    if (!isStacked || typeof exposeOpenConsultation !== 'function') return;
    exposeOpenConsultation(() => setConsultationFlowOpen(true));
    return () => exposeOpenConsultation(null);
  }, [isStacked, exposeOpenConsultation]);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [cookieTimer, setCookieTimer] = useState(7);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  /** Тёмная рамка блока политики только после клика по нему или попытки отправки без согласия */
  const [privacyConsentTouched, setPrivacyConsentTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [consultationFlowOpen, setConsultationFlowOpen] = useState(false);
  /** После отправки с пустым телефоном кнопка «Консультирование» становится прозрачной, пока не введён номер */
  const [submitAttemptedWithoutPhone, setSubmitAttemptedWithoutPhone] = useState(false);
  const [showLeadSuccessBanner, setShowLeadSuccessBanner] = useState(false);
  const [leadSuccessTimer, setLeadSuccessTimer] = useState(7);
  const [cookieBannerClosing, setCookieBannerClosing] = useState(false);
  const [leadSuccessClosing, setLeadSuccessClosing] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  const phoneValid = !phoneError && isPhoneInputValid(phone);
  const showPhoneSuccessIcon = phoneValid;
  const showPhoneTrailingIcon = phoneError || showPhoneSuccessIcon;
  const submitButtonSolid = !submitAttemptedWithoutPhone || (phoneValid && privacyAccepted);
  const privacyBorderMuted = 'rgba(16,16,16,0.25)';
  const privacyBorderStrong = 'rgba(16,16,16,0.75)';
  const privacyShowStrongBorder = !privacyAccepted && privacyConsentTouched;
  const stackPrivacyMuted = 'rgba(255,255,255,0.25)';
  const stackPrivacyStrong = 'rgba(255,255,255,0.85)';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_PHONE_KEY);
      if (saved) setPhone(formatPhoneRu(saved));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!notificationsEnabled || !showCookieBanner || cookieTimer <= 0 || cookieBannerClosing) return;
    const id = setInterval(() => {
      setCookieTimer((prev) => {
        if (prev <= 0) return 0;
        if (prev <= 1) {
          setCookieBannerClosing(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [notificationsEnabled, showCookieBanner, cookieTimer, cookieBannerClosing]);

  useEffect(() => {
    if (!cookieBannerClosing) return;
    const id = setTimeout(() => {
      setShowCookieBanner(false);
      setCookieBannerClosing(false);
    }, NOTIFICATION_EXIT_MS);
    return () => clearTimeout(id);
  }, [cookieBannerClosing]);

  useEffect(() => {
    if (!notificationsEnabled || !showLeadSuccessBanner || leadSuccessTimer <= 0 || leadSuccessClosing) return;
    const id = setInterval(() => {
      setLeadSuccessTimer((prev) => {
        if (prev <= 0) return 0;
        if (prev <= 1) {
          setLeadSuccessClosing(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [notificationsEnabled, showLeadSuccessBanner, leadSuccessTimer, leadSuccessClosing]);

  useEffect(() => {
    if (!leadSuccessClosing) return;
    const id = setTimeout(() => {
      setShowLeadSuccessBanner(false);
      setLeadSuccessClosing(false);
    }, NOTIFICATION_EXIT_MS);
    return () => clearTimeout(id);
  }, [leadSuccessClosing]);

  useEffect(() => {
    if (!showLeadSuccessBanner || isStacked) return;
    const id = setTimeout(() => {
      // Автоскролл в консультировании отключён.
    }, 1000);
    return () => clearTimeout(id);
  }, [showLeadSuccessBanner, isStacked]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (typeof onConsultationFlowOpenChange !== 'function') return;
    onConsultationFlowOpenChange(Boolean(consultationFlowOpen));
    return () => onConsultationFlowOpenChange(false);
  }, [consultationFlowOpen, onConsultationFlowOpenChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    /* Тёмная рамка политики — при любой отправке без галочки (в т.ч. если телефон пустой и раньше был return) */
    if (!privacyAccepted) {
      setPrivacyConsentTouched(true);
    }
    if (!isPhoneInputValid(phone)) {
      setPhoneError(true);
      setSubmitAttemptedWithoutPhone(true);
      return;
    }
    setPhoneError(false);
    if (!privacyAccepted) {
      setSubmitAttemptedWithoutPhone(true);
      return;
    }
    setSubmitting(true);
    try {
      if (!USE_MOCKS) {
        const res = await fetch(`${API_BASE}/api/leads/consultation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            privacyAccepted: true,
            contactMethod: null,
            source: 'landing',
          }),
        });
        // Для пользовательского сценария не блокируем успех из-за API.
        // Даже при ошибке бэкенда продолжаем UX-цепочку.
      }
      try {
        localStorage.setItem(SAVED_PHONE_KEY, phone);
      } catch {
        // ignore
      }
      setPhone('');
      setPhoneError(false);
      setSubmitAttemptedWithoutPhone(false);
      setPrivacyConsentTouched(false);
      setPrivacyAccepted(false);
      setLeadSuccessClosing(false);
      setLeadSuccessTimer(7);
      setShowLeadSuccessBanner(true);
    } catch {
      setLeadSuccessClosing(false);
      setLeadSuccessTimer(7);
      setShowLeadSuccessBanner(true);
    } finally {
      setSubmitting(false);
    }
  };

  const notificationsTop = isStacked ? 'var(--notification-top-stacked)' : 'var(--notification-top)';
  const privacyLinkHref = PRIVACY_HREF;
  const notificationsNode = (
    <div
      className="pointer-events-none fixed z-[10060] flex w-auto min-w-0 flex-col"
      style={{
        top: notificationsTop,
        left: 'var(--main-block-margin)',
        right: 'var(--main-block-margin)',
        isolation: 'isolate',
      }}
    >
      {(showCookieBanner || cookieBannerClosing) && (
        <div
          data-fluid-cursor-block
          className="pointer-events-auto w-full min-w-0 ease-out"
          style={{
            maxHeight: cookieBannerClosing ? 0 : 130,
            opacity: cookieBannerClosing ? 0 : 1,
            marginBottom: cookieBannerClosing ? 0 : 8,
            overflow: 'hidden',
            transition: `max-height ${NOTIFICATION_EXIT_TRANSITION_MS}ms ease-out, opacity ${NOTIFICATION_EXIT_TRANSITION_MS}ms ease-out, margin-bottom ${NOTIFICATION_EXIT_TRANSITION_MS}ms ease-out`,
          }}
        >
          <CookieBanner
            stacked
            manaDark={isStacked}
            countdown={cookieTimer}
            onClose={() => setCookieBannerClosing(true)}
            privacyHref={privacyLinkHref}
            onPrivacyLinkClick={onOpenFullPrivacyPolicy}
          />
        </div>
      )}

      {(showLeadSuccessBanner || leadSuccessClosing) && (
        <div
          data-fluid-cursor-block
          className="pointer-events-auto w-full min-w-0 ease-out"
          style={{
            maxHeight: leadSuccessClosing ? 0 : 80,
            opacity: leadSuccessClosing ? 0 : 1,
            overflow: 'hidden',
            transition: `max-height ${NOTIFICATION_EXIT_TRANSITION_MS}ms ease-out, opacity ${NOTIFICATION_EXIT_TRANSITION_MS}ms ease-out`,
          }}
        >
          <CookieBanner
            stacked
            compact
            manaDark={isStacked}
            countdown={leadSuccessTimer}
            onClose={() => setLeadSuccessClosing(true)}
            privacyHref={PRIVACY_HREF}
          >
            Информация направлена, ожидайте звонок
          </CookieBanner>
        </div>
      )}
    </div>
  );

  const stackedNotificationsPortal =
    notificationsEnabled && isStacked && portalReady ? createPortal(notificationsNode, document.body) : null;

  return (
    <>
      {isStacked ? (
        <div
          className="relative z-0 flex h-full min-h-0 w-full min-w-0 flex-col items-stretch overflow-hidden bg-transparent"
          style={{
            height: '100%',
            minHeight: 0,
            boxSizing: 'border-box',
            paddingBottom: 'calc(var(--main-block-margin) + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="relative mx-auto box-border flex h-full min-h-0 w-full max-w-full min-w-0 flex-col bg-transparent" style={{ boxSizing: 'border-box' }}>
            {stackedNotificationsPortal}
            <div
              data-fluid-cursor-block
              data-vertical-scroll-handle=""
              className="absolute z-[3] box-border"
              style={{
                left: 'var(--main-block-margin)',
                right: 'var(--main-block-margin)',
                width: 'auto',
                minWidth: 0,
                top: 'auto',
                bottom: 'calc(20px - var(--main-block-margin))',
                minHeight: 330,
                height: 330,
                borderRadius: 20,
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 15,
                paddingRight: 15,
                paddingBottom: 'calc(15px + env(safe-area-inset-bottom, 0px))',
                paddingLeft: 15,
                boxSizing: 'border-box',
                gap: 5,
                overflow: 'hidden',
                background: 'rgba(5, 5, 5, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(7.5px)',
                WebkitBackdropFilter: 'blur(7.5px)',
              }}
            >
              <h1
                className="m-0 w-full min-w-0 self-start flex-shrink-0"
                style={{
                  ...involve,
                  fontWeight: 400,
                  fontSize: 20,
                  lineHeight: '125%',
                  color: '#FFFFFF',
                  paddingTop: 0,
                  paddingBottom: 15,
                }}
              >
                Маркетинговое сопровождение
                <br />
                для захвата целевого клиента
                <br />
                при помощи медиа и сайта
              </h1>

              <div
                className="box-border flex min-w-0 shrink-0 items-center gap-[4px] self-start rounded-[100px] border border-solid border-[rgba(255,255,255,0.1)] px-[4px]"
                style={{
                  width: 294,
                  minWidth: 294,
                  maxWidth: 294,
                  height: 25,
                  minHeight: 25,
                  maxHeight: 25,
                  boxSizing: 'border-box',
                }}
              >
                <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center" aria-hidden>
                  <BadgeCheckIconMana />
                </span>
                <span
                  className="flex min-h-0 min-w-0 flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-[25px] text-white"
                  style={{ ...involve, fontWeight: 400, paddingRight: 10 }}
                >
                  свыше 8+ лет в продвижении и организации
                </span>
              </div>

              <form className="flex w-full min-w-0 flex-col gap-[5px]" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="landing-phone">
                  Номер сотового телефона
                </label>
                <div className="relative w-full min-w-0 shrink-0">
                  <input
                    id="landing-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Номер сотового телефона"
                    value={phone}
                    onFocus={() => {
                      if (isPhoneEmpty(phone)) setPhone('+7 ');
                    }}
                    onChange={(e) => {
                      setPhone(formatPhoneRu(e.target.value));
                      setPhoneError(false);
                    }}
                    aria-invalid={phoneError}
                    className={`box-border w-full min-w-0 rounded-[10px] border border-solid bg-transparent px-[15px] outline-none placeholder:text-[rgba(255,255,255,0.25)] ${
                      phoneError ? 'border-[rgba(255,255,255,0.85)]' : 'border-[rgba(255,255,255,0.25)]'
                    }`}
                    style={{
                      ...involve,
                      width: '100%',
                      height: 50,
                      minHeight: 50,
                      paddingRight: showPhoneTrailingIcon ? 39 : 16,
                      fontSize: 16,
                      lineHeight: '125%',
                      color: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  />
                  {phoneError ? (
                    <span
                      className="pointer-events-none absolute top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center"
                      style={{ right: 15 }}
                      aria-hidden
                    >
                      <ManaPhoneFieldErrorIcon />
                    </span>
                  ) : showPhoneSuccessIcon ? (
                    <span
                      className="pointer-events-none absolute top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center"
                      style={{ right: 15 }}
                      aria-hidden
                    >
                      <ManaPhoneFieldSuccessIcon />
                    </span>
                  ) : null}
                </div>

                <div className="w-full min-w-0 shrink-0">
                  <button
                    type="button"
                    className="relative box-border flex w-full min-w-0 cursor-pointer items-center rounded-[10px] border border-solid bg-transparent text-left outline-none focus:outline-none"
                    style={{
                      height: 50,
                      minHeight: 50,
                      paddingLeft: 15,
                      paddingRight: 10,
                      boxSizing: 'border-box',
                      borderColor: privacyAccepted
                        ? stackPrivacyMuted
                        : privacyShowStrongBorder
                          ? stackPrivacyStrong
                          : 'rgba(255, 255, 255, 0.1)',
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
                        borderColor: privacyAccepted
                          ? 'transparent'
                          : privacyShowStrongBorder
                            ? stackPrivacyStrong
                            : 'rgba(255, 255, 255, 0.5)',
                        background: privacyAccepted ? '#FFFFFF' : 'transparent',
                      }}
                    >
                      {privacyAccepted ? <ConsentCheckDarkIcon /> : null}
                    </span>
                    <span
                      className="text-[14px] font-normal leading-[105%] text-white"
                      style={{ ...involve, flex: 1, minWidth: 0 }}
                    >
                      Я, полностью соглашаюсь с условиями{' '}
                      <Link
                        href={privacyLinkHref}
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

                <button
                  type="submit"
                  disabled={submitting}
                  className="box-border flex w-full min-w-0 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid outline-none transition-opacity focus:outline-none disabled:opacity-60"
                  style={{
                    ...involve,
                    width: '100%',
                    marginTop: 15,
                    height: 50,
                    minHeight: 50,
                    background: submitButtonSolid ? '#FFFFFF' : 'transparent',
                    borderColor: submitButtonSolid ? '#FFFFFF' : 'transparent',
                    borderRadius: 10,
                    fontSize: 16,
                    lineHeight: '315%',
                    color: submitButtonSolid ? '#050505' : 'rgba(255, 255, 255, 0.45)',
                  }}
                >
                  {submitting ? 'Отправка…' : 'Консультирование'}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="fixed inset-0 z-[9999] flex w-full min-w-0 flex-col items-stretch overflow-hidden bg-background"
          style={{
            height: '100dvh',
            boxSizing: 'border-box',
            paddingTop: 'var(--sat, 0px)',
            paddingBottom: 'calc(var(--main-block-margin) + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="relative box-border flex h-full min-h-0 w-full min-w-0 flex-col bg-background" style={{ boxSizing: 'border-box' }}>
            <ManaMarketingHeader
              onConsultationClick={() => setConsultationFlowOpen(true)}
              onMenuClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  router.back();
                  return;
                }
                router.replace('/?consultation=1');
              }}
              menuHref="/?consultation=1"
            />

            {notificationsEnabled ? notificationsNode : null}

            <div
              className="absolute box-border"
              style={{
                left: 'var(--main-block-margin)',
                right: 'var(--main-block-margin)',
                bottom: 0,
                height: 355,
                borderRadius: 20,
                display: 'flex',
                flexDirection: 'column',
                paddingTop: 15,
                paddingRight: 15,
                paddingBottom: 'calc(15px + env(safe-area-inset-bottom, 0px))',
                paddingLeft: 15,
                boxSizing: 'border-box',
                gap: 5,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(7.5px)',
                WebkitBackdropFilter: 'blur(7.5px)',
              }}
            >
              <h1
                className="m-0 flex-shrink-0"
                style={{
                  ...involve,
                  fontSize: 20,
                  lineHeight: '125%',
                  color: '#101010',
                  paddingTop: 0,
                  paddingBottom: 15,
                }}
              >
                Маркетинговое сопровождение
                <br />
                для захвата целевого клиента
                <br />
                при помощи медиа и сайта
              </h1>

              <div
                className="box-border flex min-w-0 shrink-0 items-center gap-[4px] self-start rounded-[100px] bg-[#ebebeb] px-[4px]"
                style={{
                  width: 294,
                  minWidth: 294,
                  maxWidth: 294,
                  height: 25,
                  minHeight: 25,
                  maxHeight: 25,
                  boxSizing: 'border-box',
                }}
              >
                <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center" aria-hidden>
                  <BadgeCheckIcon />
                </span>
                <span
                  className="flex min-h-0 min-w-0 flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-normal leading-[25px] text-[rgba(16,16,16,0.75)]"
                  style={{ ...involve, paddingRight: 10 }}
                >
                  свыше 8+ лет в продвижении и организации
                </span>
              </div>

              <form className="flex w-full min-w-0 flex-col gap-[5px]" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="landing-phone">
                  Номер сотового телефона
                </label>
                <div className="relative w-full min-w-0 shrink-0">
                  <input
                    id="landing-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Номер сотового телефона"
                    value={phone}
                    onFocus={() => {
                      if (isPhoneEmpty(phone)) setPhone('+7 ');
                    }}
                    onChange={(e) => {
                      setPhone(formatPhoneRu(e.target.value));
                      setPhoneError(false);
                    }}
                    aria-invalid={phoneError}
                    className={`box-border w-full min-w-0 rounded-[10px] border border-solid bg-white px-[15px] outline-none placeholder:text-[rgba(16,16,16,0.5)] ${
                      phoneError ? 'border-[rgba(16,16,16,0.75)]' : 'border-[rgba(16,16,16,0.25)]'
                    }`}
                    style={{
                      ...involve,
                      width: '100%',
                      height: 50,
                      minHeight: 50,
                      paddingRight: showPhoneTrailingIcon ? 39 : 16,
                      fontSize: 16,
                      lineHeight: '125%',
                      color: '#101010',
                      boxSizing: 'border-box',
                    }}
                  />
                  {phoneError ? (
                    <span
                      className="pointer-events-none absolute top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center"
                      style={{ right: 15 }}
                      aria-hidden
                    >
                      <PhoneFieldErrorIcon />
                    </span>
                  ) : showPhoneSuccessIcon ? (
                    <span
                      className="pointer-events-none absolute top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center"
                      style={{ right: 15 }}
                      aria-hidden
                    >
                      <PhoneFieldSuccessIcon />
                    </span>
                  ) : null}
                </div>

                <div className="w-full min-w-0 shrink-0">
                  <button
                    type="button"
                    className="relative box-border flex w-full min-w-0 cursor-pointer items-center rounded-[10px] border border-solid bg-white text-left outline-none focus:outline-none"
                    style={{
                      height: 50,
                      minHeight: 50,
                      paddingLeft: 15,
                      paddingRight: 10,
                      boxSizing: 'border-box',
                      borderColor: privacyAccepted
                        ? privacyBorderMuted
                        : privacyShowStrongBorder
                          ? privacyBorderStrong
                          : privacyBorderMuted,
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
                        borderColor: privacyAccepted
                          ? 'transparent'
                          : privacyShowStrongBorder
                            ? privacyBorderStrong
                            : privacyBorderMuted,
                        background: privacyAccepted ? '#101010' : 'transparent',
                      }}
                    >
                      {privacyAccepted ? <ConsentCheckIcon /> : null}
                    </span>
                    <span
                      className="text-[14px] font-normal leading-[105%] text-[#101010]"
                      style={{ ...involve, flex: 1, minWidth: 0 }}
                    >
                      Я, полностью соглашаюсь с условиями
                      <br />
                      <Link
                        href={privacyLinkHref}
                        className="text-[#2563eb] underline decoration-solid [text-underline-offset:3px]"
                        style={{ textDecorationSkipInk: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        политики приватности
                      </Link>{' '}
                      сайта
                    </span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="box-border flex w-full min-w-0 shrink-0 cursor-pointer items-center justify-center rounded-[10px] outline-none transition-opacity focus:outline-none disabled:opacity-60"
                  style={{
                    ...involve,
                    width: '100%',
                    marginTop: 15,
                    height: 50,
                    minHeight: 50,
                    background: submitButtonSolid ? '#101010' : 'transparent',
                    border: submitButtonSolid ? '1px solid rgba(16, 16, 16, 0.25)' : 'none',
                    borderRadius: 10,
                    fontSize: 16,
                    lineHeight: '315%',
                    color: submitButtonSolid ? '#FFFFFF' : 'rgba(16, 16, 16, 0.5)',
                  }}
                >
                  {submitting ? 'Отправка…' : 'Консультирование'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {consultationFlowOpen ? (
        <ConsultationFlow
          onClose={() => setConsultationFlowOpen(false)}
          onSkip={() => setConsultationFlowOpen(false)}
          onSubmit={() => {
            setConsultationFlowOpen(false);
          }}
          initialStep="contact-method"
        />
      ) : null}
    </>
  );
}
