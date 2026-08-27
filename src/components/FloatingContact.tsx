import React from 'react';
import { MessageSquare, ShoppingBag, CreditCard, TrendingUp } from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';

interface FloatingContactProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdminGuide?: () => void;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ 
  cartCount, 
  onOpenCart,
  onOpenAdminGuide 
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3 pointer-events-none">
      
      {/* Quick Step Guide for Customers */}
      <a
        id="floating-guide-btn"
        href="#guide-client"
        className="pointer-events-auto p-2.5 sm:px-3 sm:py-2 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white shadow-lg border border-blue-400 text-xs font-bold flex items-center space-x-1.5 backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
        title="Comment se déroule votre commande ? Guide pas à pas"
      >
        <span className="text-amber-300 font-black">?</span>
        <span className="hidden sm:inline text-[11px]">Guide Pas à Pas</span>
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

