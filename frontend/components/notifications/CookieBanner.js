'use client';

import Link from 'next/link';
import CloseIcon from '@/components/common/CloseIcon';

const involve = {
  fontFamily: "'TT Firs Neue', system-ui, sans-serif",
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
 * `stacked` — внутри колонки уведомлений: без absolute top/left, выравнивание даёт родитель.
 */
const privacyLinkStyle = {
  color: '#0075FF',
  textDecoration: 'underline',
  textDecorationSkipInk: 'none',
  textUnderlineOffset: '3px',
};

/** Тёмный стеклянный баннер (MANA hero, Figma Rectangle 67) */
const manaDarkLinkStyle = {
  color: '#FFFFFF',
  textDecoration: 'underline',
  textDecorationSkipInk: 'none',
  textUnderlineOffset: '3px',
};

export default function CookieBanner({
  countdown,
  onClose,
  privacyHref,
  /** На главной: открыть полный текст политики без перехода по маршруту */
  onPrivacyLinkClick,
  children,
  compact = false,
  stacked = false,
  /** Стеклянный тёмный вариант для первого экрана MANA */
  manaDark = false,
}) {
  if (manaDark && stacked && !compact) {
    /** Figma Group 7476 / Rectangle 67: 360×115; тексты left 35 − left(rect 20) = 15px inset */
    return (
      <div
        className="relative z-20 box-border"
        style={{
          width: 360,
          height: 115,
          boxSizing: 'border-box',
          background: 'rgba(5, 5, 5, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(7.5px)',
          WebkitBackdropFilter: 'blur(7.5px)',
          borderRadius: 20,
        }}
        onClick={(e) => e.stopPropagation()}
        role="region"
        aria-label="Уведомление о файлах cookie"
      >
        <span
          className="absolute z-0 box-border overflow-hidden text-ellipsis whitespace-nowrap"
          style={{
            left: 15,
            top: 15,
            width: 330,
            height: 15,
            margin: 0,
            padding: 0,
            fontFamily: involve.fontFamily,
            fontStyle: 'normal',
            fontWeight: 400,
            fontSynthesis: 'none',
            fontSize: 14,
            lineHeight: '105%',
            color: 'rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Автоматически закроется через {countdown}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="absolute z-[1] flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none"
          style={{ top: 12, right: 15 }}
          aria-label="Закрыть"
        >
          <CloseIcon width={16} height={16} variant="dark" />
        </button>
        <div
          className="absolute box-border min-w-0 overflow-hidden"
          style={{
            left: 15,
            top: 40,
            width: 330,
            height: 60,
            fontFamily: involve.fontFamily,
            fontStyle: 'normal',
            fontWeight: 400,
            fontSynthesis: 'none',
            fontSize: 14,
            lineHeight: '110%',
            color: '#FFFFFF',
          }}
        >
          {children || (
            <>
              Если продолжаете использовать этот сайт, вы выражаете своё согласие на использование файлов куки, в
              соответствии с условиями{' '}
              {typeof onPrivacyLinkClick === 'function' ? (
                <button
                  type="button"
                  onClick={onPrivacyLinkClick}
                  className="cursor-pointer border-0 bg-transparent p-0"
                  style={{
                    ...manaDarkLinkStyle,
                    fontFamily: involve.fontFamily,
                    fontSize: 14,
                    lineHeight: '110%',
                    fontWeight: 400,
                  }}
                >
                  политики конфиденциальности
                </button>
              ) : (
                <Link href={privacyHref || '/privacy-policy'} style={manaDarkLinkStyle}>
                  политики конфиденциальности
                </Link>
              )}{' '}
              сайта
            </>
          )}
        </div>
      </div>
    );
  }

  if (manaDark && stacked && compact) {
    /** Figma Group 7476: 360×70; строки как у cookie-баннера, одна строка основного текста */
    return (
      <div
        className="relative z-20 box-border"
        style={{
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
        role="region"
        aria-label="Уведомление"
      >
        <span
          className="absolute z-0 box-border overflow-hidden text-ellipsis whitespace-nowrap"
          style={{
            left: 15,
            top: 15,
            width: 330,
            height: 15,
            margin: 0,
            padding: 0,
            fontFamily: involve.fontFamily,
            fontStyle: 'normal',
            fontWeight: 400,
            fontSynthesis: 'none',
            fontSize: 14,
            lineHeight: '105%',
            color: 'rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Автоматически закроется через {countdown}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="absolute z-[1] flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none"
          style={{ top: 12, right: 15 }}
          aria-label="Закрыть"
        >
          <CloseIcon width={16} height={16} variant="dark" />
        </button>
        <p
          className="absolute m-0 box-border min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
          style={{
            left: 15,
            top: 40,
            width: 330,
            height: 15,
            padding: 0,
            fontFamily: involve.fontFamily,
            fontStyle: 'normal',
            fontWeight: 400,
            fontSynthesis: 'none',
            fontSize: 14,
            lineHeight: '110%',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {children}
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div
        className={`box-border ${stacked ? 'relative z-20 mx-auto w-full min-w-0' : 'absolute left-5 z-20'}`}
        style={{
          position: stacked ? 'relative' : 'absolute',
          width: stacked ? '100%' : 360,
          maxWidth: stacked ? '100%' : undefined,
          height: 70,
          ...(stacked ? {} : { left: 'var(--main-block-margin)', top: 'var(--notification-top)' }),
          background: stacked ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          backdropFilter: stacked ? 'none' : 'blur(7.5px)',
          WebkitBackdropFilter: stacked ? 'none' : 'blur(7.5px)',
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
      className={`z-20 flex flex-col rounded-[20px] bg-white ${
        stacked ? 'relative mx-auto w-full min-w-0' : 'absolute left-1/2 -translate-x-1/2'
      }`}
      style={{
        width: stacked ? '100%' : 'min(360px, calc(100vw - 2 * var(--main-block-margin)))',
        ...(stacked ? {} : { top: 'var(--notification-top)' }),
        padding: 15,
        boxSizing: 'border-box',
        background: '#FFFFFF',
        backdropFilter: stacked ? 'none' : 'blur(7.5px)',
        WebkitBackdropFilter: stacked ? 'none' : 'blur(7.5px)',
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
        className="min-w-0"
        style={{
          ...bodyTextStyle,
          marginTop: 8,
          width: '100%',
        }}
      >
        {children || (
          <>
            Если продолжаете использовать этот сайт,
            <br />
            вы выражаете согласие на использование
            <br />
            файлов куки в соответствии с условиями
            <br />
            {typeof onPrivacyLinkClick === 'function' ? (
              <button
                type="button"
                onClick={onPrivacyLinkClick}
                className="cursor-pointer border-0 bg-transparent p-0"
                style={{ ...bodyTextStyle, ...privacyLinkStyle }}
              >
                политики приватности
              </button>
            ) : (
              <Link href={privacyHref || '/privacy-policy'} style={privacyLinkStyle}>
                политики приватности
              </Link>
            )}{' '}
            этого сайта
          </>
        )}
      </div>
    </div>
  );
}
