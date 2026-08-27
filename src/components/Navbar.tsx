import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  MessageSquare, 
  CreditCard, 
  Sparkles, 
  FileText, 
  Layers, 
  PhoneCall, 
  Calculator 
} from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenCalculator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenCalculator }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', href: '#hero' },
    { label: 'Catalogue & Boutique', href: '#catalogue' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Tarifs & Dégressifs', href: '#tarifs' },
    { label: 'Paiement Wave', href: '#paiement-wave' },
    { label: 'Avis Clients', href: '#avis' },
  ];

  return (
    <header 
      id="main-navbar"
      className="fixed top-0 left-0 right-0 z-40 p-3 sm:p-4 transition-all duration-300 pointer-events-none"
    >
      {/* Bento Floating Container */}
      <div className={`max-w-7xl mx-auto pointer-events-auto transition-all duration-300 rounded-2xl sm:rounded-3xl border ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md text-slate-900 shadow-lg shadow-slate-900/5 border-slate-200/80 px-4 sm:px-6 py-2.5' 
          : 'bg-white text-slate-900 shadow-sm border-slate-200/90 px-4 sm:px-6 py-3'
      }`}>
        
        {/* Top Mini status ticker (desktop) */}
        <div className="hidden lg:flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Services Ouverts 24/7 • Abidjan & International</span>
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">⏱️ Traitement express CV & documents en 2h à 24h</span>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href={CONTACT_INFO.whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold transition-colors"
            >
              WhatsApp : {CONTACT_INFO.whatsappNumber}
            </a>
            <span className="text-slate-300">•</span>
            <a 
              href={CONTACT_INFO.wavePaymentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0F52BA] hover:underline font-bold"
            >
              Paiement Sécurisé Wave Business
            </a>
          </div>
        </div>

        {/* Main Bar */}
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <a href="#hero" className="flex items-center space-x-3 group text-left">
            <div className="w-10 h-10 rounded-2xl bg-[#0F52BA] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
              O
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#0F52BA] font-['Outfit']">
                  Okbw <span className="text-[#FF8800]">Bureautique</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Excellence Documentaire & Design Digital
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0F52BA] hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Express Price Calculator CTA */}
            <button
              id="nav-calc-btn"
              onClick={onOpenCalculator}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-sm"
              title="Calculer un tarif dégressif instantané"
            >
              <Calculator className="w-3.5 h-3.5 text-[#FF8800]" />
              <span>Simulateur</span>
            </button>

            {/* Direct Wave Payment Link */}
            <a
              id="nav-wave-link"
              href={CONTACT_INFO.wavePaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#0F52BA] border border-blue-200 transition-all"
              title="Payer directement via Wave Business"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#0F52BA]" />
              <span>Payer Wave</span>
            </a>

            {/* Direct WhatsApp CTA */}
            <a
              id="nav-whatsapp-cta"
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#FF8800] hover:brightness-110 text-white shadow-md shadow-orange-500/25 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Pro</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-md hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-4 h-4 text-[#FF8800]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF8800] text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu & Cart Icon */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              id="mobile-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-slate-900 text-white font-bold"
              aria-label="Panier mobile"
            >
              <ShoppingBag className="w-4 h-4 text-[#FF8800]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF8800] text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-100 space-y-3 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0F52BA]"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCalculator();
                }}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-700"
              >
                <Calculator className="w-3.5 h-3.5 text-[#FF8800]" />
                <span>Simulateur</span>
              </button>

              <a
                href={CONTACT_INFO.wavePaymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-blue-50 text-[#0F52BA] border border-blue-200"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payer Wave</span>
              </a>
            </div>

            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#FF8800] text-white shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Commander sur WhatsApp</span>
            </a>
          </div>
        )}

      </div>
    </header>
  );
};
