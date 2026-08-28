import React, { useState } from 'react';
import { MessageSquare, ShoppingBag, CreditCard, TrendingUp, Bot, Sparkles, X } from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';

interface FloatingContactProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdminGuide?: () => void;
  onOpenGuideBot?: () => void;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ 
  cartCount, 
  onOpenCart,
  onOpenAdminGuide,
  onOpenGuideBot 
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3 pointer-events-none">
      
      {/* Bot Interactive Proactive Speech Bubble */}
      {onOpenGuideBot && showTooltip && (
        <div className="pointer-events-auto relative p-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#0F52BA] dark:border-blue-500 shadow-xl max-w-[250px] text-xs text-slate-800 dark:text-slate-100 animate-bounce mb-1">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] hover:bg-slate-300"
            title="Masquer le message"
          >
            <X className="w-3 h-3" />
          </button>
          <div 
            onClick={onOpenGuideBot}
            className="cursor-pointer space-y-1"
          >
            <div className="flex items-center space-x-1.5 font-extrabold text-[#0F52BA] dark:text-blue-400">
              <Bot className="w-3.5 h-3.5 text-[#FF5E14]" />
              <span>DEMS • Guide Intelligent</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Besoin d'un devis ou d'une commande ? Je vous guide pas à pas !
            </p>
          </div>
          {/* Arrow pointing down-right */}
          <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white dark:bg-slate-900 border-r-2 border-b-2 border-[#0F52BA] dark:border-blue-500 transform rotate-45"></div>
        </div>
      )}

      {/* Floating Smart Guide Bot Button */}
      {onOpenGuideBot && (
        <button
          id="floating-guide-bot-btn"
          onClick={onOpenGuideBot}
          className="pointer-events-auto group relative flex items-center space-x-2 px-3.5 py-3 rounded-full bg-gradient-to-r from-[#0F52BA] to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold shadow-xl shadow-blue-900/30 hover:scale-105 active:scale-95 transition-all border border-blue-400/40"
          title="Ouvrir DEMS (Conseiller et Orchestrateur de commande)"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF5E14] rounded-full border-2 border-white animate-ping"></span>
          </div>
          <span className="text-xs font-black tracking-wide">
            DEMS • Assistant
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 hidden sm:inline" />
        </button>
      )}

      {/* Quick Step Guide Anchor for Customers */}
      <a
        id="floating-guide-btn"
        href="#guide-client"
        className="pointer-events-auto p-2.5 sm:px-3 sm:py-2 rounded-full bg-slate-800/90 hover:bg-slate-800 text-white shadow-lg border border-slate-600 text-xs font-bold flex items-center space-x-1.5 backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
        title="Comment se déroule votre commande ? Guide pas à pas"
      >
        <span className="text-amber-300 font-black">?</span>
        <span className="hidden sm:inline text-[11px]">Étapes de commande</span>
      </a>

      {/* Quick Guide Trigger for Owner */}
      {onOpenAdminGuide && (
        <button
          onClick={onOpenAdminGuide}
          className="pointer-events-auto p-2.5 sm:px-3 sm:py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white shadow-lg border border-slate-700 text-xs font-bold flex items-center space-x-1.5 backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          title="Guide & Suivi des Visites"
        >
          <TrendingUp className="w-4 h-4 text-[#FF5E14]" />
          <span className="hidden sm:inline text-[11px]">Guide Gérant</span>
        </button>
      )}

      {/* Floating Cart Button (if items in cart) */}
      {cartCount > 0 && (
        <button
          id="floating-cart-btn"
          onClick={onOpenCart}
          className="pointer-events-auto p-3.5 rounded-full bg-[#FF5E14] hover:brightness-110 text-white font-black shadow-xl shadow-orange-500/30 hover:scale-110 active:scale-95 transition-all flex items-center space-x-2 animate-in slide-in-from-bottom duration-300"
          aria-label="Voir le panier"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs font-bold">{cartCount} article(s)</span>
        </button>
      )}

      {/* Floating WhatsApp Button */}
      <a
        id="floating-whatsapp-btn"
        href={CONTACT_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group flex items-center space-x-2.5 p-3 sm:px-4 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-2xl shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all"
        aria-label="Contacter Okbw sur WhatsApp"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6 fill-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-emerald-600 animate-ping"></span>
        </div>
        <span className="hidden sm:inline text-xs font-black tracking-wide">
          WhatsApp Direct
        </span>
      </a>

    </div>
  );
};


