'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Редирект со старых маршрутов на главную с якорем секции (единый вертикальный скролл).
 */
export default function RedirectToHomeSection({ hash }) {
  const router = useRouter();

  useEffect(() => {
    const target = hash.startsWith('#') ? hash : `#${hash}`;
    router.replace(`/${target}`);
  }, [hash, router]);

  return <div className="min-h-[100dvh] w-full bg-[#F5F5F5]" aria-hidden />;
}
