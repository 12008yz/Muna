'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LandingHeaderBar from '@/components/landing/LandingHeaderBar';
import ConsultationFlow from '@/components/modals/ConsultationFlow';
import { HINT_TOP } from '@/components/common/ClickOutsideHint';

const involve = {
  fontFamily: 'var(--font-involve), system-ui, sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSynthesis: 'none',
};

/** Карточка мастера /order — заголовок (Figma: 330×20, Involve 500, 18px, line-height 110%) */
const wizardTitleStyle = {
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

/** Подзаголовок мастера (Figma: 330×15, 14px, line-height 110%, color 50%) */
const wizardSubtitleStyle = {
  ...involve,
  width: 330,
  maxWidth: '100%',
  minHeight: 15,
  fontSize: 14,
  lineHeight: '110%',
  color: 'rgba(16, 16, 16, 0.5)',
  marginBottom: 20,
};

/** Как в ConsultationFlow / GroupTrainingPage / PrivacyPolicyPage (кнопка: safe area + 10px). */
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

/** Галочка в круге выбранного пункта (как RadioOption / Frame4 во next) */
function RadioSelectedCheckIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M1 4L3 6L7 2"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Один ряд «радио» — как FilterWizard + RadioOption (next): 50px высота, круг справа.
 * @param {{ label: string; selected: boolean; onClick: () => void }} props
 */
function TariffPrepOption({ label, selected, onClick, showErrorOutline }) {
  const borderColor = showErrorOutline
    ? '#101010'
    : selected
      ? 'rgba(16, 16, 16, 0.5)'
      : 'rgba(16, 16, 16, 0.25)';
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative box-border w-full cursor-pointer rounded-[10px] border border-solid text-left outline-none focus:outline-none"
      style={{
        height: 50,
        minHeight: 50,
        borderColor,
        background: '#FFFFFF',
        paddingLeft: 15,
        paddingRight: 15,
      }}
    >
      <span
        className="absolute flex items-center overflow-hidden text-ellipsis whitespace-nowrap"
        style={{
          left: 15,
          right: 44,
          top: 15,
          ...involve,
          fontWeight: 500,
          fontSize: 16,
          lineHeight: '125%',
          color: selected ? '#101010' : 'rgba(16, 16, 16, 0.5)',
        }}
      >
        {label}
      </span>
      <span
        className="absolute flex h-4 w-4 items-center justify-center rounded-full"
        style={{
          right: 15,
          top: 17,
          background: selected ? '#101010' : 'transparent',
          border: selected ? 'none' : '1px solid rgba(16, 16, 16, 0.5)',
          boxSizing: 'border-box',
        }}
      >
        {selected ? <RadioSelectedCheckIcon /> : null}
      </span>
    </button>
  );
}

