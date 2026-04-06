'use client';

import Link from 'next/link';
import CloseIcon from '@/components/common/CloseIcon';

const involve = {
  fontFamily: 'var(--font-involve), system-ui, sans-serif',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSynthesis: 'none',
};

/** Текст основного блока (куки / длинный) — по макету 14px / 105% */
const bodyTextStyle = {
  ...involve,
  fontSize: 14,
  lineHeight: '105%',
  color: '#101010',
};

/**
 * Короткое уведомление (Rectangle 67): текст «Информация направлена…»
 * Баннер: top = --notification-top (ниже шапки на 10px, см. globals.css).
 */
const compactMessageStyle = {
  position: 'absolute',
  left: 15,
  top: 40,
  width: 330,
  height: 15,
  margin: 0,
  padding: 0,
  ...bodyTextStyle,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

/**
 * Баннер уведомления (куки и т.п.) — как Frame5 / Frame4.
 * `compact` — 360×70, glass; top: 10px под header (--notification-top), left 20.
 */
export default function CookieBanner({
  countdown,
  onClose,
  privacyHref,
  children,
  compact = false,
}) {
  if (compact) {
    return (
      <div
        className="absolute z-20 box-border"
        style={{
          position: 'absolute',
          width: 360,
          height: 70,
          left: 20,
          top: 'var(--notification-top)',
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(7.5px)',
          WebkitBackdropFilter: 'blur(7.5px)',
          borderRadius: 20,
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
        role="region"
        aria-label="Уведомление"
      >
        <div
          className="absolute flex items-center justify-between"
          style={{
            left: 15,
            right: 15,
            top: 10,
            height: 20,
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              ...involve,
              fontSize: 14,
              lineHeight: '145%',
              color: 'rgba(16, 16, 16, 0.25)',
            }}
          >
            Автоматически закроется через {countdown}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none"
            aria-label="Закрыть"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>
        <p style={compactMessageStyle}>{children}</p>
      </div>
    );
  }

  return (
    <div
      className="absolute left-1/2 z-20 flex -translate-x-1/2 flex-col rounded-[20px] bg-white"
      style={{
        width: 'min(360px, calc(100vw - 40px))',
        top: 'var(--notification-top)',
        padding: 15,
        boxSizing: 'border-box',
        backdropFilter: 'blur(7.5px)',
      }}
      onClick={(e) => e.stopPropagation()}
      role="region"
      aria-label="Уведомление"
    >
      <div className="flex min-h-[20px] flex-shrink-0 items-center justify-between">
        <span
          style={{
            ...involve,
            fontSize: 14,
            lineHeight: '145%',
            color: 'rgba(16, 16, 16, 0.25)',
          }}
        >
          Автоматически закроется через {countdown}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none"
          aria-label="Закрыть"
        >
          <CloseIcon width={16} height={16} />
        </button>
      </div>
      <div
        style={{
          ...bodyTextStyle,
          marginTop: 8,
          width: 330,
          maxWidth: '100%',
        }}
      >
        {children || (
          <>
            Если продолжаете использовать этот портал,
            <br />
            вы выражаете согласие на использование
            <br />
            файлов куки в соответствии с условиями
            <br />
            <Link
              href={privacyHref || '/privacy-policy'}
              style={{
                color: '#0075FF',
                textDecoration: 'underline',
                textDecorationSkipInk: 'none',
                textUnderlineOffset: '3px',
              }}
            >
              политики приватности
            </Link>{' '}
            такого портала
          </>
        )}
      </div>
    </div>
  );
}
