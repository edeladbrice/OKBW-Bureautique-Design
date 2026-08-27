import React, { useState } from 'react';
import { 
  CreditCard, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  QrCode, 
  Copy, 
  Check, 
  Zap, 
  ArrowRight, 
  PhoneCall, 
  Lock,
  Sparkles
} from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';

export const PaymentIntegrationsSection: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(CONTACT_INFO.wavePaymentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="paiement-wave" className="py-20 bg-slate-900 text-white scroll-mt-16 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Paiement & Commandes 100% Sécurisés</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight text-white">
            Intégration Wave Business & WhatsApp Direct
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Un processus fluide, transparent et instantané. Réglez vos prestations sans friction via notre lien sécurisé Wave et suivez l'avancement sur WhatsApp.
          </p>
        </div>

        {/* 2 Main Action Hubs (Wave & WhatsApp) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Wave Business Hub */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl border border-sky-500/40 p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Wave Bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-sky-500/30">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Passerelle Officielle</span>
                    <h3 className="text-xl font-bold text-white font-['Outfit']">Compte Wave Business Certifié</h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-xs font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>0% Frais Client</span>
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Cliquez sur le lien direct pour effectuer votre règlement via votre application Wave en toute sécurité. Indiquez simplement le montant de votre commande ou devis.
              </p>

              {/* URL Display box */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-700 flex items-center justify-between gap-2">
                <div className="truncate text-xs font-mono text-sky-300">
                  {CONTACT_INFO.wavePaymentUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex-shrink-0"
                  title="Copier le lien de paiement"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>

              {/* Guarantees list */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Validation instantanée de votre paiement par notification Wave</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Compatible avec tous les comptes Wave Côte d'Ivoire & UEMOA</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Reçu de transaction téléchargeable immédiatement</span>
                </div>
              </div>
            </div>

            {/* Direct CTA */}
            <div className="pt-6 mt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center gap-3">
              <a
                id="wave-section-direct-btn"
                href={CONTACT_INFO.wavePaymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Ouvrir la Passerelle Wave Business</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* WhatsApp Direct Hub */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl border border-emerald-500/40 p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-950/40">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Service Client & Commandes</span>
                    <h3 className="text-xl font-bold text-white font-['Outfit']">WhatsApp Business</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Besoin d'envoyer vos manuscrits, photos à retoucher ou textes de CV ? Échangez directement avec le consultant en temps réel.
              </p>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <div className="text-xs text-emerald-300 font-bold">Numéro WhatsApp Officiel :</div>
                <div className="text-xl font-black text-white font-mono tracking-wider">
                  {CONTACT_INFO.whatsappNumber}
                </div>
                <div className="text-[11px] text-slate-400">
                  Disponible 7j/7 pour la réception des fichiers & urgences
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Envoi direct de fichiers Word, PDF, Photos HD</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Validation des maquettes et retours en direct</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-700">
              <a
                id="whatsapp-section-direct-btn"
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Démarrer une discussion WhatsApp</span>
              </a>
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
              <h4 className="font-bold text-sm text-white mb-1">Choix de la Prestation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sélectionnez vos services dans le catalogue ou utilisez le simulateur pour connaître votre tarif dégressif précis.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Paiement Wave & Envoi Fichiers</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Réglez via le lien sécurisé Wave et transmettez vos documents (photos, textes, notes) par WhatsApp ou via le site.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Livraison Haute Définition</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recevez vos fichiers prêts à imprimer / diffuser sous 2h à 24h avec révisions incluses jusqu'à satisfaction totale.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
