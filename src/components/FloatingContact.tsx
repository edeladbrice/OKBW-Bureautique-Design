import React from 'react';
import { MessageSquare, ShoppingBag, CreditCard } from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';

interface FloatingContactProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ cartCount, onOpenCart }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3 pointer-events-none">
      
      {/* Floating Cart Button (if items in cart) */}
      {cartCount > 0 && (
        <button
          id="floating-cart-btn"
          onClick={onOpenCart}
          className="pointer-events-auto p-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-xl shadow-amber-500/30 hover:scale-110 active:scale-95 transition-all flex items-center space-x-2 animate-in slide-in-from-bottom duration-300"
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
