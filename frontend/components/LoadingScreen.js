'use client';

import LoadingBrandLogo from '@/components/LoadingBrandLogo';

export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center overflow-hidden bg-black"
      style={{
        paddingTop: 'var(--sat, 0px)',
        paddingBottom: 'var(--sab, 0px)',
      }}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-[var(--main-block-margin)]">
        <div
          data-fluid-cursor-block
          className="loading-logo-blink shrink-0"
          style={{
            width: 'min(152px, 85vw)',
            height: 'calc(min(152px, 85vw) * 32 / 152)',
          }}
        >
          <LoadingBrandLogo className="block h-full w-full max-w-none" />
        </div>
      </div>
    </div>
  );
}
