'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import PostLoadIntroScreen from '@/components/PostLoadIntroScreen';
import HomePage from '@/components/pages/HomePage';
import CursorFluidEffect from '@/components/common/CursorFluidEffect';

export default function HomeClient() {
  const searchParams = useSearchParams();
  /** Полный текст политики — оверлей по клику на уведомление на лендинге */
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPassedIntro, setHasPassedIntro] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [mainRevealVisible, setMainRevealVisible] = useState(false);
  const isCompleteRef = useRef(false);
  const mainRef = useRef(null);

  useEffect(() => {
    if (searchParams.get('consultation') === '1') {
      isCompleteRef.current = true;
      setLoadingProgress(100);
      setIsLoading(false);
      setHasPassedIntro(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get('consultation') === '1') {
      return;
    }

    const LOADING_MIN_MS = 1500;
    const loadingStartedAt = Date.now();
    let completedSteps = 0;
    const totalSteps = 5;

    const updateProgress = (step) => {
      if (isCompleteRef.current) return;
      completedSteps = Math.max(completedSteps, step);
      const next = Math.min(95, (completedSteps / totalSteps) * 100);
      setLoadingProgress(next);
    };

    const finishLoading = () => {
      if (isCompleteRef.current) return;
      isCompleteRef.current = true;
      setLoadingProgress(100);
      const elapsed = Date.now() - loadingStartedAt;
      const hideDelay = Math.max(0, LOADING_MIN_MS - elapsed);
      setTimeout(() => setIsLoading(false), hideDelay);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => updateProgress(1));
    } else {
      updateProgress(1);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => updateProgress(2)).catch(() => updateProgress(2));
    } else {
      setTimeout(() => updateProgress(2), 200);
    }

    let imagesTracked = false;
    let loadedImagesCount = 0;
    let totalImagesCount = 0;

    const checkMainProgress = () => {
      if (!mainRef.current || isCompleteRef.current) return;

      const hasContent =
        mainRef.current.children.length > 0 || mainRef.current.querySelector('*') !== null;

      if (hasContent && completedSteps < 3) {
        updateProgress(3);
      }

      if (completedSteps >= 3) {
        const images = mainRef.current.querySelectorAll('img');

        if (images.length === 0) {
          if (completedSteps < 5) {
            updateProgress(5);
            finishLoading();
          }
        } else if (!imagesTracked) {
          imagesTracked = true;
          totalImagesCount = images.length;

          const updateImageProgress = () => {
            loadedImagesCount++;
            const imageProgress = 4 + loadedImagesCount / totalImagesCount;
            updateProgress(Math.floor(imageProgress * 10) / 10);

            if (loadedImagesCount === totalImagesCount && !isCompleteRef.current) {
              updateProgress(5);
              finishLoading();
            }
          };

          images.forEach((img) => {
            if (img.complete && img.naturalWidth > 0) {
              loadedImagesCount++;
            }
          });

          if (loadedImagesCount === totalImagesCount) {
            updateProgress(5);
            finishLoading();
          } else {
            images.forEach((img) => {
              if (!img.complete || img.naturalWidth === 0) {
                img.addEventListener('load', updateImageProgress, { once: true });
                img.addEventListener('error', updateImageProgress, { once: true });
              }
            });

            setTimeout(() => {
              if (!isCompleteRef.current && loadedImagesCount < totalImagesCount) {
                updateProgress(5);
                finishLoading();
              }
            }, 5000);
          }
        }
      }
    };

    let intervalId;
    const startDelay = setTimeout(() => {
      intervalId = setInterval(checkMainProgress, 150);
    }, 200);

    const timeout = setTimeout(() => {
      if (!isCompleteRef.current) {
        finishLoading();
      }
    }, 15000);

    return () => {
      clearTimeout(startDelay);
      if (intervalId) clearInterval(intervalId);
      clearTimeout(timeout);
    };
  }, [searchParams]);

  const showAppLoading = searchParams.get('consultation') !== '1' && isLoading;
  const showPostLoadIntro = searchParams.get('consultation') !== '1' && !isLoading && !hasPassedIntro;
  const mainHiddenBehindGate = showAppLoading || showPostLoadIntro;

  useEffect(() => {
    if (mainHiddenBehindGate) {
      setMainRevealVisible(false);
      return;
    }
    const raf = window.requestAnimationFrame(() => setMainRevealVisible(true));
    return () => window.cancelAnimationFrame(raf);
  }, [mainHiddenBehindGate]);

  return (
    <div ref={mainRef}>
      <CursorFluidEffect
        active={showAppLoading || showPostLoadIntro || !mainHiddenBehindGate}
      />
      {showAppLoading && <LoadingScreen progress={loadingProgress} />}
      {showPostLoadIntro && <PostLoadIntroScreen onContinue={() => setHasPassedIntro(true)} />}
      <main
        className="min-h-[100dvh] w-full overflow-x-hidden"
        style={{
          visibility: mainHiddenBehindGate ? 'hidden' : 'visible',
          position: 'relative',
          opacity: mainHiddenBehindGate ? 0 : mainRevealVisible ? 1 : 0,
          transform: 'translateY(0)',
          transition: 'opacity 680ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <HomePage
          privacyPolicyOpen={privacyPolicyOpen}
          onOpenPrivacyPolicy={() => setPrivacyPolicyOpen(true)}
          onPrivacyCollapse={() => setPrivacyPolicyOpen(false)}
          notificationsEnabled={!mainHiddenBehindGate}
        />
      </main>
    </div>
  );
}
