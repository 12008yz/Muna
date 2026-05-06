'use client';

import { useEffect } from 'react';

const SCRIPT_ID = 'fluid-cursor-local-script';
const SCRIPT_SRC = '/vendor/fluid-cursor.js';
/** Слой в HomePage: под шапкой и скроллом, над page-gradient (визуально только «фон»). */
export const FLUID_CURSOR_MOUNT_ID = 'muna-fluid-cursor-mount';

const applyCanvasStyle = (canvas, visible, lowPower = false, inMount = false) => {
  if (inMount) {
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
  } else {
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '9999';
  }
  canvas.style.pointerEvents = 'none';
  canvas.style.display = visible ? 'block' : 'none';
  canvas.style.opacity = '0.9';
  canvas.style.mixBlendMode = 'normal';
  canvas.style.filter = lowPower ? 'none' : 'blur(0.8px) saturate(1.05)';
};

const hidePackageCanvas = () => {
  const inst = typeof window !== 'undefined' ? window.__fluidCursorInstance : undefined;
  const existingCanvas = inst?.canvas;
  if (existingCanvas) {
    const inMount = !!document.getElementById(FLUID_CURSOR_MOUNT_ID)?.contains(existingCanvas);
    applyCanvasStyle(existingCanvas, false, false, inMount);
  }
};

/**
 * WebGL «жидкий» курсор (скрипт из /public/vendor/fluid-cursor.js).
 * Без кастомной палитры — цвета из встроенного generateColor() при пустой палитре.
 */
/**
 * На узком экране блоки лендинга непрозрачные на всю ширину — канвас «под» контентом не виден.
 * Тогда вешаем на body (как оверлей); на широком — слой #muna-fluid-cursor-mount между фоном и UI.
 */
function shouldUseBodyFluidOverlay() {
  if (typeof window === 'undefined') return true;
  try {
    if (window.matchMedia('(pointer: coarse)').matches) return true;
  } catch (e) {
    /* ignore */
  }
  if (window.innerWidth <= 768) return true;
  if (navigator.maxTouchPoints > 0 && Math.min(window.innerWidth, window.innerHeight) < 900) return true;
  return false;
}

export default function CursorFluidEffect({ active }) {
  useEffect(() => {
    if (!active) {
      hidePackageCanvas();
      return;
    }

    const getScriptPromise = () => {
      if (!window.__fluidCursorScriptPromise) {
        window.__fluidCursorScriptPromise = new Promise((resolve, reject) => {
          let script = document.getElementById(SCRIPT_ID);
          if (!script) {
            script = document.createElement('script');
            script.id = SCRIPT_ID;
            script.src = SCRIPT_SRC;
            script.async = true;
            document.head.appendChild(script);
          }

          if (script.dataset.loaded === 'true') {
            resolve();
            return;
          }

          script.addEventListener(
            'load',
            () => {
              script.dataset.loaded = 'true';
              resolve();
            },
            { once: true }
          );
          script.addEventListener('error', () => reject(new Error('Failed to load fluid cursor script')), {
            once: true,
          });
        });
      }
      return window.__fluidCursorScriptPromise;
    };

    const resolveCtor = () =>
      window.FluidCursor ??
      // eslint-disable-next-line no-new-func
      new Function('return typeof FluidCursor !== "undefined" ? FluidCursor : undefined;')();

    const dpr = window.devicePixelRatio || 1;
    const isMobile =
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 0 && Math.min(window.innerWidth, window.innerHeight) < 900);
    const shortSide = Math.min(window.innerWidth, window.innerHeight);
    const shouldUseLowLatencyProfile = isMobile || dpr > 1.1 || shortSide < 1100;

    const options = {
      SIM_RESOLUTION: isMobile ? 24 : shouldUseLowLatencyProfile ? 36 : 48,
      DYE_RESOLUTION: isMobile ? 192 : shouldUseLowLatencyProfile ? 256 : 384,
      PRESSURE_ITERATIONS: isMobile ? 6 : shouldUseLowLatencyProfile ? 8 : 10,
      SPLAT_FORCE: isMobile ? 2100 : 2400,
      SPLAT_RADIUS: isMobile ? 0.22 : 0.2,
      DENSITY_DISSIPATION: isMobile ? 3.9 : 3.6,
      VELOCITY_DISSIPATION: isMobile ? 2.6 : 2.4,
      COLOR_UPDATE_SPEED: isMobile ? 3.2 : 2.8,
      IDLE_FRAME_SKIP: isMobile ? 1 : 4,
      TRANSPARENT: true,
      SHADING: false,
    };

    let cancelled = false;

    const placeCanvas = () => {
      if (cancelled) return;
      const canvas = window.__fluidCursorInstance?.canvas;
      if (!canvas) return;
      const useOverlay = shouldUseBodyFluidOverlay();
      const mount = document.getElementById(FLUID_CURSOR_MOUNT_ID);
      if (mount && !useOverlay) {
        mount.appendChild(canvas);
        applyCanvasStyle(canvas, true, isMobile, true);
      } else {
        document.body.appendChild(canvas);
        applyCanvasStyle(canvas, true, isMobile, false);
      }
    };

    void getScriptPromise()
      .then(() => {
        if (cancelled) return;
        if (!window.__fluidCursorInstance) {
          const Ctor = resolveCtor();
          if (!Ctor) return;
          window.__fluidCursorInstance = new Ctor(options);
        }
        placeCanvas();
      })
      .catch(() => {});

    window.addEventListener('resize', placeCanvas);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', placeCanvas);
      hidePackageCanvas();
    };
  }, [active]);

  return null;
}
