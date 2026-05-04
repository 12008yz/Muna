'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LandingHeaderBar from '@/components/landing/LandingHeaderBar';
import ConsultationModal from '@/components/modals/ConsultationModal';
import { HINT_TOP } from '@/components/common/ClickOutsideHint';
import { NAVIGATE_TO_ORDER_LANDING_EVENT } from '@/lib/navigateToOrderLanding';
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

/**
 * Один ряд «радио» — как FilterWizard + RadioOption (next): 50px высота, круг справа.
 * @param {{ label: string; selected: boolean; onClick: () => void }} props
 */
function FormSelectedCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346629 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9978 5.87895 15.1542 3.84542 13.6544 2.34562C12.1546 0.845814 10.121 0.00223986 8 0ZM11.5123 6.58923L7.20462 10.8969C7.14747 10.9541 7.0796 10.9995 7.00489 11.0305C6.93018 11.0615 6.8501 11.0774 6.76923 11.0774C6.68836 11.0774 6.60828 11.0615 6.53358 11.0305C6.45887 10.9995 6.391 10.9541 6.33385 10.8969L4.4877 9.05077C4.37222 8.9353 4.30735 8.77868 4.30735 8.61538C4.30735 8.45208 4.37222 8.29547 4.4877 8.18C4.60317 8.06453 4.75978 7.99966 4.92308 7.99966C5.08638 7.99966 5.24299 8.06453 5.35846 8.18L6.76923 9.59154L10.6415 5.71846C10.6987 5.66128 10.7666 5.61593 10.8413 5.58499C10.916 5.55404 10.9961 5.53812 11.0769 5.53812C11.1578 5.53812 11.2379 5.55404 11.3126 5.58499C11.3873 5.61593 11.4551 5.66128 11.5123 5.71846C11.5695 5.77564 11.6148 5.84351 11.6458 5.91822C11.6767 5.99292 11.6927 6.07299 11.6927 6.15384C11.6927 6.2347 11.6767 6.31477 11.6458 6.38947C11.6148 6.46418 11.5695 6.53205 11.5123 6.58923Z"
        fill="#101010"
      />
    </svg>
  );
}

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
        transition: 'border-color 240ms cubic-bezier(0.22, 1, 0.36, 1)',
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
          transition: 'color 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {label}
      </span>
      <span
        className="absolute flex h-4 w-4 items-center justify-center"
        style={{
          right: 15,
          top: 17,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition:
              'opacity 220ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
            opacity: selected ? 1 : 0.92,
            transform: selected ? 'scale(1)' : 'scale(0.96)',
          }}
        >
          {selected ? (
            <FormSelectedCheckIcon />
          ) : (
            <span
              className="h-4 w-4 rounded-full"
              style={{
                border: '1px solid rgba(16, 16, 16, 0.5)',
                boxSizing: 'border-box',
              }}
            />
          )}
        </span>
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
          className="absolute flex h-4 w-4 items-center justify-center"
          style={{
            right: 15,
            top: 17,
          }}
          aria-hidden
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path
              d="M10.8424 5.82274L8.6651 8L10.8424 10.1773C10.8886 10.2203 10.9257 10.2723 10.9514 10.33C10.9771 10.3877 10.9909 10.4501 10.9921 10.5132C10.9932 10.5764 10.9816 10.6392 10.9579 10.6978C10.9342 10.7564 10.899 10.8096 10.8543 10.8543C10.8096 10.899 10.7564 10.9342 10.6978 10.9579C10.6392 10.9815 10.5764 10.9932 10.5132 10.9921C10.4501 10.9909 10.3877 10.9771 10.33 10.9514C10.2723 10.9257 10.2203 10.8886 10.1773 10.8424L8 8.6651L5.82275 10.8424C5.73354 10.9255 5.61555 10.9707 5.49364 10.9686C5.37172 10.9664 5.2554 10.917 5.16918 10.8308C5.08296 10.7446 5.03357 10.6283 5.03142 10.5064C5.02927 10.3844 5.07452 10.2665 5.15765 10.1773L7.3349 8L5.15765 5.82274C5.07452 5.73354 5.02927 5.61555 5.03142 5.49363C5.03357 5.37172 5.08296 5.2554 5.16918 5.16918C5.2554 5.08296 5.37172 5.03357 5.49364 5.03142C5.61555 5.02927 5.73354 5.07452 5.82275 5.15765L8 7.3349L10.1773 5.15765C10.2665 5.07452 10.3845 5.02927 10.5064 5.03142C10.6283 5.03357 10.7446 5.08296 10.8308 5.16918C10.917 5.2554 10.9664 5.37172 10.9686 5.49363C10.9707 5.61555 10.9255 5.73354 10.8424 5.82274ZM16 8C16 9.58225 15.5308 11.129 14.6518 12.4446C13.7727 13.7602 12.5233 14.7855 11.0615 15.391C9.59966 15.9965 7.99113 16.155 6.43928 15.8463C4.88743 15.5376 3.46197 14.7757 2.34315 13.6569C1.22433 12.538 0.462403 11.1126 0.153721 9.56072C-0.15496 8.00887 0.00346614 6.40034 0.608967 4.93853C1.21447 3.47672 2.23985 2.22729 3.55544 1.34824C4.87103 0.469192 6.41775 0 8 0C10.121 0.00249086 12.1544 0.846145 13.6541 2.3459C15.1539 3.84565 15.9975 5.87903 16 8ZM15.0588 8C15.0588 6.6039 14.6448 5.23914 13.8692 4.07833C13.0936 2.91751 11.9911 2.01276 10.7013 1.4785C9.41146 0.944232 7.99217 0.804443 6.62289 1.07681C5.25362 1.34918 3.99585 2.02146 3.00866 3.00866C2.02147 3.99585 1.34918 5.25361 1.07681 6.62289C0.804447 7.99217 0.944235 9.41146 1.4785 10.7013C2.01277 11.9911 2.91751 13.0936 4.07833 13.8692C5.23915 14.6448 6.6039 15.0588 8 15.0588C9.87148 15.0567 11.6657 14.3124 12.989 12.989C14.3124 11.6657 15.0567 9.87148 15.0588 8Z"
              fill="#101010"
              fillOpacity={0.5}
            />
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

