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
  ArrowUp
} from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';

export const Footer: React.FC = () => {
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
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0F52BA] to-[#FF8800] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <span className="font-black text-base tracking-tighter text-white font-['Outfit']">
                    OK<span className="text-[#FF8800]">BW</span>
                  </span>
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">
                OKBW <span className="text-[#FF8800] font-medium text-base">Bureautique & Design</span>
              </span>
            </div>

            <p className="text-[#FF8800] font-bold text-sm tracking-wide">
              "L'excellence documentaire, la créativité visuelle."
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Plateforme hybride pour vos services bureautiques, retouches et créations graphiques de prestige, solutions PDF express et développements web sur-mesure.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href={CONTACT_INFO.wavePaymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold hover:bg-sky-500/30 transition-colors flex items-center space-x-1.5"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Paiement Wave Business</span>
              </a>

              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition-colors flex items-center space-x-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp 24/7</span>
              </a>
            </div>
          </div>

          {/* Col 2: Services Bureautique & PDF */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-slate-100 font-['Outfit'] uppercase tracking-wider text-[#FF8800]">
              Bureautique & PDF
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • CV Professionnel + Costume virtuel (1 000 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • CV Standard rapide (500 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • Saisie de mémoires & thèses (dès 200 F/p)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • Lettres de motivation & administratives (500 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • Diaporama PowerPoint de soutenance (2 500 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • Modification & Conversion PDF (dès 100 F)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Design Graphique & Web */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-slate-100 font-['Outfit'] uppercase tracking-wider text-[#FF8800]">
              Design & Digital
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • Création d'Affiches Événements (dès 500 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • Création de Logos Sur-Mesure (3 500 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • Cartes de Visite Prêtes à Imprimer (2 000 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • Restauration & Retouche Photo (dès 250 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • Sites Web Vitrines & E-commerce (dès 35 000 F)
                </a>
              </li>
              <li>
                <a href="#catalogue" className="hover:text-[#FF8800] transition-colors">
                  • Applications Web & PWA Android
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Assistance */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-slate-100 font-['Outfit'] uppercase tracking-wider text-[#FF8800]">
              Contacts Directs
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-200 font-bold">{CONTACT_INFO.whatsappNumber}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#FF8800] flex-shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.location}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.hours}</span>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-4 flex items-center space-x-1.5 text-xs text-slate-400 hover:text-[#FF8800] transition-colors pt-2"
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
            <span className="text-sky-400">Passerelle Wave Business</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
