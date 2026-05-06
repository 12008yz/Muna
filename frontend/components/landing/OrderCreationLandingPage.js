'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import ManaMarketingHeader from '@/components/landing/ManaMarketingHeader';
import ConsultationFlow from '@/components/modals/ConsultationFlow';
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
  fontFamily: "'TT Firs Neue', var(--font-involve), system-ui, sans-serif",
  fontWeight: 400,
  width: 330,
  maxWidth: '100%',
  height: 20,
  minHeight: 20,
  fontSize: 18,
  lineHeight: '110%',
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  marginBottom: 5,
};

/** Подзаголовок мастера (Figma: 330×15, 14px, line-height 110%, color 50%) */
const wizardSubtitleStyle = {
  ...involve,
  fontFamily: "'TT Firs Neue', var(--font-involve), system-ui, sans-serif",
  fontWeight: 400,
  width: 330,
  maxWidth: '100%',
  height: 30,
  minHeight: 30,
  fontSize: 14,
  lineHeight: '110%',
  color: 'rgba(255, 255, 255, 0.25)',
  marginBottom: 10,
};

/** Как в ConsultationFlow / GroupTrainingPage / PrivacyPolicyPage (кнопка: safe area + 10px). */
function CollapseIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM8.125 15C6.76526 15 5.43605 14.5968 4.30546 13.8414C3.17487 13.0859 2.29368 12.0122 1.77333 10.7559C1.25298 9.49971 1.11683 8.11737 1.3821 6.78375C1.64738 5.45013 2.30216 4.22513 3.26364 3.26364C4.22513 2.30216 5.45014 1.64737 6.78376 1.3821C8.11738 1.11683 9.49971 1.25298 10.756 1.77333C12.0122 2.29368 13.0859 3.17487 13.8414 4.30545C14.5968 5.43604 15 6.76525 15 8.125C14.9979 9.94773 14.2729 11.6952 12.9841 12.9841C11.6952 14.2729 9.94773 14.9979 8.125 15ZM11.875 8.125C11.875 8.29076 11.8092 8.44973 11.6919 8.56694C11.5747 8.68415 11.4158 8.75 11.25 8.75H6.5086L7.94219 10.1828C8.00026 10.2409 8.04632 10.3098 8.07775 10.3857C8.10918 10.4616 8.12535 10.5429 8.12535 10.625C8.12535 10.7071 8.10918 10.7884 8.07775 10.8643C8.04632 10.9402 8.00026 11.0091 7.94219 11.0672C7.88412 11.1253 7.81518 11.1713 7.73931 11.2027C7.66344 11.2342 7.58213 11.2503 7.5 11.2503C7.41788 11.2503 7.33656 11.2342 7.26069 11.2027C7.18482 11.1713 7.11588 11.1253 7.05782 11.0672L4.55782 8.56719C4.49971 8.50914 4.45361 8.44021 4.42215 8.36434C4.3907 8.28846 4.37451 8.20713 4.37451 8.125C4.37451 8.04287 4.3907 7.96154 4.42215 7.88566C4.45361 7.80979 4.49971 7.74086 4.55782 7.68281L7.05782 5.18281C7.17509 5.06554 7.33415 4.99965 7.5 4.99965C7.66586 4.99965 7.82492 5.06554 7.94219 5.18281C8.05947 5.30009 8.12535 5.45915 8.12535 5.625C8.12535 5.79085 8.05947 5.94991 7.94219 6.06719L6.5086 7.5H11.25C11.4158 7.5 11.5747 7.56585 11.6919 7.68306C11.8092 7.80027 11.875 7.95924 11.875 8.125Z"
          fill="white"
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

function ManaStyleSelectedCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346631 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6568C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C15.9978 5.87895 15.1542 3.84542 13.6544 2.34562C12.1546 0.845813 10.121 0.00223986 8 0ZM11.5123 6.58923L7.20462 10.8969C7.14747 10.9541 7.0796 10.9995 7.00489 11.0305C6.93018 11.0615 6.8501 11.0774 6.76923 11.0774C6.68836 11.0774 6.60828 11.0615 6.53358 11.0305C6.45887 10.9995 6.391 10.9541 6.33385 10.8969L4.4877 9.05077C4.37222 8.9353 4.30735 8.77868 4.30735 8.61538C4.30735 8.45208 4.37222 8.29547 4.4877 8.18C4.60317 8.06453 4.75978 7.99966 4.92308 7.99966C5.08638 7.99966 5.24299 8.06453 5.35846 8.18L6.76923 9.59154L10.6415 5.71846C10.6987 5.66128 10.7666 5.61593 10.8413 5.58499C10.916 5.55404 10.9961 5.53812 11.0769 5.53812C11.1578 5.53812 11.2379 5.55404 11.3126 5.58499C11.3873 5.61593 11.4551 5.66128 11.5123 5.71846C11.5695 5.77564 11.6148 5.84351 11.6458 5.91822C11.6767 5.99292 11.6927 6.07299 11.6927 6.15384C11.6927 6.2347 11.6767 6.31477 11.6458 6.38947C11.6148 6.46418 11.5695 6.53205 11.5123 6.58923Z"
        fill="white"
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
  const [consultationInitialStep, setConsultationInitialStep] = useState('contact-method');
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

  /** На тёмном фоне: сначала кнопка активная, после невалидного клика — приглушённая до валидного выбора */
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
      lineHeight: '315%',
      border: solid ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
      background: solid ? '#FFFFFF' : 'transparent',
      color: solid ? '#050505' : '#FFFFFF',
      opacity: solid ? 1 : 0.25,
    };
  };

  const submitButtonSolid = !submitAttemptedWithoutPrivacy || privacyAccepted;
  const privacyBorderMuted = 'rgba(16,16,16,0.25)';
  const privacyBorderStrong = 'rgba(16,16,16,0.75)';
  const privacyShowStrongBorder = !privacyAccepted && privacyConsentTouched;

  useEffect(() => {
    if (!isStacked || typeof exposeOpenConsultation !== 'function') return;
    exposeOpenConsultation(() => {
      setConsultationInitialStep('contact-method');
      setConsultationFlowOpen(true);
    });
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
    setConsultationInitialStep('phone-callback-form');
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
      className="box-border flex h-10 w-10 items-center justify-center rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[#050505] backdrop-blur-[5px] transition-opacity hover:opacity-90 outline-none focus:outline-none"
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

  const renderLeadCard = (buttonHandler) => (
    <div
      className="absolute box-border"
      style={{
        left: 'var(--main-block-margin)',
        width: 360,
        height: 'auto',
        bottom: 0,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        padding: 15,
        boxSizing: 'border-box',
        gap: 0,
        background: 'rgba(5, 5, 5, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(7.5px)',
        WebkitBackdropFilter: 'blur(7.5px)',
        ...wizardDissolveStyle,
      }}
    >
      <h1
        className="m-0 w-[330px] max-w-none flex-shrink-0 whitespace-pre"
        style={{ ...involve, fontSize: 18, lineHeight: '125%', letterSpacing: '-0.01em', color: '#FFFFFF' }}
      >
        {'Маркетинговое прогнозирование\nпотенциала для захвата рынка\nпри помощи медиа и сайта,\nмалого и среднего дела'}
      </h1>
      <p
        className="m-0 mt-[20px] h-[40px] w-[330px]"
        style={{
          fontFamily: "'TT Firs Neue', var(--font-involve), system-ui, sans-serif",
          fontStyle: 'normal',
          fontWeight: 400,
          fontSize: 16,
          lineHeight: '125%',
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        Прогнозирование однозначно важного,
        <br />
        одновременно, сейчас неизвестного
      </p>

      <button
        type="button"
        className="box-border mt-[20px] mb-0 flex w-full max-w-[330px] min-w-0 shrink-0 cursor-pointer items-center justify-center rounded-[10px] outline-none focus:outline-none"
        style={{
          ...involve,
          width: '100%',
          height: 50,
          minHeight: 50,
          background: '#FFFFFF',
          border: '1px solid #FFFFFF',
          borderRadius: 10,
          fontSize: 16,
          lineHeight: '315%',
          color: '#050505',
        }}
        onClick={buttonHandler}
      >
        Прогнозирование
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
            <ManaMarketingHeader
              onConsultationClick={() => {
                setConsultationInitialStep('contact-method');
                setConsultationFlowOpen(true);
              }}
              menuHref="/"
            />
          ) : null}

          {orderStep === 0 && renderLeadCard(goToTariffStep)}

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
                className="scrollbar-hide relative mt-auto flex w-full min-w-0 flex-shrink-0 flex-col rounded-[20px]"
                style={{
                  marginLeft: 'var(--main-block-margin)',
                  width: 360,
                  height: 360,
                  boxSizing: 'border-box',
                  padding: 15,
                  marginBottom: 0,
                  background: 'rgba(5, 5, 5, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(7.5px)',
                  WebkitBackdropFilter: 'blur(7.5px)',
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
                <h2 className="m-0 flex w-full max-w-[330px] flex-shrink-0 items-center self-stretch" style={wizardTitleStyle}>
                  {orderStep === 4 ? 'Прогнозирование' : 'Формирование тарифного плана'}
                </h2>

                {orderStep === 1 && (
                  <>
                    <p className="m-0 flex w-full max-w-[330px] flex-shrink-0 items-center self-stretch" style={wizardSubtitleStyle}>
                      Главное во всех ответах, это четкость.
                      <br />
                      Незаменимое во всех ответах, это честность
                    </p>
                    <div className="h-0 w-full max-w-[330px] border-t border-[rgba(255,255,255,0.1)]" />
                    <p
                      className="m-0 absolute left-[15px] top-[90px] h-[60px] w-[330px]"
                      style={{
                        fontFamily: "'TT Firs Neue', var(--font-involve), system-ui, sans-serif",
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: 16,
                        lineHeight: '125%',
                        letterSpacing: '-0.01em',
                        color: 'rgba(255,255,255,0.5)',
                        overflow: 'hidden',
                      }}
                    >
                      <span className="block whitespace-nowrap">Посмотрите сейчас на своё предприятие</span>
                      <span className="block whitespace-nowrap">со стороны, например, как ваш клиент.</span>
                      <span className="block whitespace-nowrap">Кликните на очень похожее мнение</span>
                    </p>

                    <div className="mt-[90px] flex w-full max-w-[330px] flex-col gap-[5px]" style={{ marginBottom: 20 }}>
                      {[
                        { id: 'low-known', label: 'Компания малоизвестна в сети' },
                        { id: 'high-known', label: 'Компания известна в сети' },
                      ].map((item) => {
                        const selected = prepType === item.id;
                        const showRequired = attemptedStep1 && !prepType;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setPrepType(item.id)}
                            className="box-border flex h-[50px] w-full items-center gap-[10px] rounded-[10px] border border-solid bg-transparent px-[10px] text-left outline-none"
                            style={{ borderColor: showRequired ? 'rgba(255,255,255,0.5)' : selected ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)' }}
                          >
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                              {selected ? (
                                <ManaStyleSelectedCheckIcon />
                              ) : (
                                <span className="h-4 w-4 rounded-full border border-[rgba(255,255,255,0.5)]" />
                              )}
                            </span>
                            <span
                              style={{
                                fontFamily: "'TT Firs Neue', var(--font-involve), system-ui, sans-serif",
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: 16,
                                lineHeight: '125%',
                                color: selected || showRequired ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                              }}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex w-full max-w-[330px] items-center gap-[5px]">
                      <button
                        type="button"
                        onClick={() => setOrderStepAnimated(0)}
                        className="flex h-[50px] w-[50px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[rgba(255,255,255,0.1)] bg-transparent outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.92]"
                        aria-label="Назад"
                      >
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                          <path
                            d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 -5.34251e-07 6 -5.24537e-07C6.11112 -5.14822e-07 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z"
                            fill="#FFFFFF"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handlePrepTypeNext}
                        className="flex h-[50px] min-h-[50px] flex-1 cursor-pointer items-center justify-center rounded-[10px] outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.97]"
                        style={{
                          ...wizardNextStyle(1),
                          fontFamily: "'TT Firs Neue', var(--font-involve), system-ui, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        Далее
                      </button>
                    </div>
                  </>
                )}

                {orderStep === 2 && (
                  <>
                    <p className="m-0 flex w-full max-w-[330px] flex-shrink-0 items-center self-stretch" style={wizardSubtitleStyle}>
                      Главное во всех ответах, это четкость.
                      <br />
                      Незаменимое во всех ответах, это честность
                    </p>
                    <div className="h-0 w-full max-w-[330px] border-t border-[rgba(255,255,255,0.1)]" />
                    <p
                      className="m-0 absolute left-[15px] top-[90px] h-[60px] w-[330px]"
                      style={{
                        fontFamily: "'TT Firs Neue', var(--font-involve), system-ui, sans-serif",
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: 16,
                        lineHeight: '125%',
                        letterSpacing: '-0.01em',
                        color: 'rgba(255,255,255,0.5)',
                        overflow: 'hidden',
                      }}
                    >
                      <span className="block whitespace-nowrap">Посмотрите сейчас на своё предприятие</span>
                      <span className="block whitespace-nowrap">со стороны, например, как ваш клиент.</span>
                      <span className="block whitespace-nowrap">Кликните на очень похожее мнение</span>
                    </p>

                    <div className="mt-[90px] flex w-full max-w-[330px] flex-col gap-[5px]" style={{ marginBottom: 20 }}>
                      {[
                        { id: 0, label: 'Компания незнакома с трендами' },
                        { id: 1, label: 'Компания знакома с трендами' },
                      ].map((item) => {
                        const selected = grade === item.id;
                        const showRequired = attemptedStep2 && grade == null;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setGrade(item.id)}
                            className="box-border flex h-[50px] w-full items-center gap-[10px] rounded-[10px] border border-solid bg-transparent px-[10px] text-left outline-none"
                            style={{ borderColor: showRequired ? 'rgba(255,255,255,0.5)' : selected ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)' }}
                          >
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                              {selected ? (
                                <ManaStyleSelectedCheckIcon />
                              ) : (
                                <span className="h-4 w-4 rounded-full border border-[rgba(255,255,255,0.5)]" />
                              )}
                            </span>
                            <span style={{ ...involve, fontSize: 16, lineHeight: '125%', color: selected || showRequired ? '#FFFFFF' : 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex w-full max-w-[330px] items-center gap-[5px]">
                      <button
                        type="button"
                        onClick={() => setOrderStepAnimated(1)}
                        className="flex h-[50px] w-[50px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[rgba(255,255,255,0.1)] bg-transparent outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.92]"
                        aria-label="Назад"
                      >
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                          <path
                            d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 -5.34251e-07 6 -5.24537e-07C6.11112 -5.14822e-07 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z"
                            fill="#FFFFFF"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleGradeNext}
                        className="flex h-[50px] min-h-[50px] flex-1 cursor-pointer items-center justify-center rounded-[10px] outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.97]"
                        style={wizardNextStyle(2)}
                      >
                        Далее
                      </button>
                    </div>
                  </>
                )}

                {orderStep === 3 && (
                  <>
                    <p className="m-0 flex w-full max-w-[330px] flex-shrink-0 items-center self-stretch" style={wizardSubtitleStyle}>
                      Главное во всех ответах, это четкость.
                      <br />
                      Незаменимое во всех ответах, это честность
                    </p>
                    <div className="h-0 w-full max-w-[330px] border-t border-[rgba(255,255,255,0.1)]" />
                    <p
                      className="m-0 absolute left-[15px] top-[90px] h-[60px] w-[330px]"
                      style={{
                        fontFamily: "'TT Firs Neue', var(--font-involve), system-ui, sans-serif",
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: 16,
                        lineHeight: '125%',
                        letterSpacing: '-0.01em',
                        color: 'rgba(255,255,255,0.5)',
                        overflow: 'hidden',
                      }}
                    >
                      <span className="block whitespace-nowrap">Посмотрите сейчас на своё предприятие</span>
                      <span className="block whitespace-nowrap">со стороны, например, как ваш клиент.</span>
                      <span className="block whitespace-nowrap">Кликните на очень похожее мнение</span>
                    </p>

                    <div className="mt-[90px] flex w-full max-w-[330px] flex-col gap-[5px]" style={{ marginBottom: 20 }}>
                      {[
                        { id: 'load-low', label: 'Компания не загружена на 95%' },
                        { id: 'load-high', label: 'Компания загружена на 95%' },
                      ].map((item) => {
                        const selected = selectedSubjectIds.includes(item.id);
                        const showRequired = attemptedStep3 && selectedSubjectIds.length === 0;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedSubjectIds([item.id])}
                            className="box-border flex h-[50px] w-full items-center gap-[10px] rounded-[10px] border border-solid bg-transparent px-[10px] text-left outline-none"
                            style={{ borderColor: showRequired ? 'rgba(255,255,255,0.5)' : selected ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)' }}
                          >
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                              {selected ? (
                                <ManaStyleSelectedCheckIcon />
                              ) : (
                                <span className="h-4 w-4 rounded-full border border-[rgba(255,255,255,0.5)]" />
                              )}
                            </span>
                            <span style={{ ...involve, fontSize: 16, lineHeight: '125%', color: selected || showRequired ? '#FFFFFF' : 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex w-full max-w-[330px] items-center gap-[5px]">
                      <button
                        type="button"
                        onClick={() => setOrderStepAnimated(2)}
                        className="flex h-[50px] w-[50px] flex-shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[rgba(255,255,255,0.1)] bg-transparent outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.92]"
                        aria-label="Назад"
                      >
                        <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }} aria-hidden>
                          <path
                            d="M0.112544 5.34082L5.70367 0.114631C5.7823 0.0412287 5.88888 -5.34251e-07 6 -5.24537e-07C6.11112 -5.14822e-07 6.2177 0.0412287 6.29633 0.114631L11.8875 5.34082C11.9615 5.41513 12.0019 5.5134 11.9999 5.61495C11.998 5.7165 11.954 5.81338 11.8772 5.8852C11.8004 5.95701 11.6967 5.99815 11.5881 5.99994C11.4794 6.00173 11.3743 5.96404 11.2948 5.8948L6 0.946249L0.705204 5.8948C0.625711 5.96404 0.520573 6.00173 0.411936 5.99994C0.3033 5.99815 0.199649 5.95701 0.12282 5.88519C0.04599 5.81338 0.00198176 5.71649 6.48835e-05 5.61495C-0.00185199 5.5134 0.0384722 5.41513 0.112544 5.34082Z"
                            fill="#FFFFFF"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleSubjectsNext}
                        className="flex h-[50px] min-h-[50px] flex-1 cursor-pointer items-center justify-center rounded-[10px] outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.97]"
                        style={wizardNextStyle(3)}
                      >
                        Далее
                      </button>
                    </div>
                  </>
                )}

                {orderStep === 4 && (
                  <>
                    <p className="m-0 flex w-full max-w-[330px] flex-shrink-0 items-center self-stretch" style={wizardSubtitleStyle}>
                      Главное во всех ответах, это четкость.
                      <br />
                      Незаменимое во всех ответах, это честность
                    </p>
                    <div className="h-0 w-full max-w-[330px] border-t border-[rgba(255,255,255,0.1)]" />
                    <p
                      className="m-0 absolute left-[15px] top-[90px] h-[60px] w-[330px]"
                      style={{
                        fontFamily: "'TT Firs Neue', var(--font-involve), system-ui, sans-serif",
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: 16,
                        lineHeight: '125%',
                        letterSpacing: '-0.01em',
                        color: 'rgba(255,255,255,0.5)',
                        overflow: 'hidden',
                      }}
                    >
                      <span className="block whitespace-nowrap">Посмотрите сейчас на своё предприятие</span>
                      <span className="block whitespace-nowrap">со стороны, например, как ваш клиент.</span>
                      <span className="block whitespace-nowrap">Кликните на очень похожее мнение</span>
                    </p>

                    <div className="mt-[90px] flex w-full max-w-[330px] flex-col gap-[5px]" style={{ marginBottom: 20 }}>
                      <div
                        className="box-border flex h-[105px] w-full items-start gap-[10px] rounded-[10px] border border-solid border-[rgba(255,255,255,0.1)] bg-transparent px-[10px] pt-[15px]"
                      >
                        <span className="mt-[4px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white">
                          <span style={{ ...involve, fontWeight: 500, fontSize: 14, lineHeight: '100%', color: '#050505' }}>!</span>
                        </span>
                        <div className="min-w-0">
                          <p
                            className="m-0"
                            style={{
                              fontFamily: "'TT Firs Neue', var(--font-involve), system-ui, sans-serif",
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: 16,
                              lineHeight: '125%',
                              color: '#FFFFFF',
                            }}
                          >
                            Категорически важно ведение маркетингового и медиа, и сайта
                          </p>
                          <p
                            className="m-0 mt-[10px]"
                            style={{
                              fontFamily: "'TT Firs Neue', var(--font-involve), system-ui, sans-serif",
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: 16,
                              lineHeight: '125%',
                              color: '#5050FF',
                            }}
                          >
                            Риск у компании · {selectedSubjectIds.includes('load-high') ? 'низкий' : 'высокий'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDurationNext}
                      className="flex h-[50px] min-h-[50px] w-full max-w-[330px] cursor-pointer items-center justify-center rounded-[10px] border border-solid border-white bg-white outline-none transition-transform duration-150 ease-out focus:outline-none active:scale-[0.97]"
                      style={{ ...involve, fontSize: 16, lineHeight: '315%', color: '#050505' }}
                    >
                      Продолжение
                    </button>
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
          initialStep={consultationInitialStep}
          onClose={() => setConsultationFlowOpen(false)}
          onSkip={() => setConsultationFlowOpen(false)}
          onSubmit={handleConsultationFlowSubmit}
        />
      ) : null}
    </>
  );
}
