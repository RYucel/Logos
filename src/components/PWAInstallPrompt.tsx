import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Check, Share, PlusSquare, ArrowRight } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallPromptProps {
  forceOpen?: boolean;
  onCloseForce?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  forceOpen = false,
  onCloseForce
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check if already in standalone / installed PWA mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check localStorage dismissal
    const dismissedTimestamp = localStorage.getItem('logos_pwa_dismissed');
    if (dismissedTimestamp) {
      const pastTime = Date.now() - parseInt(dismissedTimestamp, 10);
      // If dismissed within the last 24 hours, don't auto-popup unless forced
      if (pastTime < 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      console.log('PWA beforeinstallprompt captured');
    };

    const handleAppInstalled = () => {
      setInstallSuccess(true);
      setDeferredPrompt(null);
      setIsStandalone(true);
      setTimeout(() => {
        setInstallSuccess(false);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
        setInstallSuccess(true);
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIosGuide(true);
    } else {
      // Fallback for browsers that don't emit beforeinstallprompt (e.g. desktop firefox / safari)
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('logos_pwa_dismissed', Date.now().toString());
    if (onCloseForce) onCloseForce();
  };

  // If already running as standalone app, don't show prompt
  if (isStandalone && !forceOpen) {
    return null;
  }

  const shouldShow = forceOpen || (!isDismissed && !isStandalone);

  return (
    <>
      {/* Toast / Banner on initial link open */}
      {shouldShow && !showIosGuide && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="bg-[#002142] text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-[#005ba1]/40 flex flex-col gap-3 relative backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with App Icon */}
            <div className="flex items-start gap-3.5 pr-6">
              <div className="w-13 h-13 rounded-xl overflow-hidden shadow-lg border border-white/20 shrink-0 bg-gradient-to-br from-[#005ba1] to-[#002142] p-0.5">
                <img
                  src="/icons/icon-192x192.png"
                  alt="ΛΟΓΟΣ App Icon"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Android & iOS PWA
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <h4 className="text-base font-bold text-white tracking-tight mt-1">
                  ΛΟΓΟΣ Uygulamasını Yükle
                </h4>
                <p className="text-xs text-blue-100/90 leading-relaxed mt-0.5">
                  Hızlı erişim, çevrimdışı çalışma ve tam ekran pratik deneyimi için ana ekranınıza ekleyin.
                </p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-3 gap-1.5 py-1 text-[11px] text-blue-200/90 font-medium">
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">Çevrimdışı</span>
              </div>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">0 Bekleme</span>
              </div>
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">SM-2 Tekrar</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleInstallClick}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#005ba1] to-[#0080e0] hover:from-[#004e8c] hover:to-[#0070c7] text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] border border-blue-300/30 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Uygulamayı Yükle</span>
              </button>
              <button
                onClick={handleDismiss}
                className="py-2.5 px-3 bg-white/10 hover:bg-white/15 text-blue-100 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Daha Sonra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c22] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#005ba1] to-[#002d5a] p-1 shadow-md">
                  <img
                    src="/icons/icon-192x192.png"
                    alt="ΛΟΓΟΣ Icon"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    Ana Ekrana Ekleme Rehberi
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Safari veya mobil tarayıcınızdan 2 adımda kurun
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowIosGuide(false);
                  if (onCloseForce) onCloseForce();
                }}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-5">
              {/* Step 1 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                <div className="w-8 h-8 rounded-xl bg-[#005ba1] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white text-sm">
                    <span>Paylaş Butonuna Basın</span>
                    <Share className="w-4 h-4 text-[#005ba1]" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                    Safari'nin altındaki veya Chrome menüsündeki <strong className="text-[#005ba1]">Paylaş (Share)</strong> simgesine dokunun.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                <div className="w-8 h-8 rounded-xl bg-[#005ba1] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white text-sm">
                    <span>"Ana Ekrana Ekle"yi Seçin</span>
                    <PlusSquare className="w-4 h-4 text-[#005ba1]" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                    Açılan menüde aşağı kaydırarak <strong className="text-[#005ba1]">"Ana Ekrana Ekle" (Add to Home Screen)</strong> seçeneğine tıklayın.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowIosGuide(false);
                  if (onCloseForce) onCloseForce();
                }}
                className="w-full py-3 bg-[#005ba1] hover:bg-[#004e8c] text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                Anladım, Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {installSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-4">
          <Check className="w-5 h-5 text-white" />
          <span>ΛΟΓΟΣ başarıyla cihazınıza yüklendi!</span>
        </div>
      )}
    </>
  );
};
