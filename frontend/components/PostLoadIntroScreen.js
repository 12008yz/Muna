'use client';

import { useEffect, useState } from 'react';

const involve = {
  fontFamily: "'TT Firs Neue', system-ui, sans-serif",
  fontStyle: 'normal',
  fontWeight: 400,
  fontSynthesis: 'none',
};

/**
 * После загрузочного экрана (Figma ne-400-5-1-1): колонна до 400×870, фон чёрный,
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

  useEffect(() => {
    let originalParent = null;
    let originalStyles = null;
    let adoptedCanvas = null;

    const ensureFluidCanvasVisible = () => {
      const canvas = window.__fluidCursorInstance?.canvas;
      if (!canvas) return;
      if (!adoptedCanvas) {
        adoptedCanvas = canvas;
        originalParent = canvas.parentElement;
        originalStyles = {
          position: canvas.style.position,
          inset: canvas.style.inset,
          width: canvas.style.width,
          height: canvas.style.height,
          zIndex: canvas.style.zIndex,
          pointerEvents: canvas.style.pointerEvents,
          display: canvas.style.display,
          opacity: canvas.style.opacity,
          mixBlendMode: canvas.style.mixBlendMode,
        };
      }
      if (canvas.parentElement !== document.body) {
        document.body.appendChild(canvas);
      }
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.zIndex = '10020';
      canvas.style.pointerEvents = 'none';
      canvas.style.display = 'block';
      canvas.style.opacity = '0.9';
      canvas.style.mixBlendMode = 'normal';
    };

    ensureFluidCanvasVisible();
    const id = window.setInterval(ensureFluidCanvasVisible, 250);
    return () => {
      window.clearInterval(id);
      if (adoptedCanvas && originalStyles) {
        adoptedCanvas.style.position = originalStyles.position;
        adoptedCanvas.style.inset = originalStyles.inset;
        adoptedCanvas.style.width = originalStyles.width;
        adoptedCanvas.style.height = originalStyles.height;
        adoptedCanvas.style.zIndex = originalStyles.zIndex;
        adoptedCanvas.style.pointerEvents = originalStyles.pointerEvents;
        adoptedCanvas.style.display = originalStyles.display;
        adoptedCanvas.style.opacity = originalStyles.opacity;
        adoptedCanvas.style.mixBlendMode = originalStyles.mixBlendMode;
      }
      if (adoptedCanvas && originalParent && adoptedCanvas.parentElement !== originalParent) {
        originalParent.appendChild(adoptedCanvas);
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9998] flex justify-center bg-black pt-[var(--sat,0px)]"
    >
      <div
        className="relative box-border w-full max-w-[400px] bg-black"
        style={{
          height: 'min(calc(100dvh - var(--sat, 0px)), 870px)',
        }}
      >
        {/* image 1 — 400×125 у нижнего края (top 745px в кадре 870px); url в макете пустой */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[125px] bg-transparent"
          aria-hidden
        />

        <div
          className="absolute transition-opacity duration-[1400ms] ease-out"
          style={{
            left: '8.75%',
            right: '8.75%',
            bottom: 'calc(35px + env(safe-area-inset-bottom, 0px))',
            opacity: showContinueButton ? 1 : 0,
            pointerEvents: showContinueButton ? 'auto' : 'none',
          }}
          onClick={showContinueButton ? onContinue : undefined}
        >
          <button
            type="button"
            tabIndex={showContinueButton ? 0 : -1}
            className="box-border flex h-[50px] min-h-[50px] min-w-0 max-w-full items-center justify-center border border-solid border-white outline-none transition-opacity duration-300 ease-out hover:opacity-90 focus:outline-none"
            style={{
              ...involve,
              width: 350,
              maxWidth: '100%',
              borderRadius: 10,
              fontSize: 16,
              lineHeight: '315%',
              color: '#FFFFFF',
              background: 'transparent',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
}
