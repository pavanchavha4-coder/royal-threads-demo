import React, { useEffect, useState } from 'react';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#12634B] via-[#064E3B] to-[#022C22] text-[#FAF8F1] p-8 select-none">

      <div className="pt-8 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D6B875] font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Premium Fashion & VIP Trial Studio</span>
      </div>

      <div className="flex flex-col items-center text-center space-y-4 max-w-sm">

        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-[#D6B875] flex items-center justify-center bg-[#022C22] shadow-[0_0_35px_rgba(214,184,117,0.35)]">
            <Crown className="w-12 h-12 text-[#D6B875]" />
          </div>
          <div className="absolute -inset-2 rounded-full border border-[#D6B875]/40 border-dashed animate-spin [animation-duration:18s]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-[0.12em] text-[#FAF8F1] font-brand">
            ROYAL THREADS
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-[#D6B875] font-medium">
            Style That Defines Royalty
          </p>
        </div>

        <p className="text-xs text-[#FAF8F1]/75 max-w-xs leading-relaxed pt-2">
          Discover premium fashion, elegant collections and exclusive in-store trial experiences.
        </p>
      </div>

      <div className="w-full max-w-xs flex flex-col items-center space-y-4 pb-6">

        <div className="w-full bg-[#022C22] h-1.5 rounded-full overflow-hidden border border-[#D6B875]/30">
          <div
            className="bg-gradient-to-r from-[#A88743] via-[#F1E2B8] to-[#D6B875] h-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-center space-y-1 pt-2">
          <div className="text-[11px] text-[#FAF8F1]/60 tracking-wider">
            Developed & Branded by
          </div>
          <div className="text-sm font-bold tracking-widest text-[#D6B875]">
            NEXORA TECHNOLOGIES
          </div>
          <div className="text-[10px] text-[#FAF8F1]/70 italic tracking-wider">
            Ideas to Impact
          </div>
        </div>

        <button
          onClick={onFinish}
          className="text-xs text-[#FAF8F1]/60 hover:text-[#D6B875] flex items-center gap-1 transition-colors pt-1"
        >
          <span>Tap to enter boutique</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
