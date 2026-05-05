'use client';

import { useEffect, useState } from 'react';

const involve = {
  fontFamily: 'var(--font-involve), system-ui, sans-serif',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSynthesis: 'none',
};

/**
 * После загрузочного экрана (Figma ne-400-5-1-1): колонна до 400×870, фон #050505,
 * нижний слот 125px под декор (в макете background без url), кнопка «Далее» по отступам макета.
 */
export default function PostLoadIntroScreen({ onContinue }) {
  const [showContinueButton, setShowContinueButton] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setShowContinueButton(true);
    }, 1700);
    return () => window.clearTimeout(timerId);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[10001] flex justify-center bg-[#050505] pt-[var(--sat,0px)]"
    >
      <div
        className="relative box-border w-full max-w-[400px] bg-[#050505]"
        style={{
          height: 'min(calc(100dvh - var(--sat, 0px)), 870px)',
        }}
      >
        {/* image 1 — 400×125 у нижнего края (top 745px в кадре 870px); url в макете пустой */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[125px] bg-transparent"
          aria-hidden
        />

        <button
          type="button"
          onClick={onContinue}
          disabled={!showContinueButton}
          className="absolute box-border flex min-h-[50px] items-center justify-center border border-solid border-white outline-none transition-opacity duration-500 ease-out hover:opacity-90 focus:outline-none disabled:cursor-default"
          style={{
            ...involve,
            left: '8.75%',
            right: '8.75%',
            bottom: 'calc(35px + env(safe-area-inset-bottom, 0px))',
            borderRadius: 10,
            fontSize: 16,
            lineHeight: '315%',
            color: '#FFFFFF',
            background: 'transparent',
            textAlign: 'center',
            opacity: showContinueButton ? 1 : 0,
            pointerEvents: showContinueButton ? 'auto' : 'none',
          }}
        >
          Далее
        </button>
      </div>
    </div>
  );
}
