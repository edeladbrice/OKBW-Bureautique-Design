import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  MessageSquare, 
  CreditCard, 
  Sun,
  Moon,
  HelpCircle,
  Calculator,
  TrendingUp
} from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';
import { OkbwLogo } from './OkbwLogo';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenCalculator: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenAdminGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onOpenCart, 
  onOpenCalculator,
  theme = 'light',
  onToggleTheme,
  onOpenAdminGuide
}) => {
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
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-slate-100 shadow-xl shadow-slate-900/5 dark:shadow-black/40 border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-2.5' 
          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm border-slate-200/90 dark:border-slate-800 px-4 sm:px-6 py-3'
      }`}>
        
        {/* Top Mini status ticker (desktop) */}
        <div className="hidden lg:flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Services Ouverts 24/7 • Abidjan & International</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-300">⏱️ Traitement express CV & documents en 2h à 24h</span>
          </div>
          <div className="flex items-center space-x-4">
            {onOpenAdminGuide && (
              <button
                onClick={onOpenAdminGuide}
                className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF5E14] border border-orange-200 dark:border-orange-900/50 font-bold hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-colors"
                title="Comment fonctionne le site & suivre les visites"
              >
                <TrendingUp className="w-3 h-3" />
                <span>Guide Gérant & Visites</span>
              </button>
            )}
            <a 
              href={CONTACT_INFO.whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold transition-colors"
            >
              WhatsApp : {CONTACT_INFO.whatsappNumber}
            </a>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a 
              href={CONTACT_INFO.wavePaymentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#0F52BA] dark:text-sky-400 hover:underline font-bold"
            >
              Paiement Sécurisé Wave Business
            </a>
          </div>
        </div>

        {/* Main Bar */}
        <div className="flex items-center justify-between">
          
          {/* Official Logo & Brand Name */}
          <a href="#hero" className="flex items-center space-x-3 group text-left">
            <OkbwLogo size="sm" variant="emblem" className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#0A2540] dark:text-white font-['Outfit']">
                  Okbw <span className="text-[#FF5E14]">Bureautique</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
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
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0F52BA] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center space-x-2">
            
            {/* Dark Mode Toggle */}
            {onToggleTheme && (
              <button
                id="nav-theme-toggle"
                onClick={onToggleTheme}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center justify-center"
                title={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
                aria-label="Changer de thème"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>
            )}

            {/* Express Price Calculator CTA */}
            <button
              id="nav-calc-btn"
              onClick={onOpenCalculator}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
              title="Calculer un tarif dégressif instantané"
            >
              <Calculator className="w-3.5 h-3.5 text-[#FF5E14]" />
              <span>Simulateur</span>
            </button>

            {/* Direct Wave Payment Link */}
            <a
              id="nav-wave-link"
              href={CONTACT_INFO.wavePaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#0F52BA] dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-all"
              title="Payer directement via Wave Business"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payer Wave</span>
            </a>

            {/* Direct WhatsApp CTA */}
            <a
              id="nav-whatsapp-cta"
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-[#FF5E14] hover:brightness-110 text-white shadow-md shadow-orange-500/25 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              id="nav-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold transition-all shadow-md hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Voir le panier"
            >
              <ShoppingBag className="w-4 h-4 text-[#FF5E14]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF5E14] text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu & Quick Controls */}
          <div className="flex sm:hidden items-center space-x-2">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                aria-label="Thème sombre/clair"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            <button
              id="mobile-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold"
              aria-label="Panier mobile"
            >
              <ShoppingBag className="w-4 h-4 text-[#FF5E14]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF5E14] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#0F52BA]"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {onOpenAdminGuide && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminGuide();
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-xs font-bold bg-orange-50 dark:bg-orange-950/40 text-[#FF5E14] border border-orange-200 dark:border-orange-900/50"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Guide Gérant & Suivi des Visites</span>
              </button>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCalculator();
                }}
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <Calculator className="w-3.5 h-3.5 text-[#FF5E14]" />
                <span>Simulateur</span>
              </button>

              <a
                href={CONTACT_INFO.wavePaymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0F52BA] dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payer Wave</span>
              </a>
            </div>

            <a
              href={CONTACT_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#FF5E14] text-white shadow-md"
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

