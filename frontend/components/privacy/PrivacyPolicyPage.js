'use client';

import { dispatchNavigateToOrderLanding } from '@/lib/navigateToOrderLanding';
import { PRIVACY_POLICY_TEXT } from '@/content/privacyPolicyText';

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

export default function PrivacyPolicyPage({ onCollapse, embedded = false }) {
  const handleCollapse = () => {
    dispatchNavigateToOrderLanding();
    if (typeof onCollapse === 'function') {
      onCollapse();
    }
  };

  return (
    <div
      className={`box-border w-full max-w-full bg-background text-[#101010] ${
        embedded ? 'flex h-full min-h-0 flex-col overflow-hidden' : 'min-h-[100dvh]'
      }`}
    >
      {/* Как GroupTraining / модалки: колонна на ширину телефона до 425px, боковые var(--main-block-margin) */}
      <div
        className={`box-border mx-auto w-full min-w-0 max-w-[425px] px-[var(--main-block-margin)] pb-[calc(var(--main-block-margin)+env(safe-area-inset-bottom,0px))] ${
          embedded ? 'flex min-h-0 flex-1 flex-col overflow-hidden pt-[10px]' : ''
        }`}
        style={embedded ? undefined : { paddingTop: 'calc(var(--sat) + 10px)' }}
      >
        <button
          type="button"
          onClick={handleCollapse}
          className="box-border flex h-10 w-10 items-center justify-center rounded-[20px] border border-white/50 bg-white backdrop-blur-[5px] transition-opacity hover:opacity-90"
          aria-label="Свернуть окно"
        >
          <CollapseIcon />
        </button>

        {/* 10px между кнопкой и блоком с политикой */}
        <div className="h-[10px]" aria-hidden />

        <article
          className={`subpixel-antialiased box-border w-full max-w-full rounded-[20px] border-[0.5px] border-solid border-white/50 bg-white backdrop-blur-[12.5px] ${
            embedded ? 'mb-0 flex min-h-0 flex-1 flex-col overflow-hidden' : 'mb-[70px]'
          }`}
          style={{
            boxShadow: '0 0 0 0.5px rgba(255, 255, 255, 0.5)',
          }}
        >
          <div className={`box-border px-[15px] pt-5 ${embedded ? 'flex min-h-0 flex-1 flex-col overflow-hidden' : ''}`}>
            <h1
              className="mb-[15px] text-[18px] font-normal leading-[110%] text-[#101010]"
              style={{
                fontFamily: "'TT Firs Neue', system-ui, sans-serif",
                fontStyle: 'normal',
                fontWeight: 500,
                letterSpacing: 'normal',
                fontSynthesis: 'none',
              }}
            >
              Политика приватности
            </h1>
            <div
              className={`w-full max-w-full whitespace-pre-line font-normal ${
                embedded ? 'scrollbar-hide min-h-0 flex-1 overflow-y-auto pb-6' : 'pb-[245px]'
              }`}
              style={{
                fontFamily: "'TT Firs Neue', system-ui, sans-serif",
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '110%',
                letterSpacing: 'normal',
                color: '#101010',
                fontSynthesis: 'none',
              }}
            >
              {PRIVACY_POLICY_TEXT}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
