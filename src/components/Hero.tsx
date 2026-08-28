import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Palette, 
  Zap, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  MessageSquare,
  CheckCircle2,
  Layers,
  ChevronDown,
  Globe,
  FileCheck2,
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';
import { OkbwLogo } from './OkbwLogo';

interface HeroProps {
  onOpenCalculator: () => void;
  onExploreServices: () => void;
  onOpenAdminGuide?: () => void;
  onOpenGuideBot?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onOpenCalculator, 
  onExploreServices,
  onOpenAdminGuide,
  onOpenGuideBot
}) => {
  return (
    <section 
      id="hero" 
      className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 bg-[#F4F7F9] dark:bg-[#0B1320] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Bento Grid Hub */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          
          {/* Bento Cell 1: Main Brand Hero (Span 7 cols) */}
          <div className="md:col-span-12 lg:col-span-7 bg-[#0F52BA] dark:bg-[#0A3275] rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between shadow-xl text-white min-h-[380px]">
            
            {/* Ambient Bento Orbs */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-20 -mt-20 pointer-events-none blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF5E14]/30 rounded-full -ml-16 -mb-16 pointer-events-none blur-xl"></div>

            <div className="relative z-10 space-y-4">
              
              {/* Badge & Official Logo header */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-orange-200">
                  <span className="w-2 h-2 rounded-full bg-[#FF5E14] animate-ping"></span>
                  <span>Consultant Informatique & Bureautique</span>
                  <span className="opacity-60">•</span>
                  <span className="text-white">Abidjan & UEMOA</span>
                </div>

                <a
                  href="#catalogue"
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FF5E14] hover:bg-[#e04f0f] text-white text-[11px] font-black shadow-md transition-all animate-pulse"
                >
                  <span>🇨🇮</span>
                  <span>Nationalité & Casier en ligne : 3 500 FCFA</span>
                </a>

                {onOpenAdminGuide && (
                  <button
                    onClick={onOpenAdminGuide}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-bold text-orange-300 transition-colors"
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>Mode Gérant & Visites</span>
                  </button>
                )}
              </div>

              {/* Slogan */}
              <div className="flex items-center space-x-4 pt-1">
                <div className="hidden sm:block">
                  <OkbwLogo size="lg" variant="emblem" className="filter drop-shadow-md" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] leading-[1.15] tracking-tight">
                    L'excellence documentaire,<br/>
                    <span className="text-[#FF8800]">la créativité visuelle.</span>
                  </h1>
                </div>
              </div>

              <p className="text-blue-100 dark:text-blue-200 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
                Votre partenaire de confiance pour vos <strong className="text-white font-semibold">CVs & mémoires haute fidélité</strong>, créations graphiques percutantes, retouches photo et solutions web sur-mesure.
              </p>
            </div>

            {/* CTAs & Guarantees */}
            <div className="relative z-10 pt-6 space-y-4">
              <div className="flex flex-wrap gap-3">
                <button
                  id="hero-bento-catalog-btn"
                  onClick={onExploreServices}
                  className="bg-[#FF8800] hover:brightness-110 text-white px-6 sm:px-7 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/30 transition-all flex items-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Voir le Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onOpenGuideBot ? (
                  <button
                    id="hero-bento-bot-btn"
                    onClick={onOpenGuideBot}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-5 sm:px-6 py-3 rounded-2xl font-extrabold text-sm backdrop-blur-sm transition-all flex items-center space-x-2"
                  >
                    <span className="text-amber-300 font-black">🤖</span>
                    <span>Guide Intelligent</span>
                  </button>
                ) : null}

                <button
                  id="hero-bento-calc-btn"
                  onClick={onOpenCalculator}
                  className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-5 sm:px-6 py-3 rounded-2xl font-bold text-sm backdrop-blur-sm transition-all flex items-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-[#FF8800]" />
                  <span>Simulateur Prix</span>
                </button>

                <a
                  id="hero-bento-guide-btn"
                  href="#guide-client"
                  className="bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/20 px-4 sm:px-5 py-3 rounded-2xl font-bold text-sm backdrop-blur-sm transition-all flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-orange-300" />
                  <span>Guide Pas à Pas</span>
                </a>
              </div>

              <div className="flex items-center space-x-4 text-[11px] text-blue-200 pt-2 border-t border-white/15">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8800]" />
                  <span>Livraison 2h à 24h</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8800]" />
                  <span>Paiement Sécurisé Wave</span>
                </span>
              </div>
            </div>

          </div>

          {/* Bento Cell 2: Pôle Design (Span 5 cols) */}
          <div className="md:col-span-12 lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🎨</span>
                  <h2 className="font-bold text-lg sm:text-xl text-[#0F52BA] dark:text-blue-400 font-['Outfit']">Pôle Design & Image</h2>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF8800] bg-orange-50 dark:bg-orange-950/50 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-900/60">
                  Populaire
                </span>
              </div>

              <div className="space-y-3">
                {/* Item 1 */}
                <div 
                  onClick={onExploreServices}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/60 rounded-xl flex items-center justify-center text-[#FF8800] font-bold text-sm">
                      L
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-[#0F52BA] dark:group-hover:text-blue-400">Logo Sur-Mesure</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">2 variantes + Fichiers HD vectoriels</p>
                    </div>
                  </div>
                  <p className="font-black text-[#0F52BA] dark:text-blue-400 text-sm font-['Outfit']">3 500 F</p>
                </div>

                {/* Item 2 */}
                <div 
                  onClick={onExploreServices}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/60 rounded-xl flex items-center justify-center text-[#FF8800] font-bold text-sm">
                      A
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-[#0F52BA] dark:group-hover:text-blue-400">Affiche Pub / Événement</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Packs dès 1 000 F / affiche</p>
                    </div>
                  </div>
                  <p className="font-black text-[#0F52BA] dark:text-blue-400 text-sm font-['Outfit']">2 500 F</p>
                </div>

                {/* Item 3 */}
                <div 
                  onClick={onExploreServices}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-orange-50/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/60 rounded-xl flex items-center justify-center text-[#FF8800] font-bold text-sm">
                      C
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-[#0F52BA] dark:group-hover:text-blue-400">Carte de Visite</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Prêt pour impression haute résolution</p>
                    </div>
                  </div>
                  <p className="font-black text-[#0F52BA] dark:text-blue-400 text-sm font-['Outfit']">2 000 F</p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Retouche photo dès 250 F</span>
              <a 
                href="#portfolio" 
                className="text-[#0F52BA] dark:text-blue-400 font-bold hover:underline flex items-center space-x-1"
              >
                <span>Galerie</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

          </div>

          {/* Bento Cell 3: Bureautique & Documents (Span 4 cols) */}
          <div className="md:col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl">📄</span>
                <h2 className="font-bold text-lg sm:text-xl text-[#0F52BA] dark:text-blue-400 font-['Outfit']">Bureautique</h2>
              </div>

              <div className="space-y-2.5">
                <div 
                  onClick={onExploreServices}
                  className="p-3.5 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl hover:border-[#FF8800] transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-[#FF8800]">CV Professionnel</p>
                    <p className="text-[#0F52BA] dark:text-blue-400 font-black text-sm font-['Outfit']">1 000 F</p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Design + Costume virtuel + Fond studio</p>
                </div>

                <div 
                  onClick={onExploreServices}
                  className="p-3.5 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl hover:border-[#FF8800] transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-[#FF8800]">Saisie & Mémoires</p>
                    <p className="text-[#0F52BA] dark:text-blue-400 font-black text-sm font-['Outfit']">250 F/p</p>
                  </div>
                  <p className="text-[11px] text-[#FF8800] font-bold">Promo : 200 F / page dès 50 pages</p>
                </div>

                <div 
                  onClick={onExploreServices}
                  className="p-3.5 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl hover:border-[#FF8800] transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-[#FF8800]">Lettre Motivation</p>
                    <p className="text-[#0F52BA] dark:text-blue-400 font-black text-sm font-['Outfit']">500 F</p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Style formel, accrocheur et convaincant</p>
                </div>

                <div 
                  onClick={onExploreServices}
                  className="p-3.5 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl hover:border-[#FF8800] transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-[#FF8800]">PowerPoint Soutenance</p>
                    <p className="text-[#0F52BA] dark:text-blue-400 font-black text-sm font-['Outfit']">2 500 F</p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Jusqu'à 15 diapositives percutantes</p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onExploreServices}
                className="w-full py-2 rounded-xl text-xs font-bold text-[#0F52BA] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                Explorer toute la Bureautique →
              </button>
            </div>
          </div>

          {/* Bento Cell 4: Solutions PDF (Span 5 cols) */}
          <div className="md:col-span-12 lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">⚙️</span>
                  <h2 className="font-bold text-lg sm:text-xl text-[#0F52BA] dark:text-blue-400 font-['Outfit']">Solutions PDF</h2>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Dégressif
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl">
                  <p className="text-[10px] uppercase font-extrabold text-[#0F52BA] dark:text-blue-400 mb-1">Modification</p>
                  <p className="text-2xl font-black text-[#0F52BA] dark:text-blue-400 font-['Outfit']">
                    500 F<span className="text-xs font-normal text-slate-500 dark:text-slate-400">/p</span>
                  </p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-2">Dès 150 F/p au volume. Texte, dates & images.</p>
                </div>

                <div className="p-4 bg-orange-50/70 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 rounded-2xl">
                  <p className="text-[10px] uppercase font-extrabold text-[#FF8800] mb-1">Conversion</p>
                  <p className="text-2xl font-black text-[#FF8800] font-['Outfit']">
                    250 F
                  </p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-2">Dès 100 F/u. PDF vers Word/Excel éditable.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/80 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Numérisation & Archivage PDF :</span>
                  <span className="font-bold text-slate-900 dark:text-white">100 F / page</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Correction & Relecture :</span>
                  <span className="font-bold text-slate-900 dark:text-white">500 F / page</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic text-center">
                Tarifs dégressifs appliqués automatiquement sur votre volume
              </p>
            </div>
          </div>

          {/* Bento Cell 5: Projets Web & Informatique (Span 3 cols) */}
          <div className="md:col-span-12 lg:col-span-3 bg-[#FF8800] rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col text-white justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl">🚀</span>
                <h2 className="font-bold text-lg sm:text-xl font-['Outfit']">Projets Web</h2>
              </div>

              <div className="space-y-3 mb-6">
                <div className="border-l-4 border-white/40 pl-3 py-0.5">
                  <p className="text-xs font-bold text-orange-100">Site Vitrine Pro</p>
                  <p className="text-lg font-black font-['Outfit']">35 000 F</p>
                </div>
                <div className="border-l-4 border-white/40 pl-3 py-0.5">
                  <p className="text-xs font-bold text-orange-100">Boutique E-commerce</p>
                  <p className="text-lg font-black font-['Outfit']">75 000 F</p>
                </div>
                <div className="border-l-4 border-white/40 pl-3 py-0.5">
                  <p className="text-xs font-bold text-orange-100">Application Android PWA</p>
                  <p className="text-lg font-black font-['Outfit']">60 000 F</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <a 
                href={`https://wa.me/2250141752403?text=${encodeURIComponent("Bonjour OKBW Bureautique & Design !\nJe souhaite échanger à propos d'un projet Web (Site vitrine / Boutique / Application).")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0F52BA] hover:brightness-110 w-full py-3 rounded-2xl flex items-center justify-center space-x-2 font-bold text-xs shadow-md transition-all text-white"
              >
                <MessageSquare className="w-3.5 h-3.5 text-white" />
                <span>Discuter du projet sur WhatsApp</span>
              </a>
              <div className="text-[10px] text-center opacity-80 italic">
                Réponse instantanée & devis sur mesure
              </div>
            </div>
          </div>

          {/* Bento Cell 6: Portfolio Preview Bar (Span 12 cols) */}
          <div className="md:col-span-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Galerie de Réalisations & Projets Récents
                </h2>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Découvrez nos chartes graphiques, logos, CVs exécutifs et plateformes développées.
                </p>
              </div>
              <a 
                href="#portfolio" 
                className="text-[#0F52BA] dark:text-blue-400 text-xs font-bold hover:underline flex items-center space-x-1 whitespace-nowrap"
              >
                <span>Voir Tout le Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <a 
                href="#portfolio"
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 flex items-center space-x-3 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-[#FF8800] font-black text-xs flex items-center justify-center">
                  LOGO
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0F52BA] dark:group-hover:text-blue-400">Branding & Logos</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Vectoriels HD</div>
                </div>
              </a>

              <a 
                href="#portfolio"
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 flex items-center space-x-3 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-[#0F52BA] dark:text-blue-400 font-black text-xs flex items-center justify-center">
                  WEB
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0F52BA] dark:group-hover:text-blue-400">Sites & E-commerce</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Responsive</div>
                </div>
              </a>

              <a 
                href="#portfolio"
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 flex items-center space-x-3 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0F52BA]/10 dark:bg-blue-950/50 text-[#0F52BA] dark:text-blue-400 font-black text-xs flex items-center justify-center">
                  POSTER
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0F52BA] dark:group-hover:text-blue-400">Affiches Pubs</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Événements</div>
                </div>
              </a>

              <a 
                href="#portfolio"
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 flex items-center space-x-3 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FF8800]/10 dark:bg-orange-950/50 text-[#FF8800] font-black text-xs flex items-center justify-center">
                  CV
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0F52BA] dark:group-hover:text-blue-400">CVs Direction</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Costume studio</div>
                </div>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};