/** Недоступный срок — как в макете: приглушённо, справа крестик в круге */
function TariffDurationOption({ label, selected, disabled, onClick, showErrorOutline }) {
  if (disabled) {
    return (
      <div
        className="relative box-border w-full select-none rounded-[10px] border border-solid pointer-events-none"
        style={{
          height: 50,
          minHeight: 50,
          borderColor: 'rgba(16, 16, 16, 0.2)',
          background: '#FFFFFF',
          paddingLeft: 15,
          paddingRight: 15,
          opacity: 0.4,
        }}
        aria-disabled="true"
      >
        <span
          className="absolute left-[15px] right-[44px] top-[15px] overflow-hidden text-ellipsis whitespace-nowrap text-left"
          style={{
            ...involve,
            fontWeight: 500,
            fontSize: 16,
            lineHeight: '125%',
            color: 'rgba(16, 16, 16, 0.45)',
          }}
        >
          {label}
        </span>
        <span
          className="absolute flex h-4 w-4 items-center justify-center rounded-full"
          style={{
            right: 15,
            top: 17,
            border: '1px solid rgba(16, 16, 16, 0.35)',
            boxSizing: 'border-box',
          }}
          aria-hidden
        >
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5M5 1L1 5" stroke="rgba(16,16,16,0.55)" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    );
  }
  return <TariffPrepOption label={label} selected={selected} onClick={onClick} showErrorOutline={showErrorOutline} />;
}

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

const ORDER_PREP_TYPE_KEY = 'orderPrepType';
const ORDER_GRADE_KEY = 'orderGrade';
const ORDER_SUBJECT_IDS_KEY = 'orderSubjectIds';
const ORDER_DURATION_KEY = 'orderDuration';
const SAVED_PHONE_KEY = 'leadPhone';
const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3040';
const API_BASE = /^https?:\/\//i.test(RAW_API_BASE) ? RAW_API_BASE : `https://${RAW_API_BASE}`;

const GRADE_OPTIONS = [5, 6, 7, 8, 9, 10, 11];

/** Срок тарифа: 1 и 3 мес. доступны; остальные пока недоступны */
const DURATION_OPTIONS = [
  { id: '1m', label: 'на 1 мес.', disabled: false },
  { id: '3m', label: 'на 3 мес. · скидка «10 проц.»', disabled: false },
  { id: '5m', label: 'на 5 мес. · скидка «13 проц.»', disabled: true },
  { id: '7m', label: 'на 7 мес. · скидка «15 проц.»', disabled: true },
  { id: '9m', label: 'на 9 мес. · скидка «17 проц.»', disabled: true },
];

/** Предметы — мультивыбор */
const SUBJECT_OPTIONS = [
  { id: 'russian', label: 'Русский язык' },
  { id: 'biology', label: 'Биология' },
  { id: 'chemistry', label: 'Химия' },
  { id: 'math', label: 'Математика' },
  { id: 'physics', label: 'Физика' },
];

export default function OrderCreationLandingPage({
  layout = 'viewport',
  initialOrderStep = 0,
  separateFinalStep = false,
  exposeOpenConsultation,
  onAfterPhoneLead,
  onReachFinalStep,
  /** Только stacked: шаги 1–4 мастера — родитель скрывает глобальную шапку и показывает слот под портал */
  onStackedWizardStepsActive,
} = {}) {
  const router = useRouter();
  const isStacked = layout === 'stacked';
  /** 0 — лендинг; 1 — тип; 2 — класс; 3 — предметы; 4 — срок тарифа; 5 — финальный экран */
  const [orderStep, setOrderStep] = useState(initialOrderStep);
  /** 'group' | 'personal' | null — без выбора по умолчанию */
  const [prepType, setPrepType] = useState(null);
  /** 5–11 | null */
  const [grade, setGrade] = useState(null);
  /** id из SUBJECT_OPTIONS */
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  /** id из DURATION_OPTIONS | null */
  const [durationId, setDurationId] = useState(null);

  const [attemptedStep1, setAttemptedStep1] = useState(false);
  const [attemptedStep2, setAttemptedStep2] = useState(false);
  const [attemptedStep3, setAttemptedStep3] = useState(false);
  const [attemptedStep4, setAttemptedStep4] = useState(false);

  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  /** Как на /: тёмная рамка блока политики после клика по нему или попытки «Формирование» без согласия */
  const [privacyConsentTouched, setPrivacyConsentTouched] = useState(false);
  /** До первой неуспешной попытки кнопка тёмная; после клика без согласия — белая до валидного состояния */
  const [submitAttemptedWithoutPrivacy, setSubmitAttemptedWithoutPrivacy] = useState(false);
  const [consultationFlowOpen, setConsultationFlowOpen] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  useEffect(() => {
    if (prepType != null) setAttemptedStep1(false);
  }, [prepType]);
  useEffect(() => {
    if (grade != null) setAttemptedStep2(false);
  }, [grade]);
  useEffect(() => {
    if (selectedSubjectIds.length > 0) setAttemptedStep3(false);
  }, [selectedSubjectIds]);
  useEffect(() => {
    if (durationId != null) setAttemptedStep4(false);
  }, [durationId]);

  /** Как раньше: до первой неуспешной попытки кнопка тёмная; после — белая до валидного выбора */
  const wizardNextStyle = (step) => {
    const attempted =
      step === 1
        ? attemptedStep1
        : step === 2
          ? attemptedStep2
          : step === 3
            ? attemptedStep3
            : attemptedStep4;
    const valid =
      step === 1
        ? prepType != null
        : step === 2
          ? grade != null
          : step === 3
            ? selectedSubjectIds.length > 0
            : durationId != null;
    const solid = !attempted || valid;
    return {
      ...involve,
      fontSize: 16,
      background: solid ? '#101010' : '#FFFFFF',
      color: solid ? '#FFFFFF' : 'rgba(16, 16, 16, 0.5)',
    };
  };

  const submitButtonSolid = !submitAttemptedWithoutPrivacy || privacyAccepted;
  const privacyBorderMuted = 'rgba(16,16,16,0.25)';
  const privacyBorderStrong = 'rgba(16,16,16,0.75)';
  const privacyShowStrongBorder = !privacyAccepted && privacyConsentTouched;

  useEffect(() => {
    if (!isStacked || typeof exposeOpenConsultation !== 'function') return;
    exposeOpenConsultation(() => setConsultationFlowOpen(true));
    return () => exposeOpenConsultation(null);
  }, [isStacked, exposeOpenConsultation]);

  useLayoutEffect(() => {
    if (typeof onStackedWizardStepsActive !== 'function') return;
    onStackedWizardStepsActive(isStacked && orderStep >= 1 && orderStep <= 4);
  }, [isStacked, orderStep, onStackedWizardStepsActive]);

  useEffect(() => {
    if (typeof onStackedWizardStepsActive !== 'function') return undefined;
    return () => onStackedWizardStepsActive(false);
  }, [onStackedWizardStepsActive]);

  const goToTariffStep = () => {
    if (!privacyAccepted) {
      setPrivacyConsentTouched(true);
      setSubmitAttemptedWithoutPrivacy(true);
      return;
    }
    setOrderStep(1);
  };

  const collapseWizardToLanding = () => {
    setOrderStep(0);
  };

  const handlePrepTypeNext = () => {
    if (!prepType) {
      setAttemptedStep1(true);
      return;
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ORDER_PREP_TYPE_KEY, prepType);
      }
    } catch {
      // игнорируем
    }
    setOrderStep(2);
  };

  const handleGradeNext = () => {
    if (grade == null) {
      setAttemptedStep2(true);
      return;
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ORDER_GRADE_KEY, String(grade));
      }
    } catch {
      // игнорируем
    }
    setOrderStep(3);
  };

  const toggleSubject = (subjectId) => {
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  };

  const handleSubjectsNext = () => {
    if (selectedSubjectIds.length === 0) {
      setAttemptedStep3(true);
      return;
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ORDER_SUBJECT_IDS_KEY, JSON.stringify(selectedSubjectIds));
      }
    } catch {
      // игнорируем
    }
    setOrderStep(4);
  };

  const handleDurationNext = () => {
    if (!durationId) {
      setAttemptedStep4(true);
      return;
    }
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ORDER_DURATION_KEY, durationId);
      }
    } catch {
      // игнорируем
    }
    if (separateFinalStep && isStacked) {
      if (typeof onReachFinalStep === 'function') onReachFinalStep();
      setOrderStep(0);
      return;
    }
    setOrderStep(5);
  };

  const submitOrderLead = async ({ name, phone, contactMethod = 'phone' }) => {
    if (leadSubmitting) return;
    setLeadSubmitting(true);
    try {
      await fetch(`${API_BASE}/api/leads/consultation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          name: name || null,
          privacyAccepted: true,
          contactMethod,
          source: 'order',
          trainingType: prepType,
          grade,
          subjectIds: selectedSubjectIds,
          durationId,
        }),
      });
      try {
        localStorage.setItem(SAVED_PHONE_KEY, phone);
      } catch {
        // ignore
      }
    } catch {
      // ignore errors in secondary submission
    } finally {
      setLeadSubmitting(false);
    }
  };

  const wizardCollapseButton = (
    <button
      type="button"
      onClick={collapseWizardToLanding}
      className="box-border flex h-10 max-w-[175px] items-center gap-2 rounded-[20px] border border-white/50 bg-white pl-2 pr-3 backdrop-blur-[5px] transition-opacity hover:opacity-90 outline-none focus:outline-none"
      aria-label="Свернуть окно"
    >
      <CollapseIcon />
      <span className="text-[12px] leading-[40px] text-[rgba(16,16,16,0.5)]" style={{ ...involve, fontSize: 12 }}>
        сворачивание окна
      </span>
    </button>
  );

  const stackedWizardCollapsePortal =
    isStacked &&
    orderStep >= 1 &&
    orderStep <= 4 &&
    typeof document !== 'undefined' &&
    (() => {
      const slot = document.getElementById('stacked-order-wizard-header-slot');
      if (!slot) return null;
      return createPortal(
        <div className="absolute z-10" style={{ left: 'var(--main-block-margin)', top: 'var(--header-top, 50px)' }}>
          {wizardCollapseButton}
        </div>,
        slot
      );
    })();

  const renderLeadCard = (buttonHandler, headingVariant = 'default') => (
    <div
      className="absolute box-border bg-white"
      style={{
        left: 'var(--main-block-margin)',
        right: 'var(--main-block-margin)',
        bottom: 0,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        padding: 15,
        boxSizing: 'border-box',
        gap: 5,
      }}
    >
      <h1 className="m-0 flex-shrink-0" style={{ ...involve, fontSize: 20, lineHeight: '125%', color: '#101010', paddingBottom: 15 }}>
        {headingVariant === 'final' ? 'Призвание школьников,' : 'Подготавливание школьников'}
        <br />
        {headingVariant === 'final' ? 'с 7 по 11 класс, чтобы все жизненные и деловые мечты' : 'с 5 по 11 класс, чтобы все'}
        <br />
        {headingVariant === 'final' ? (
          'воплотились на сто процентов'
        ) : (
          <>
            государственные экзамены
            <br />
            сдали на топ баллов
          </>
        )}
      </h1>

      <div
        className="box-border flex min-w-0 shrink-0 items-center gap-[5px] self-start rounded-[100px] bg-[#F5F5F5] px-[5px]"
        style={{ width: 'calc(100% - 10px)', maxWidth: '100%', height: 25 }}
      >
        <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center" aria-hidden>
          <BadgeCheckIcon />
        </span>
        <span className="flex min-h-0 min-w-0 flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[25px] text-[rgba(16,16,16,0.75)]" style={involve}>
          свыше 999+ школьников подготовились с нами
        </span>
      </div>

      <div className="w-full min-w-0 shrink-0" style={{ marginTop: 5 }}>
        <button
          type="button"
          className="relative box-border flex w-full min-w-0 cursor-pointer items-center rounded-[10px] border border-solid bg-white text-left outline-none focus:outline-none"
          style={{
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
            <Link
              href="/privacy-policy"
              className="text-[#2563eb] underline decoration-solid [text-underline-offset:3px]"
              style={{ textDecorationSkipInk: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              политики приватности
            </Link>{' '}
            этого портала
          </span>
        </button>
      </div>

      <button
        type="button"
        className="box-border mt-[15px] flex w-full min-w-0 shrink-0 cursor-pointer items-center justify-center rounded-[10px] outline-none transition-[background,color] duration-150 focus:outline-none"
        style={{
          ...involve,
          width: '100%',
          height: 50,
          minHeight: 50,
          background: submitButtonSolid ? '#101010' : '#FFFFFF',
          border: 'none',
          borderRadius: 10,
          fontSize: 16,
          lineHeight: '315%',
          color: submitButtonSolid ? '#FFFFFF' : 'rgba(16, 16, 16, 0.5)',
        }}
        onClick={buttonHandler}
      >
        Формирование
      </button>
    </div>
  );

  return (
    <>
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
          className="relative box-border flex h-full min-h-0 w-full min-w-0 flex-col bg-[#F5F5F5]"
          style={{
            boxSizing: 'border-box',
          }}
        >
          {(orderStep === 0 || orderStep === 5) && !isStacked ? (
            <LandingHeaderBar onConsultationClick={openConsultation} />
          ) : null}

          {orderStep === 0 && renderLeadCard(goToTariffStep, 'default')}
        {orderStep === 5 && renderLeadCard(() => setConsultationFlowOpen(true), 'final')}

        {(orderStep === 1 || orderStep === 2 || orderStep === 3 || orderStep === 4) && (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={{ boxSizing: 'border-box' }}>
            <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-[#F5F5F5]">
              {!isStacked ? (
                <div className="relative flex-shrink-0 cursor-pointer" style={{ minHeight: '105px' }}>
                  <div
                    className="absolute left-0 right-0"
                    style={{ top: HINT_TOP, left: 'var(--main-block-margin)', right: 'var(--main-block-margin)' }}
                  >
                    {wizardCollapseButton}
                  </div>
                </div>
              ) : null}

              <div
                className="scrollbar-hide mt-auto flex w-full min-w-0 flex-shrink-0 flex-col rounded-[20px] bg-white"
                style={{
                  marginLeft: 'var(--main-block-margin)',
                  marginRight: 'var(--main-block-margin)',
                  width: 'calc(100% - 2 * var(--main-block-margin))',
                  boxSizing: 'border-box',
                  padding: 15,
                  marginBottom: 0,
                  ...(isStacked
                    ? {
                        maxHeight: 'calc(var(--unified-section-min-h) - 24px)',
                        overflowY: 'auto',
                        WebkitOverflowScrolling: 'touch',
                      }
                    : {}),
                }}
              >
                <h2 className="m-0 flex max-w-full flex-shrink-0 items-center self-stretch" style={wizardTitleStyle}>
                  Формирование тарифного плана
                </h2>

                {orderStep === 1 && (
                  <>
                    <p className="m-0 flex max-w-full flex-shrink-0 items-center self-stretch" style={wizardSubtitleStyle}>
                      Нажмите только на то, что интересно
                    </p>

                    <div className="flex flex-col gap-[5px]" style={{ marginBottom: 20 }}>
                      <TariffPrepOption
                        label="Групповая подготовка"
                        selected={prepType === 'group'}
                        showErrorOutline={attemptedStep1 && !prepType}
                        onClick={() => setPrepType('group')}
                      />
                      <TariffPrepOption
                        label="Персональная подготовка"
                        selected={prepType === 'personal'}
                        showErrorOutline={attemptedStep1 && !prepType}
                        onClick={() => setPrepType('personal')}
                      />
                    </div>

                    <div className="flex items-center gap-[5px]">
                      <button
                        type="button"
                        onClick={() => setOrderStep(0)}
                        className="flex h-[50px] w-[50px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[rgba(16,16,16,0.15)] bg-white outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.92]"
                        aria-label="Назад"
                      >
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                          <path
                            d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 -5.34251e-07 6 -5.24537e-07C6.11112 -5.14822e-07 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z"
                            fill="#101010"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handlePrepTypeNext}
                        className="flex h-[50px] min-h-[50px] flex-1 cursor-pointer items-center justify-center rounded-[10px] border-none outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.97]"
                        style={wizardNextStyle(1)}
                      >
                        Далее
                      </button>
                    </div>
                  </>
                )}

                {orderStep === 2 && (
                  <>
                    <p className="m-0 flex max-w-full flex-shrink-0 items-center self-stretch" style={wizardSubtitleStyle}>
                      Нажмите только на то, что действительно
                    </p>

                    <div className="flex flex-col gap-[5px]" style={{ marginBottom: 20 }}>
                      {GRADE_OPTIONS.map((g) => (
                        <TariffPrepOption
                          key={g}
                          label={`${g} класс`}
                          selected={grade === g}
                          showErrorOutline={attemptedStep2 && grade == null}
                          onClick={() => setGrade(g)}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-[5px]">
                      <button
                        type="button"
                        onClick={() => setOrderStep(1)}
                        className="flex h-[50px] w-[50px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[rgba(16,16,16,0.15)] bg-white outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.92]"
                        aria-label="Назад"
                      >
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                          <path
                            d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 -5.34251e-07 6 -5.24537e-07C6.11112 -5.14822e-07 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z"
                            fill="#101010"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleGradeNext}
                        className="flex h-[50px] min-h-[50px] flex-1 cursor-pointer items-center justify-center rounded-[10px] border-none outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.97]"
                        style={wizardNextStyle(2)}
                      >
                        Далее
                      </button>
                    </div>
                  </>
                )}

                {orderStep === 3 && (
                  <>
                    <p className="m-0 flex max-w-full flex-shrink-0 items-center self-stretch" style={wizardSubtitleStyle}>
                      Нажмите только на то, что интересно
                    </p>

                    <div className="flex flex-col gap-[5px]" style={{ marginBottom: 20 }}>
                      {SUBJECT_OPTIONS.map(({ id, label }) => (
                        <TariffPrepOption
                          key={id}
                          label={label}
                          selected={selectedSubjectIds.includes(id)}
                          showErrorOutline={attemptedStep3 && selectedSubjectIds.length === 0}
                          onClick={() => toggleSubject(id)}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-[5px]">
                      <button
                        type="button"
                        onClick={() => setOrderStep(2)}
                        className="flex h-[50px] w-[50px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[rgba(16,16,16,0.15)] bg-white outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.92]"
                        aria-label="Назад"
                      >
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                          <path
                            d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 -5.34251e-07 6 -5.24537e-07C6.11112 -5.14822e-07 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z"
                            fill="#101010"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleSubjectsNext}
                        className="flex h-[50px] min-h-[50px] flex-1 cursor-pointer items-center justify-center rounded-[10px] border-none outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.97]"
                        style={wizardNextStyle(3)}
                      >
                        Далее
                      </button>
                    </div>
                  </>
                )}

                {orderStep === 4 && (
                  <>
                    <p className="m-0 flex max-w-full flex-shrink-0 items-center self-stretch" style={wizardSubtitleStyle}>
                      Нажмите только на то, что интересно
                    </p>

                    <div className="flex flex-col gap-[5px]" style={{ marginBottom: 20 }}>
                      {DURATION_OPTIONS.map(({ id, label, disabled }) => (
                        <TariffDurationOption
                          key={id}
                          label={label}
                          disabled={disabled}
                          selected={!disabled && durationId === id}
                          showErrorOutline={attemptedStep4 && !durationId && !disabled}
                          onClick={() => {
                            if (!disabled) setDurationId(id);
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-[5px]">
                      <button
                        type="button"
                        onClick={() => setOrderStep(3)}
                        className="flex h-[50px] w-[50px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[rgba(16,16,16,0.15)] bg-white outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.92]"
                        aria-label="Назад"
                      >
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                          <path
                            d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 -5.34251e-07 6 -5.24537e-07C6.11112 -5.14822e-07 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z"
                            fill="#101010"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleDurationNext}
                        className="flex h-[50px] min-h-[50px] flex-1 cursor-pointer items-center justify-center rounded-[10px] border-none outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.97]"
                        style={wizardNextStyle(4)}
                      >
                        Далее
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

      {stackedWizardCollapsePortal}

      {consultationFlowOpen ? (
        <ConsultationFlow
          onClose={() => setConsultationFlowOpen(false)}
          onSkip={() => setConsultationFlowOpen(false)}
          onSubmit={async (payload) => {
            const method =
              payload?.method === 'telegram' ? 'telegram' : payload?.method === 'phone' ? 'phone' : 'phone';
            await submitOrderLead({ name: null, phone: payload?.phone, contactMethod: method });
            setConsultationFlowOpen(false);
            if (method === 'phone') {
              if (typeof onAfterPhoneLead === 'function') {
                onAfterPhoneLead();
              } else {
                router.push('/');
              }
            }
          }}
          initialStep="contact-method"
        />
      ) : null}
    </>
  );
}
