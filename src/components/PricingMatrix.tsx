import React from 'react';
import { 
  Percent, 
  ArrowRight, 
  Check, 
  Sparkles, 
  CreditCard, 
  MessageSquare, 
  Zap, 
  FileText, 
  Globe,
  HelpCircle
} from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';

interface PricingMatrixProps {
  onOpenCalculator: () => void;
}

export const PricingMatrix: React.FC<PricingMatrixProps> = ({ onOpenCalculator }) => {
  return (
    <section id="tarifs" className="py-20 bg-[#F4F7F9] dark:bg-[#0B1320] border-b border-slate-200 dark:border-slate-800 scroll-mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-[#FF5E14] border border-orange-200 dark:border-orange-900/60 text-xs font-bold uppercase tracking-wider">
            <Percent className="w-3.5 h-3.5" />
            <span>Grilles Tarifaires & Remises au Volume</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight text-slate-900 dark:text-white">
            Transparence Totale des Prix & Économies Dégressives
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Plus vous commandez, plus vous économisez ! Profitez de nos tarifs dégressifs automatiques sur tous vos travaux récurrents et volumineux.
          </p>
        </div>

        {/* Volume Discount Tables Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Card 1: Solutions PDF & Saisies */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 bg-[#0F52BA] text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-[#FF5E14]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-['Outfit']">Solutions PDF & Saisies Bureautiques</h3>
                  <p className="text-xs text-blue-100">Paliers automatiques selon le nombre de pages</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FF5E14] text-white text-xs font-extrabold shadow-sm">
                Jusqu'à -80%
              </span>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Item A: Saisie */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Saisie de documents & Mémoires</span>
                  <span className="text-[#0F52BA] dark:text-blue-400">Dès 200 F / page</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between">
                    <span className="text-slate-600 dark:text-slate-300">1 à 50 pages :</span>
                    <span className="font-black text-slate-900 dark:text-white">250 F / page</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex justify-between text-emerald-900 dark:text-emerald-300 font-bold">
                    <span>+50 pages (Promo) :</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">200 F / page</span>
                  </div>
                </div>
              </div>

              {/* Item B: Modification PDF */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Modification de Document PDF (Texte/Image)</span>
                  <span className="text-[#0F52BA] dark:text-blue-400">Dès 150 F / page</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">1 à 4 pages</span>
                    <span className="font-bold text-slate-900 dark:text-white">500 F/p</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
                    <span className="text-blue-600 dark:text-blue-300 block text-[11px]">5 à 9 pages</span>
                    <span className="font-bold text-[#0F52BA] dark:text-blue-400">250 F/p</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-emerald-900 dark:text-emerald-300 font-bold">
                    <span className="block text-[11px]">10 à 20+ p.</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">150 F/p</span>
                  </div>
                </div>
              </div>

              {/* Item C: Conversion + Correction */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Conversion + Correction & Mise au propre</span>
                  <span className="text-[#0F52BA] dark:text-blue-400">Dès 100 F / unité</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">1u</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">500 F</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">5-10u</span>
                    <span className="font-bold text-blue-700 dark:text-blue-300">250 F</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">20u</span>
                    <span className="font-bold text-blue-800 dark:text-blue-300">200 F</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">30u</span>
                    <span className="font-bold text-[#0F52BA] dark:text-blue-400">150 F</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 font-bold text-emerald-900 dark:text-emerald-300">
                    <span className="text-[10px] block">40-50u</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">100 F</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={onOpenCalculator}
                className="text-xs font-bold text-[#0F52BA] dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 flex items-center justify-center space-x-1.5 mx-auto"
              >
                <Zap className="w-3.5 h-3.5 text-[#FF5E14]" />
                <span>Tester vos volumes dans le simulateur de prix</span>
              </button>
            </div>
          </div>

          {/* Card 2: Packs Design & Image */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 bg-[#FF5E14] text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-['Outfit']">Packs Design, Affiches & Photos</h3>
                  <p className="text-xs text-orange-100">Des tarifs avantageux pour créateurs & événements</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-950 text-[#FF5E14] text-xs font-extrabold shadow-sm">
                Packs Événements
              </span>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Item A: Affiches */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Création d'Affiches (Pub / Événement)</span>
                  <span className="text-[#FF5E14] font-black">Dès 500 F / affiche</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">1 unité</span>
                    <span className="font-bold text-slate-900 dark:text-white">2 500 F</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-center font-bold text-orange-950 dark:text-orange-300">
                    <span className="block text-[11px]">Pack 3 affiches</span>
                    <span className="font-black text-[#FF5E14]">1 000 F / u</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center font-bold text-emerald-900 dark:text-emerald-300">
                    <span className="block text-[11px]">Pack 10+ affiches</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">500 F / u</span>
                  </div>
                </div>
              </div>

              {/* Item B: Retouche & Restauration Photo */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Retouche & Restauration Photo</span>
                  <span className="text-[#FF5E14] font-black">Dès 250 F / photo</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <span className="text-slate-600 dark:text-slate-300 font-medium block">Pack Découverte</span>
                      <span className="text-[11px] text-slate-400">Jusqu'à 5 photos</span>
                    </div>
                    <span className="font-black text-slate-900 dark:text-white">1 500 F total</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex justify-between items-center text-emerald-900 dark:text-emerald-300 font-bold">
                    <div>
                      <span className="block">Pack Volume</span>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-normal">À partir de 10 photos</span>
                    </div>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">250 F / unité</span>
                  </div>
                </div>
              </div>

              {/* Item C: CVs & Logos Highlights */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                  <span className="text-[#0F52BA] dark:text-blue-400 font-bold block">CV Pro + Costume</span>
                  <span className="text-lg font-black text-blue-950 dark:text-blue-200 font-['Outfit']">1 000 F</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Détourage studio & costume virtuel</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/60">
                  <span className="text-orange-900 dark:text-orange-300 font-bold block">Création de Logo</span>
                  <span className="text-lg font-black text-orange-950 dark:text-orange-200 font-['Outfit']">3 500 F</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">2 variantes + Fichiers HD</span>
                </div>
              </div>

            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-center">
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center justify-center space-x-1.5 mx-auto"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Demander un devis spécial événement sur WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Section 2: Tableau des Prestations Informatiques & Création de Sites Web */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          <div className="p-6 sm:p-8 bg-[#0F52BA] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-orange-200 uppercase tracking-wider">
                <Globe className="w-4 h-4 text-[#FF5E14]" />
                <span>Développement Digital & Solutions Informatiques</span>
              </div>
              <h3 className="text-2xl font-black font-['Outfit']">
                Pôle Sites Web, E-commerce & Applications Mobiles
              </h3>
            </div>

            <a
              href={`https://wa.me/2250501088608?text=${encodeURIComponent('Bonjour Okbw ! Je souhaite discuter d\'un projet de site web ou d\'application informatique.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-[#FF5E14] hover:brightness-110 text-white font-black text-xs shadow-md shadow-orange-500/20 transition-all whitespace-nowrap"
            >
              Échanger avec le consultant
            </a>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Service / Formule</th>
                  <th className="py-4 px-6">Tarif Unitaire</th>
                  <th className="py-4 px-6">Ce que cela inclut</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                
                {/* Row 1 */}
                <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-5 px-6 font-bold text-slate-900 dark:text-white">
                    <div className="font-['Outfit'] text-base text-[#0F52BA] dark:text-blue-400">Site Web Vitrine</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">Landing Page / One-Page moderne</div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="font-black text-slate-900 dark:text-white text-base font-['Outfit']">35 000 F à 50 000 F</span>
                  </td>
                  <td className="py-5 px-6 text-slate-600 dark:text-slate-300 max-w-md">
                    Site responsive 1 page (style Wix/HTML), intégration boutons WhatsApp & Wave, formulaire de contact, SEO de base pour Google.
                  </td>
                  <td className="py-5 px-6 text-right">
                    <a
                      href={`https://wa.me/2250501088608?text=${encodeURIComponent('Bonjour Okbw ! Je souhaite commander la création d\'un Site Web Vitrine (35 000 F - 50 000 F).')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm"
                    >
                      <span>Commander</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors bg-blue-50/30 dark:bg-blue-950/20">
                  <td className="py-5 px-6 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center space-x-2">
                      <span className="font-['Outfit'] text-base text-[#0F52BA] dark:text-blue-400">Site Web Multi-pages</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0F52BA] text-white">Populaire</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">Entreprise / Boutique E-commerce</div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="font-black text-[#0F52BA] dark:text-blue-400 text-base font-['Outfit']">75 000 F à 150 000 F</span>
                  </td>
                  <td className="py-5 px-6 text-slate-600 dark:text-slate-300 max-w-md">
                    Jusqu'à 5 pages, boutique en ligne, gestion du catalogue produit, réservation en ligne, paiements Wave / Mobile Money intégrés.
                  </td>
                  <td className="py-5 px-6 text-right">
                    <a
                      href={`https://wa.me/2250501088608?text=${encodeURIComponent('Bonjour Okbw ! Je souhaite commander un Site Web Multi-pages / E-commerce (75 000 F - 150 000 F).')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-[#0F52BA] hover:brightness-110 text-white font-bold text-xs shadow-sm"
                    >
                      <span>Commander</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-5 px-6 font-bold text-slate-900 dark:text-white">
                    <div className="font-['Outfit'] text-base text-[#0F52BA] dark:text-blue-400">Application Mobile Web</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">PWA / WebView Android</div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="font-black text-slate-900 dark:text-white text-base font-['Outfit']">60 000 F à 100 000 F</span>
                  </td>
                  <td className="py-5 px-6 text-slate-600 dark:text-slate-300 max-w-md">
                    Application Android légère basée sur le site web, installable sur téléphone, icône d'accès rapide direct, chargement ultra-rapide.
                  </td>
                  <td className="py-5 px-6 text-right">
                    <a
                      href={`https://wa.me/2250501088608?text=${encodeURIComponent('Bonjour Okbw ! Je souhaite commander une Application Mobile PWA (60 000 F - 100 000 F).')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm"
                    >
                      <span>Commander</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-5 px-6 font-bold text-slate-900 dark:text-white">
                    <div className="font-['Outfit'] text-base text-[#0F52BA] dark:text-blue-400">Application Sur-Mesure</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">Projet complexe & Logiciel métier</div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="font-black text-[#FF5E14] text-base font-['Outfit']">Sur Devis (Dès 150 000 F)</span>
                  </td>
                  <td className="py-5 px-6 text-slate-600 dark:text-slate-300 max-w-md">
                    Fonctionnalités spécifiques, base de données personnalisée, automatisation de tâches ou outils internes pour entreprises.
                  </td>
                  <td className="py-5 px-6 text-right">
                    <a
                      href={`https://wa.me/2250501088608?text=${encodeURIComponent('Bonjour Okbw ! J\'ai un projet informatique sur-mesure et je souhaite obtenir une étude / devis.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-[#FF5E14] font-bold text-xs shadow-sm"
                    >
                      <span>Sur Devis</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>

      </div>
    </section>
  );
};
