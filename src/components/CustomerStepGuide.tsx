import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  UploadCloud, 
  MessageSquare, 
  CreditCard, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Zap, 
  HelpCircle,
  ChevronRight,
  Download,
  Check
} from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';

interface CustomerStepGuideProps {
  onExploreCatalog: () => void;
  onOpenCalculator: () => void;
  onOpenGuideBot?: () => void;
}

export const CustomerStepGuide: React.FC<CustomerStepGuideProps> = ({
  onExploreCatalog,
  onOpenCalculator,
  onOpenGuideBot
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      stepNumber: "01",
      badge: "Étape 1",
      title: "Choisissez ou configurez votre prestation",
      shortDesc: "Parcourez notre catalogue complet ou simulez votre devis exact en direct.",
      details: [
        "Sélectionnez vos services : CV Canadien/Design, Saisie & Mise en page, Logo, Flyer, Vectorisation...",
        "Simulateur de prix interactif pour estimer le coût selon le nombre de pages ou d'exemplaires.",
        "Tarifs transparents dès 500 FCFA avec remises automatiques sur le volume."
      ],
      icon: FileText,
      accentColor: "from-blue-600 to-indigo-600",
      pillColor: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      ctaText: "Explorer le Catalogue",
      ctaAction: onExploreCatalog,
      previewTitle: "Sélection instantanée",
      previewBadge: "Étape 1/4",
      previewSnippet: {
        service: "CV Moderne Canadien ATS",
        quantity: "1 document complet",
        price: "500 FCFA",
        note: "Remise appliquée pour étudiants & chercheurs d'emploi"
      }
    },
    {
      stepNumber: "02",
      badge: "Étape 2",
      title: "Renseignez vos coordonnées & vos consignes",
      shortDesc: "Indiquez votre nom, la quantité/pages souhaitée et vos instructions spécifiques.",
      details: [
        "Formulaire simple et rapide : saisissez votre nom et vos consignes particulières.",
        "Sélectionnez le délai souhaité : Moins de 2h (Ultra Express), Moins de 12h (Journée), ou 24-48h (Standard).",
        "Aucun téléchargement complexe : vos fichiers seront directement transmis dans la discussion WhatsApp."
      ],
      icon: UploadCloud,
      accentColor: "from-amber-500 to-orange-600",
      pillColor: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      ctaText: "Ouvrir le Simulateur",
      ctaAction: onOpenCalculator,
      previewTitle: "Commande & Délais enregistrés",
      previewBadge: "Étape 2/4",
      previewSnippet: {
        fileAttached: "📎 Fichiers joints en direct sur WhatsApp",
        turnaround: "⚡ Express Journée (< 12 Heures)",
        instructions: "Consignes : Thème sobre Bleu & Orange, mise en avant de mon expérience de 3 ans."
      }
    },
    {
      stepNumber: "03",
      badge: "Étape 3",
      title: "Validez en 1 Clic sur WhatsApp",
      shortDesc: "Redirection instantanée vers WhatsApp avec un message pré-rempli et structuré.",
      details: [
        "Un récapitulatif clair (Service, Quantité, Nom, Instructions, Montant estimé) est prêt à être envoyé.",
        "Joignez directement vos photos, scans ou documents Word/PDF dans notre discussion.",
        "Échanges en direct avec un opérateur dédié pour démarrer immédiatement votre travail."
      ],
      icon: MessageSquare,
      accentColor: "from-emerald-600 to-teal-600",
      pillColor: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      ctaText: "Contacter sur WhatsApp",
      ctaLink: CONTACT_INFO.whatsappUrl,
      previewTitle: "Message WhatsApp Pré-rempli",
      previewBadge: "Étape 3/4",
      previewSnippet: {
        whatsappMsg: "Bonjour OKBW Bureautique & Design !\nJe souhaite passer une commande :\n- Service : CV Moderne Canadien ATS\n- Quantité / Pages : 1 document\n- Nom du client : M. Jean-Marc\n- Montant estimé : 500 F CFA\nJe vais vous joindre les fichiers à traiter directement ici dans notre discussion. Merci !",
        operatorStatus: "🟢 Opérateur Okbw en ligne • Réponse en moins de 15 minutes"
      }
    },
    {
      stepNumber: "04",
      badge: "Étape 4",
      title: "Réglez à la Livraison & Recevez vos livrables finaux",
      shortDesc: "Validation sur aperçu, lien Wave transmis à la livraison et réception immédiate des fichiers HD.",
      details: [
        "Réception d'un aperçu sécurisé de votre document sur WhatsApp pour validation avant tout paiement.",
        "L'équipe OKBW vous transmet le lien de paiement officiel Wave / Mobile Money directement dans la discussion.",
        "Livraison instantanée de vos fichiers en Haute Résolution (PDF prêt à imprimer + fichiers modifiables Word, PSD, AI) avec retouches incluses."
      ],
      icon: ShieldCheck,
      accentColor: "from-sky-600 to-blue-700",
      pillColor: "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
      ctaText: "Découvrir la garantie livraison",
      ctaLink: "#paiement-wave",
      previewTitle: "Paiement à la Livraison & Fichiers HD",
      previewBadge: "Étape 4/4",
      previewSnippet: {
        wavePayment: "🔒 Lien de paiement sécurisé envoyé par OKBW après validation de l'aperçu",
        delivery: "📦 Livrables : CV_Final_HD.pdf + CV_Modifiable.docx",
        guarantee: "✅ Retouches gratuites sous 48h incluses"
      }
    }
  ];

  return (
    <section 
      id="guide-client"
      className="py-14 sm:py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-colors duration-300"
    >
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0F52BA_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] dark:opacity-[0.07] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-extrabold text-[#0F52BA] dark:text-blue-400">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8800]" />
            <span>Guide Visuel Pas à Pas</span>
            <span className="opacity-40">•</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">Simple, Rapide & Garanti</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
            Comment se déroule votre <span className="text-[#0F52BA] dark:text-blue-400">commande</span> ?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            De la sélection de votre prestation à la réception de vos documents finaux : un processus 100% transparent et guidé en 4 étapes simples.
          </p>

          {onOpenGuideBot && (
            <div className="pt-2">
              <button
                onClick={onOpenGuideBot}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0F52BA] via-blue-600 to-[#FF5E14] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all"
              >
                <span>🤖</span>
                <span>Lancer le Guide Intelligent Interactif</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          )}
        </div>

        {/* Interactive Step Navigator Pills (Desktop & Tablet) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={idx}
                id={`guide-step-tab-${idx}`}
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-slate-800/90 border-[#0F52BA] dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                    isSelected 
                      ? 'bg-[#0F52BA] text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {step.stepNumber}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#0F52BA] dark:text-blue-400' : 'text-slate-400'}`} />
                </div>
                <p className={`text-xs sm:text-sm font-bold line-clamp-1 ${
                  isSelected ? 'text-[#0F52BA] dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {step.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detailed Spotlight of Selected Step */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 lg:p-10 shadow-sm transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Step Details & Explanations (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${steps[activeStep].pillColor}`}>
                    {steps[activeStep].badge}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Étape {activeStep + 1} sur 4
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">
                  {steps[activeStep].title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                  {steps[activeStep].shortDesc}
                </p>
              </div>

              {/* Checklist Points */}
              <div className="space-y-3 pt-2">
                {steps[activeStep].details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Step Action & Navigation */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                {steps[activeStep].ctaLink ? (
                  <a
                    href={steps[activeStep].ctaLink}
                    target={steps[activeStep].ctaLink.startsWith('http') ? '_blank' : undefined}
                    rel={steps[activeStep].ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0F52BA] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    <span>{steps[activeStep].ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    onClick={steps[activeStep].ctaAction}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#0F52BA] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    <span>{steps[activeStep].ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {activeStep < steps.length - 1 ? (
                  <button
                    onClick={() => setActiveStep(prev => prev + 1)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 font-bold text-xs sm:text-sm transition-colors"
                  >
                    <span>Étape suivante</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveStep(0)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 font-bold text-xs sm:text-sm transition-colors"
                  >
                    <span>Revoir depuis le début</span>
                  </button>
                )}
              </div>

            </div>

            {/* Right: Realistic Interactive Preview Mockup (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-lg space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      {steps[activeStep].previewTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                    {steps[activeStep].previewBadge}
                  </span>
                </div>

                {/* Conditional Mockup Contents based on Step */}
                {activeStep === 0 && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-blue-50/70 dark:bg-slate-800/80 rounded-xl border border-blue-100 dark:border-slate-700 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">CV Moderne Canadien ATS</p>
                        <p className="text-[11px] text-slate-500">1 document complet avec mise en page</p>
                      </div>
                      <span className="font-black text-[#0F52BA] dark:text-blue-400 text-sm">500 F</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 space-y-1">
                      <p className="font-semibold text-[11px] text-slate-800 dark:text-slate-200">✨ Avantages inclus :</p>
                      <p>• Tarif fixe sans mauvaise surprise</p>
                      <p>• Remises automatiques pour plusieurs documents</p>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-amber-50/70 dark:bg-slate-800/80 rounded-xl border border-amber-200/80 dark:border-slate-700 space-y-1.5">
                      <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-amber-600" />
                        Fichier exemplaire joint :
                      </p>
                      <p className="text-[11px] font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-amber-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                        📄 mon_ancien_cv.pdf (460.4 Ko)
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      <p className="font-bold text-slate-800 dark:text-white">⏱️ Délai sélectionné :</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        ⚡ Express Journée (Moins de 12 heures ouvrées)
                      </p>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-emerald-50/90 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                      <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        Aperçu du message WhatsApp généré :
                      </p>
                      <p className="text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-emerald-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 italic">
                        "Bonjour Okbw ! Commande : 1x CV Standard (500 F). Fichier : mon_cv.pdf. Délai : &lt;12h. Merci !"
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold text-center">
                      🟢 Prise en charge humaine en moins de 15 minutes
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-sky-50/80 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-900/60 space-y-1.5">
                      <p className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Aperçu & Lien Wave à la livraison :
                      </p>
                      <p className="text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-sky-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        Aperçu validé sur WhatsApp ➡️ Lien Wave officiel reçu ➡️ Déblocage des fichiers HD.
                      </p>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                      <p className="font-bold text-slate-800 dark:text-white flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-emerald-500" />
                        Livraison finale garantie :
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        PDF Haute Définition + Fichier Word modifiable + Retouches offertes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer security tag */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Satisfaction 100% Garantie</span>
                  </span>
                  <span>Assistance 7j/7</span>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* 4 Bottom Micro-Cards summarizing guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0F52BA] dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">Tarifs Sans Surprise</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Calcul transparent dès 500 F</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">Fichiers Tous Formats</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Word, PDF, photos, manuscrits</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">Validation WhatsApp</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Prise en charge en 15 minutes</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">Paiement à la Livraison</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Règlement à la fin du travail & Retouches incluses</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