const STEP_DISSOLVE_OUT_MS = 220;
const STEP_DISSOLVE_IN_MS = 300;

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
  /** Напр. 5 — только финальная карточка (четвёртый экран скролла на главной) */
  initialOrderStep = 0,
  exposeOpenConsultation,
  onAfterPhoneLead,
  /** Только stacked: шаги 1–4 мастера — родитель скрывает глобальную шапку и показывает слот под портал */
  onStackedWizardStepsActive,
  onConsultationFlowOpenChange,
} = {}) {
  const router = useRouter();
  const isStacked = layout === 'stacked';
  /** 0 — лендинг; 1–4 — мастер; 5 — финальная карточка; после «Далее» на шаге 4 — модалка */
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
  const [stepVisualState, setStepVisualState] = useState('in');
  const stepTransitionTimerRef = useRef(null);
  const stepEnterRafRef = useRef(null);

  const clearStepTransitionHandles = () => {
    if (stepTransitionTimerRef.current) {
      clearTimeout(stepTransitionTimerRef.current);
      stepTransitionTimerRef.current = null;
    }
    if (stepEnterRafRef.current) {
      cancelAnimationFrame(stepEnterRafRef.current);
      stepEnterRafRef.current = null;
    }
  };

  const startStepEnterAnimation = () => {
    setStepVisualState('enter');
    stepEnterRafRef.current = requestAnimationFrame(() => {
      stepEnterRafRef.current = requestAnimationFrame(() => {
        setStepVisualState('in');
        stepEnterRafRef.current = null;
      });
    });
  };

  const setOrderStepAnimated = (nextStep, { immediate = false } = {}) => {
    if (nextStep === orderStep && !immediate) return;
    clearStepTransitionHandles();
    if (immediate) {
      setOrderStep(nextStep);
      startStepEnterAnimation();
      return;
    }
    setStepVisualState('out');
    stepTransitionTimerRef.current = setTimeout(() => {
      setOrderStep(nextStep);
      startStepEnterAnimation();
      stepTransitionTimerRef.current = null;
    }, STEP_DISSOLVE_OUT_MS);
  };

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
    /** Секция «финальная карточка» (initialOrderStep 5) — отдельный экземпляр, не сбрасывать при глобальном переходе */
    if (initialOrderStep === 5) return undefined;
    const resetToLeadCard = () => setOrderStepAnimated(0, { immediate: true });
    window.addEventListener(NAVIGATE_TO_ORDER_LANDING_EVENT, resetToLeadCard);
    return () => window.removeEventListener(NAVIGATE_TO_ORDER_LANDING_EVENT, resetToLeadCard);
  }, [initialOrderStep, orderStep]);

  useEffect(() => {
    if (typeof onStackedWizardStepsActive !== 'function') return undefined;
    return () => onStackedWizardStepsActive(false);
  }, [onStackedWizardStepsActive]);

  useEffect(() => {
    if (typeof onConsultationFlowOpenChange !== 'function') return;
    onConsultationFlowOpenChange(Boolean(consultationFlowOpen));
    return () => onConsultationFlowOpenChange(false);
  }, [consultationFlowOpen, onConsultationFlowOpenChange]);

  useEffect(() => () => clearStepTransitionHandles(), []);

  const goToTariffStep = () => {
    if (!privacyAccepted) {
      setPrivacyConsentTouched(true);
      setSubmitAttemptedWithoutPrivacy(true);
      return;
    }
    setOrderStepAnimated(1);
  };

  const collapseWizardToLanding = () => {
    setOrderStepAnimated(0);
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
    setOrderStepAnimated(2);
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
    setOrderStepAnimated(3);
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
    setOrderStepAnimated(4);
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
    setConsultationFlowOpen(true);
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

  /** В сценарии заказа: сразу форма «Имя + номер», без шага выбора канала. */
  const handleConsultationFlowSubmit = async (payload) => {
    setConsultationFlowOpen(false);
    if (!payload?.phone) return;
    // Сбрасываем мастер, чтобы родитель снял блокировку вертикального скролла (overflow-y-hidden).
    setOrderStepAnimated(0, { immediate: true });
    // Не блокируем переход на первую страницу сетевым запросом:
    // UI должен продолжаться сразу после закрытия модалки.
    void submitOrderLead({ name: payload.name || null, phone: payload.phone, contactMethod: 'phone' });
    if (typeof onAfterPhoneLead === 'function') {
      onAfterPhoneLead();
    } else {
      router.push('/');
    }
  };

  const wizardCollapseButton = (
    <button
      type="button"
      onClick={collapseWizardToLanding}
      className="box-border flex h-10 w-10 items-center justify-center rounded-[20px] border border-white/50 bg-white backdrop-blur-[5px] transition-opacity hover:opacity-90 outline-none focus:outline-none"
      aria-label="Свернуть окно"
    >
      <CollapseIcon />
    </button>
  );

  const wizardDissolveStyle = {
    opacity: stepVisualState === 'in' ? 1 : 0,
    filter: stepVisualState === 'in' ? 'blur(0px)' : 'blur(5px)',
    transform: stepVisualState === 'in' ? 'translateY(0px) scale(1)' : 'translateY(10px) scale(0.99)',
    transition:
      stepVisualState === 'out'
        ? `opacity ${STEP_DISSOLVE_OUT_MS}ms cubic-bezier(0.4, 0, 1, 1), filter ${STEP_DISSOLVE_OUT_MS}ms cubic-bezier(0.4, 0, 1, 1), transform ${STEP_DISSOLVE_OUT_MS}ms cubic-bezier(0.4, 0, 1, 1)`
        : `opacity ${STEP_DISSOLVE_IN_MS}ms cubic-bezier(0.22, 1, 0.36, 1), filter ${STEP_DISSOLVE_IN_MS}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${STEP_DISSOLVE_IN_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    willChange: 'opacity, transform',
  };

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
        ...wizardDissolveStyle,
      }}
    >
      <h1 className="m-0 flex-shrink-0" style={{ ...involve, fontSize: 20, lineHeight: '125%', color: '#101010', paddingBottom: 15 }}>
        {headingVariant === 'final' ? 'Призвание школьников,' : 'Формирование своих тарифов'}
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
        className="box-border flex min-w-0 shrink-0 items-center gap-[5px] self-start rounded-[100px] bg-[#ebebeb] px-[5px]"
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
        {headingVariant === 'final' ? 'Профориентирование' : 'Формирование'}
      </button>
    </div>
  );

  return (
    <>
      <div
        className={
          isStacked
            ? 'relative z-0 flex h-full min-h-0 w-full min-w-0 flex-col items-stretch overflow-hidden bg-background'
            : 'fixed inset-0 z-[9999] flex w-full min-w-0 flex-col items-stretch overflow-hidden bg-background'
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
          className="relative box-border flex h-full min-h-0 w-full min-w-0 flex-col bg-background"
          style={{
            boxSizing: 'border-box',
          }}
        >
          {(orderStep === 0 || orderStep === 5) && !isStacked ? (
            <LandingHeaderBar onConsultationClick={() => setConsultationFlowOpen(true)} />
          ) : null}

          {orderStep === 0 && renderLeadCard(goToTariffStep, 'default')}
          {orderStep === 5 && renderLeadCard(() => setConsultationFlowOpen(true), 'final')}

        {(orderStep === 1 || orderStep === 2 || orderStep === 3 || orderStep === 4) && (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={{ boxSizing: 'border-box' }}>
            <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-background">
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
                  ...wizardDissolveStyle,
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
                        onClick={() => setOrderStepAnimated(0)}
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
                        onClick={() => setOrderStepAnimated(1)}
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
                        onClick={() => setOrderStepAnimated(2)}
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
                        onClick={() => setOrderStepAnimated(3)}
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
        <ConsultationModal
          isOpen={consultationFlowOpen}
          onClose={() => setConsultationFlowOpen(false)}
          onComplete={handleConsultationFlowSubmit}
        />
      ) : null}
    </>
  );
}
