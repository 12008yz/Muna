'use client';

import Link from 'next/link';

/** 4 круга 2×2 — как на лендинге */
function CirclesFourIcon() {
  const r = 3.438;
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="5" cy="5" r={r} fill="#000000" />
      <circle cx="15" cy="5" r={r} fill="#000000" />
      <circle cx="5" cy="15" r={r} fill="#000000" />
      <circle cx="15" cy="15" r={r} fill="#000000" />
    </svg>
  );
}

function HeaderLogoSvg() {
  return (
    <svg
      width="140"
      height="10"
      viewBox="0 0 140 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MANA"
    >
      <g clipPath="url(#clipManaHeaderLogoBar)">
        <path
          d="M0 9.12458V0.875421H4.97725L9.56529 6.53199L14.1533 0.875421H19.3193V9.12458H15.5922V4.28115L11.6647 9.12458H7.46588L3.72704 4.51684V9.12458H0ZM20.2601 9.12458V0.875421H23.9872V3.58586H32.2197V0.875421H35.9467V9.12458H32.2197V6.41414H23.9872V9.12458H20.2601ZM40.7899 0.757576H49.3998C51.6762 0.757576 53.5279 2.72559 53.5279 5C53.5279 7.27441 51.6762 9.24242 49.3998 9.24242H40.7899C38.5136 9.24242 36.6618 7.27441 36.6618 5C36.6618 2.72559 38.5136 0.757576 40.7899 0.757576ZM48.6332 3.82155H41.5565C40.9078 3.82155 40.3771 4.35185 40.3771 5C40.3771 5.64815 40.9078 6.17845 41.5565 6.17845H48.6332C49.2819 6.17845 49.8126 5.64815 49.8126 5C49.8126 4.35185 49.2819 3.82155 48.6332 3.82155ZM60.6291 3.45623V0.875421H64.3561V3.45623L67.6586 0.875421H72.6358L67.3637 5L72.6358 9.12458H67.6586L64.3561 6.54377V9.12458H60.6291V6.54377L57.3266 9.12458H52.3494L57.6215 5L52.3494 0.875421H57.3266L60.6291 3.45623ZM89.0333 0.875421V9.12458H85.3062V4.41077L77.0737 9.12458H73.3467V0.875421H77.0737V5.58923L85.3062 0.875421H89.0333ZM95.9467 9.12458V3.7037H89.9787V0.875421H105.665V3.7037H99.6738V9.12458H95.9467ZM106.611 9.12458V0.875421H121.944V2.99663H110.338V3.93939H121.944V6.06061H110.338V7.00337H121.944V9.12458H106.611ZM131.2 3.46801L126.612 9.12458H122.413L129.101 0.875421H133.3L139.987 9.12458H135.788L131.2 3.46801Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clipManaHeaderLogoBar">
          <rect width="140" height="10" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function PaperPlaneIcon() {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M17.2042 15.1825C17.0876 15.3218 16.9418 15.4339 16.7771 15.5107C16.6124 15.5875 16.4328 15.6272 16.2511 15.627C16.1082 15.6269 15.9663 15.6026 15.8316 15.5551L9.58546 13.4457C9.52351 13.4248 9.46969 13.385 9.43157 13.3319C9.39345 13.2788 9.37295 13.215 9.37296 13.1496V7.50199C9.37315 7.41631 9.35571 7.33151 9.32175 7.25285C9.28778 7.17419 9.23801 7.10335 9.17551 7.04474C9.11302 6.98613 9.03914 6.94099 8.95846 6.91213C8.87779 6.88327 8.79204 6.87131 8.70655 6.87699C8.54584 6.89116 8.39641 6.96552 8.28819 7.08519C8.17997 7.20485 8.12095 7.36097 8.12296 7.5223V13.1473C8.12296 13.2127 8.10246 13.2764 8.06434 13.3295C8.02622 13.3827 7.9724 13.4225 7.91046 13.4434L1.66436 15.5528C1.42474 15.637 1.16515 15.6462 0.92016 15.5791C0.675174 15.5121 0.456417 15.3721 0.293018 15.1776C0.129619 14.9832 0.0293321 14.7436 0.00551085 14.4907C-0.0183104 14.2378 0.0354645 13.9837 0.159675 13.7621L7.65733 0.637145C7.76607 0.44384 7.92429 0.282948 8.11574 0.17098C8.3072 0.0590119 8.52499 0 8.74679 0C8.96858 0 9.18637 0.0590119 9.37783 0.17098C9.56928 0.282948 9.7275 0.44384 9.83624 0.637145L17.337 13.7598C17.4641 13.9817 17.5196 14.2375 17.4958 14.4922C17.472 14.7468 17.3702 14.9879 17.2042 15.1825Z"
        fill="#101010"
      />
    </svg>
  );
}

/** Круг 40×40 под иконку: белый, обводка, blur — как Rectangle 32 / Group 7510 в макете */
const headerIconCircleClass =
  'flex h-10 w-10 shrink-0 box-border items-center justify-center rounded-full border border-solid border-white/50 bg-white';

export default function LandingHeaderBar({ onConsultationClick, menuHref = '/' }) {
  const menuClassName = `${headerIconCircleClass} transition-opacity hover:opacity-90`;

  return (
    <>
      <div className="absolute z-10 h-10 w-10 cursor-pointer" style={{ left: 'var(--main-block-margin)', top: 'var(--header-top, 50px)' }}>
        {menuHref.startsWith('#') ? (
          <a href={menuHref} className={menuClassName} aria-label="Меню">
            <CirclesFourIcon />
          </a>
        ) : (
          <Link href={menuHref} className={menuClassName} aria-label="Меню">
            <CirclesFourIcon />
          </Link>
        )}
      </div>

      <div
        className="absolute z-10 flex items-center text-white"
        style={{
          left: 'calc(var(--main-block-margin) + 40px + 10px)',
          top: 'calc(var(--header-top, 10px) + 15px)',
          width: 140,
          height: 10,
        }}
      >
        <HeaderLogoSvg />
      </div>

      <div
        className="absolute z-10 h-10 w-10 cursor-pointer"
        style={{ right: 'var(--main-block-margin)', top: 'var(--header-top, 50px)' }}
      >
        <button
          type="button"
          className={`${headerIconCircleClass} transition-opacity hover:opacity-90`}
          aria-label="Связаться"
          onClick={onConsultationClick}
        >
          <PaperPlaneIcon />
        </button>
      </div>
    </>
  );
}
