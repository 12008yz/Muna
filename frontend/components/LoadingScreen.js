'use client';

import LoadingBrandLogo from '@/components/LoadingBrandLogo';

/**
 * Первый экран: чёрный фон, логотип по центру, полоса прогресса снизу.
 */
export default function LoadingScreen({ progress = 0 }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black"
      style={{
        paddingTop: 'var(--sat, 0px)',
        paddingBottom: 'var(--sab, 0px)',
      }}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-[var(--main-block-margin)]">
        <LoadingBrandLogo className="max-w-[min(152px,85vw)] shrink-0" />
      </div>

      <div
        className="shrink-0 pb-[max(24px,env(safe-area-inset-bottom,0px))]"
        style={{
          width: '280px',
          maxWidth: 'calc(100% - 80px)',
          height: '4px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '2px',
        }}
      >
        <div
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            height: '100%',
            background: '#FFFFFF',
            transition: 'width 0.2s ease-out',
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  );
}
