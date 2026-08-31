import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck, 
  QrCode, 
  FileText, 
  Scale, 
  ShoppingBag, 
  X, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { formatFCFA, WAVE_PAYMENT_URL } from '../utils/pricing';

export interface SmartGuidanceContext {
  currentActionName?: string;
  cartCount: number;
  cartTotal: number;
  hasAdministrative?: boolean;
}

interface SmartSiteGuidanceBarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenCalculator: () => void;
  onOpenWaveQr: (amount?: number, title?: string) => void;
  onOpenPdfTools: () => void;
  onOpenAdminSimulator: () => void;
  onOpenGuideBot: (topic?: string) => void;
  onExploreCatalog: () => void;
}

export const SmartSiteGuidanceBar: React.FC<SmartSiteGuidanceBarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenCalculator,
  onOpenWaveQr,
  onOpenPdfTools,
  onOpenAdminSimulator,
  onOpenGuideBot,
  onExploreCatalog
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  if (isDismissed) return null;

  return (
    <aside aria-label="Assistant intelligent OKBW" className="sticky top-16 sm:top-20 z-30 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-y border-blue-500/30 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Smart Assistant Badge & Message */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF5E14] to-amber-500 flex items-center justify-center text-white shadow-md flex-shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 text-[11px] font-extrabold text-[#FF8800] uppercase tracking-wider">
                <span>🤖 Assistant Interactif de Commande</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-semibold lowercase">guide en temps réel</span>
              </div>
              <p className="text-xs text-slate-200 truncate sm:whitespace-normal">
                {cartCount > 0 ? (
                  <span>
                    Vous avez <strong className="text-amber-300 font-black">{cartCount} prestation(s)</strong> dans votre panier ({formatFCFA(cartTotal)}). ➔ <em>Validez sur WhatsApp pour transmettre vos fichiers, puis réglez via le lien officiel Wave.</em>
                  </span>
                ) : (
                  <span>
                    <strong>Comment ça marche ?</strong> Cliquez sur un service ➔ Transmettez vos fichiers sur WhatsApp ➔ Validez l'aperçu ➔ Réglez en 1 clic via le lien Wave sécurisé.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Interactive Steps Mini Bar & Quick CTAs */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap gap-y-1.5">
            
            {/* Quick Step Indicators */}
            <div className="hidden xl:flex items-center space-x-1 text-[11px] font-bold bg-white/10 px-2.5 py-1 rounded-xl border border-white/10">
              <span className="text-blue-300">1. Choix</span>
              <span className="text-slate-400">➔</span>
              <span className="text-emerald-300">2. WhatsApp (Envoi fichiers)</span>
              <span className="text-slate-400">➔</span>
              <span className="text-amber-300">3. Aperçu HD</span>
              <span className="text-slate-400">➔</span>
              <span className="text-sky-300">4. Paiement Wave</span>
            </div>

            {/* Quick Action Button based on state */}
            {cartCount > 0 ? (
              <button
                type="button"
                onClick={onOpenCart}
                className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md flex items-center space-x-1.5 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Ouvrir Mon Panier ({cartCount})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onExploreCatalog}
                className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
              >
                <span>Explorer les Prestations</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}

            {/* Wave QR Quick Launcher */}
            <button
              type="button"
              onClick={() => onOpenWaveQr(500, 'Prestation OKBW')}
              className="py-1.5 px-2.5 rounded-xl bg-sky-600/80 hover:bg-sky-500 text-white text-xs font-bold flex items-center space-x-1 transition-all"
              title="Afficher le lien direct de paiement Wave Business"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lien Wave</span>
            </button>

            {/* Bot Dialog Launcher */}
            <button
              type="button"
              onClick={() => onOpenGuideBot()}
              className="py-1.5 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center space-x-1 transition-all"
              title="Conseils interactifs DEMS"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Conseil Bot</span>
            </button>

            {/* Dismiss bar */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Réduire le guide"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </aside>
  );
};

interface SmartStepWalkthroughProps {
  currentStep?: number; // 1 to 4
  isAdministrative?: boolean;
  serviceTitle?: string;
  amount?: number;
}

export const SmartStepWalkthrough: React.FC<SmartStepWalkthroughProps> = ({
  currentStep = 1,
  isAdministrative = false,
  serviceTitle,
  amount
}) => {
  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 text-white space-y-3.5 shadow-md">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-black">
            🤖
          </div>
          <span className="text-xs font-black text-white font-['Outfit'] uppercase tracking-wider">
            Assistant de Commande Intelligent : Les 4 Étapes
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold">
          Étape {currentStep} sur 4
        </span>
      </div>

      {/* 4-Step Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
        
        {/* Step 1 */}
        <div className={`p-3 rounded-xl border transition-all ${
          currentStep === 1 
            ? 'bg-blue-900/60 border-blue-400 shadow-sm ring-1 ring-blue-400' 
            : currentStep > 1 
            ? 'bg-slate-800/80 border-emerald-500/40 text-slate-300' 
            : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              currentStep > 1 
                ? 'bg-emerald-500 text-white' 
                : currentStep === 1 
                ? 'bg-blue-500 text-white' 
                : 'bg-slate-700 text-slate-300'
            }`}>
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="text-[10px] font-extrabold uppercase text-blue-300">
              {currentStep === 1 ? 'En cours' : 'Choix'}
            </span>
          </div>
          <div className="text-xs font-bold text-white mb-0.5">1. Configuration</div>
          <p className="text-[10px] text-slate-300 leading-snug">
            Quantité, délai et consignes sur mesure.
          </p>
        </div>

        {/* Step 2 */}
        <div className={`p-3 rounded-xl border transition-all ${
          currentStep === 2 
            ? 'bg-emerald-900/60 border-emerald-400 shadow-sm ring-1 ring-emerald-400' 
            : currentStep > 2 
            ? 'bg-slate-800/80 border-emerald-500/40 text-slate-300' 
            : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              currentStep > 2 
                ? 'bg-emerald-500 text-white' 
                : currentStep === 2 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-700 text-slate-300'
            }`}>
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className="text-[10px] font-extrabold uppercase text-emerald-300">WhatsApp</span>
          </div>
          <div className="text-xs font-bold text-white mb-0.5">2. Envoi Fichiers</div>
          <p className="text-[10px] text-slate-300 leading-snug">
            Discussion WhatsApp au <strong>+225 01 41 75 24 03</strong> avec vos photos/documents.
          </p>
        </div>

        {/* Step 3 */}
        <div className={`p-3 rounded-xl border transition-all ${
          currentStep === 3 
            ? 'bg-amber-900/60 border-amber-400 shadow-sm ring-1 ring-amber-400' 
            : currentStep > 3 
            ? 'bg-slate-800/80 border-emerald-500/40 text-slate-300' 
            : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              currentStep > 3 
                ? 'bg-emerald-500 text-white' 
                : currentStep === 3 
                ? 'bg-amber-500 text-slate-950' 
                : 'bg-slate-700 text-slate-300'
            }`}>
              {currentStep > 3 ? '✓' : '3'}
            </span>
            <span className="text-[10px] font-extrabold uppercase text-amber-300">
              {isAdministrative ? 'Greffe' : 'Aperçu'}
            </span>
          </div>
          <div className="text-xs font-bold text-white mb-0.5">
            {isAdministrative ? '3. Traitement Légal' : '3. Validation HD'}
          </div>
          <p className="text-[10px] text-slate-300 leading-snug">
            {isAdministrative 
              ? 'Dépôt greffe & reçu officiel immédiat.' 
              : 'OKBW vous transmet un aperçu pour validation.'}
          </p>
        </div>

        {/* Step 4 */}
        <div className={`p-3 rounded-xl border transition-all ${
          currentStep === 4 
            ? 'bg-sky-900/60 border-sky-400 shadow-sm ring-1 ring-sky-400' 
            : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              currentStep === 4 ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              4
            </span>
            <span className="text-[10px] font-extrabold uppercase text-sky-300">Wave 1-Clic</span>
          </div>
          <div className="text-xs font-bold text-white mb-0.5">4. Règlement Wave</div>
          <p className="text-[10px] text-slate-300 leading-snug">
            Lien officiel sécurisé <em>pay.wave.com/m/...</em> (zéro numéro personnel).
          </p>
        </div>

      </div>

      {/* Clarification Callout */}
      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-[11px] text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong className="text-emerald-400">WhatsApp Business (+225 01 41 75 24 03)</strong> sert à échanger et envoyer vos fichiers. Le règlement s'effectue uniquement via le lien sécurisé <strong className="text-sky-400">Wave Business</strong>.
          </span>
        </div>

        <a
          href={WAVE_PAYMENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:text-sky-300 font-bold underline inline-flex items-center space-x-1 whitespace-nowrap text-[10px]"
        >
          <span>Lien Wave Officiel</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>

    </div>
  );
};
