'use client';

import Link from 'next/link';
import LoadingBrandLogo from '@/components/LoadingBrandLogo';

/** Простой контур глобуса (Figma Globe) */
function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.85" />
      <path d="M3 12h18" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.75" />
      <path d="M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" stroke="#FFFFFF" strokeWidth="0.9" strokeOpacity="0.55" />
    </svg>
  );
}

function PaperPlaneIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M17.2042 15.1825C17.0876 15.3218 16.9418 15.4339 16.7771 15.5107C16.6124 15.5875 16.4328 15.6272 16.2511 15.627C16.1082 15.6269 15.9663 15.6026 15.8316 15.5551L9.58546 13.4457C9.52351 13.4248 9.46969 13.385 9.43157 13.3319C9.39345 13.2788 9.37295 13.215 9.37296 13.1496V7.50199C9.37315 7.41631 9.35571 7.33151 9.32175 7.25285C9.28778 7.17419 9.23801 7.10335 9.17551 7.04474C9.11302 6.98613 9.03914 6.94099 8.95846 6.91213C8.87779 6.88327 8.79204 6.87131 8.70655 6.87699C8.54584 6.89116 8.39641 6.96552 8.28819 7.08519C8.17997 7.20485 8.12095 7.36097 8.12296 7.5223V13.1473C8.12296 13.2127 8.10246 13.2764 8.06434 13.3295C8.02622 13.3827 7.9724 13.4225 7.91046 13.4434L1.66436 15.5528C1.42474 15.637 1.16515 15.6462 0.92016 15.5791C0.675174 15.5121 0.456417 15.3721 0.293018 15.1776C0.129619 14.9832 0.0293321 14.7436 0.00551085 14.4907C-0.0183104 14.2378 0.0354645 13.9837 0.159675 13.7621L7.65733 0.637145C7.76607 0.44384 7.92429 0.282948 8.11574 0.17098C8.3072 0.0590119 8.52499 0 8.74679 0C8.96858 0 9.18637 0.0590119 9.37783 0.17098C9.56928 0.282948 9.7275 0.44384 9.83624 0.637145L17.337 13.7598C17.4641 13.9817 17.5196 14.2375 17.4958 14.4922C17.472 14.7468 17.3702 14.9879 17.2042 15.1825Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/** Figma Rectangle 32: 40×40, radius 20 */
const circleBtn =
  'flex h-10 w-10 shrink-0 box-border items-center justify-center rounded-[20px] border border-solid border-[rgba(255,255,255,0.1)] bg-[#050505] backdrop-blur-[5px] transition-opacity hover:opacity-90';

export default function ManaMarketingHeader({ onConsultationClick, menuHref = '#section-hero' }) {
  return (
    <>
      <div
        className="absolute z-10 h-10 w-10 cursor-pointer"
        style={{ left: 'var(--main-block-margin)', top: 'var(--header-top, 50px)' }}
      >
        {menuHref.startsWith('#') ? (
          <a href={menuHref} className={circleBtn} aria-label="Главная">
            <GlobeIcon />
          </a>
        ) : (
          <Link href={menuHref} className={circleBtn} aria-label="Главная">
            <GlobeIcon />
          </Link>
        )}
      </div>

      <div
        className="absolute z-10 flex items-center justify-center text-white"
        style={{
          left: 'calc(var(--main-block-margin) + 40px + 10px)',
          top: 'calc(var(--header-top, 10px) + 15px)',
          width: 75,
          height: 10,
        }}
      >
        <LoadingBrandLogo className="block h-8 w-[75px] max-w-none" />
      </div>

      <div
        className="absolute z-10 h-10 w-10 cursor-pointer"
        style={{ right: 'var(--main-block-margin)', top: 'var(--header-top, 50px)' }}
      >
        <button type="button" className={circleBtn} aria-label="Связаться" onClick={onConsultationClick}>
          <PaperPlaneIcon />
        </button>
      </div>
    </>
  );
}
