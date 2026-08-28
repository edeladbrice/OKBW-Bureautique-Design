import React from 'react';
import { 
  CreditCard, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Palette, 
  Layers, 
  CheckCircle2,
  ArrowUp,
  TrendingUp
} from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';
import { OkbwLogo } from './OkbwLogo';

interface FooterProps {
  onOpenAdminGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminGuide }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <OkbwLogo size="sm" variant="emblem" />
              <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">
                OKBW <span className="text-[#FF5E14] font-medium text-base">Bureautique & Design</span>
              </span>
            </div>

            <p className="text-[#FF5E14] font-bold text-sm tracking-wide">
              "L'excellence documentaire, la créativité visuelle."
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Plateforme hybride pour vos services bureautiques, retouches et créations graphiques de prestige, solutions PDF express et développements web sur-mesure.
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5 items-center">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition-colors flex items-center space-x-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp ({CONTACT_INFO.whatsappNumber})</span>
              </a>

              {onOpenAdminGuide && (
                <button
                  onClick={onOpenAdminGuide}
                  className="px-3 py-2 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-400/30 text-xs font-bold hover:bg-orange-500/30 transition-colors flex items-center space-x-1.5"
                  title="Accéder au guide gérant & suivi"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#FF5E14]" />
                  <span>Espace Gérant & Visites</span>
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Services Bureautique & Actes */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-slate-100 font-['Outfit'] uppercase tracking-wider text-[#FF5E14]">
              Bureautique & Actes 🇨🇮
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#catalogue" className="hover:text-[#FF5E14] transition-colors font-semibold text-orange-200">
                  • Certificat de Nationalité Ivoirienne (3 500 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF5E14] transition-colors font-semibold text-orange-200">
                  • Casier Judiciaire Bulletin N°3 (3 500 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF5E14] transition-colors">
                  • CV Professionnel + Costume virtuel (1 000 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF5E14] transition-colors">
                  • Saisie de mémoires & thèses (dès 200 F/p)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF5E14] transition-colors">
                  • Modification & Conversion PDF (dès 100 F)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Design Graphique & Web */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-slate-100 font-['Outfit'] uppercase tracking-wider text-[#FF5E14]">
              Design & Digital
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#catalogue" className="hover:text-[#FF5E14] transition-colors">
                  • Création d'Affiches Événements (dès 500 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF5E14] transition-colors">
                  • Création de Logos Sur-Mesure (3 500 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF5E14] transition-colors">
                  • Cartes de Visite Prêtes à Imprimer (2 000 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF5E14] transition-colors">
                  • Restauration & Retouche Photo (dès 250 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF5E14] transition-colors">
                  • Sites Web Vitrines & E-commerce (dès 35 000 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF5E14] transition-colors">
                  • Applications Web & PWA Android
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Assistance */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-slate-100 font-['Outfit'] uppercase tracking-wider text-[#FF5E14]">
              Contacts Directs
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-bold block">{CONTACT_INFO.whatsappNumber}</span>
                  <span className="text-[10px] text-slate-400 block">{CONTACT_INFO.secondaryPhone || '+225 01 40 01 88 31'}</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#FF5E14] flex-shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.location}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.hours}</span>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-4 flex items-center space-x-1.5 text-xs text-slate-400 hover:text-[#FF5E14] transition-colors pt-2"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Haut de page</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Okbw Bureautique et Design. Tous droits réservés.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Qualité & Confidentialité Certifiées</span>
            </span>
            <span>•</span>
            <span className="text-emerald-400">Commandes & Fichiers via WhatsApp</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

