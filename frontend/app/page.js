import { Suspense } from 'react';
import HomeClient from './HomeClient';

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-[9999] bg-black" aria-hidden />
      }
    >
      <HomeClient />
    </Suspense>
  );
}
