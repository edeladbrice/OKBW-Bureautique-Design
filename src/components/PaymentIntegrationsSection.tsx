import React from 'react';
import { 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  Lock,
  Sparkles,
  SendHorizontal,
  FileText,
  Clock,
  Check
} from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';
import { DISPLAY_CONTACTS, SECONDARY_CONTACT_NUMBER } from '../utils/pricing';

export const PaymentIntegrationsSection: React.FC = () => {
  return (
    <section id="paiement-wave" className="py-20 bg-slate-900 text-white scroll-mt-16 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0F52BA]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Processus Transparent & Sécurisé</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight text-white">
            Commande sur WhatsApp & Règlement à la Livraison
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Passez votre commande en toute tranquillité. Vous joignez vos fichiers directement dans la conversation WhatsApp et vous réglez uniquement une fois le travail achevé et validé.
          </p>
        </div>

        {/* 2 Main Action Hubs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Main WhatsApp Direct Hub */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-950/40">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Canal Officiel Direct</span>
                    <h3 className="text-xl font-bold text-white font-['Outfit']">WhatsApp Business OKBW</h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-xs font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Réponse en &lt; 5 min</span>
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Envoyez vos documents (Word, PDF, scans, photos, brouillons) directement dans la discussion WhatsApp pré-remplie avec le détail exact de votre prestation.
              </p>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-1">
                  <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                    Numéro Principal (Redirection)
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    {CONTACT_INFO.whatsappNumber}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Commandes & Envoi de fichiers 24/7
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-700 space-y-1">
                  <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                    Second Contact
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    {CONTACT_INFO.secondaryPhone || SECONDARY_CONTACT_NUMBER}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Assistance & suivi des livraisons
                  </div>
                </div>
              </div>

              {/* Guarantees list */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Génération automatique du message avec tarif exact calculé</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Échange direct pour ajuster polices, couleurs et retouches</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Aperçu du travail avant tout déblocage de paiement</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-6 mt-6 border-t border-slate-700">
              <a
                id="whatsapp-section-direct-btn"
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ouvrir WhatsApp pour commander (+225 01 41 75 24 03)</span>
              </a>
            </div>

          </div>

          {/* Delivery Payment Safe Guarantee */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl border border-[#0F52BA]/40 p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0F52BA] flex items-center justify-center text-white font-black shadow-lg shadow-blue-950/40">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Garantie Sérénité</span>
                  <h3 className="text-xl font-bold text-white font-['Outfit']">Paiement à la Livraison</h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Le paiement ne s'effectue pas sur le site web. Vous ne payez rien à l'avance !
              </p>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-blue-500/30 space-y-2.5">
                <div className="text-xs text-blue-300 font-bold flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Déroulement du paiement :</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  À la fin de la réalisation de votre document, notre équipe vous envoie un <strong>aperçu sécurisé</strong> ainsi que le <strong>lien de paiement Wave / Mobile Money officiel</strong> dans votre conversation WhatsApp pour débloquer votre livraison HD finale.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Aucun risque d'arnaque ou de mauvaise prestation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Révisions et corrections incluses jusqu'à satisfaction</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Montant exact garanti sans frais cachés</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-700">
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-center text-xs text-blue-200 font-semibold">
                🔒 Zéro paiement sur le site • Règlement 100% sécurisé via WhatsApp
              </div>
            </div>

          </div>

        </div>

        {/* 3-Step Process Flow */}
        <div className="bg-slate-950/60 rounded-3xl border border-slate-800 p-8">
          <h3 className="text-center text-xl font-bold font-['Outfit'] mb-8 text-white">
            Comment se déroule votre commande en 3 étapes simples :
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Choix & Validation WhatsApp</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sélectionnez vos services sur le site, cliquez sur <em>Valider sur WhatsApp</em> et joignez vos fichiers/instructions dans la discussion.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Réalisation & Aperçu</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Notre équipe réalise votre travail dans les délais choisis et vous transmet une prévisualisation pour validation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Paiement & Livraison Finale</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vous recevez votre lien de paiement Wave à la fin du travail et recevez instantanément vos fichiers haute définition prêts à l'emploi.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

