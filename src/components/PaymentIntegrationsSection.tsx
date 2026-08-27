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
  Sparkles,
  Sliders
} from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';
import { formatFCFA, generateWavePaymentUrl } from '../utils/pricing';
import { WavePaymentModal } from './WavePaymentModal';

export const PaymentIntegrationsSection: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [demoAmount, setDemoAmount] = useState(2500);
  const [isDemoWaveModalOpen, setIsDemoWaveModalOpen] = useState(false);

  const handleCopyLink = () => {
    const url = generateWavePaymentUrl(demoAmount);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
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
              Un processus fluide et transparent : chaque montant est <strong>instancié directement dans le lien Wave</strong> pour empêcher tout paiement inférieur et certifier le tarif exact.
            </p>
          </div>

          {/* 2 Main Action Hubs (Wave & WhatsApp) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
            
            {/* Wave Business Hub */}
            <div className="lg:col-span-7 bg-gradient-to-br from-slate-800 to-slate-850 rounded-3xl border border-sky-500/40 p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              
              {/* Top Wave Bar */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
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
                  Notre passerelle Wave instancie automatiquement le montant exact de votre prestation. Aucun risque d'erreur de saisie ou de sous-paiement.
                </p>

                {/* Amount preview tool */}
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-sky-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-300">
                    <span className="flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-sky-400" />
                      <span>Exemple de montant instancié dans le lien :</span>
                    </span>
                    <span className="font-black text-amber-400 font-mono text-base">
                      {formatFCFA(demoAmount)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {[1000, 2500, 5000, 10000, 25000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setDemoAmount(amt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          demoAmount === amt
                            ? 'bg-sky-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {formatFCFA(amt)}
                      </button>
                    ))}
                  </div>

                  {/* URL Display box */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="truncate text-[11px] font-mono text-sky-300">
                      {generateWavePaymentUrl(demoAmount)}
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex-shrink-0"
                      title="Copier le lien de paiement avec montant instancié"
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
                </div>

                {/* Guarantees list */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span>Montant verrouillé dans Wave pour éviter tout écart de règlement</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span>Validation instantanée de votre paiement par notification Wave & SMS</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    <span>Reçu de transaction officiel édité immédiatement</span>
                  </div>
                </div>
              </div>

              {/* Direct CTA */}
              <div className="pt-6 mt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="wave-section-direct-btn"
                  onClick={() => setIsDemoWaveModalOpen(true)}
                  className="w-full flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Ouvrir Wave avec montant de {formatFCFA(demoAmount)}</span>
                </button>
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
                  Besoin d'envoyer vos manuscrits, photos à retoucher ou textes de CV ? Échangez directement avec notre équipe en temps réel.
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
                <h4 className="font-bold text-sm text-white mb-1">Choix de la Prestation & Fichiers</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sélectionnez vos services, glissez vos fichiers exemplaires et cochez votre créneau d'urgence horaire précis.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative">
                <div className="w-8 h-8 rounded-full bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center mb-3">
                  2
                </div>
                <h4 className="font-bold text-sm text-white mb-1">Paiement Wave Verrouillé</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Réglez via le lien Wave avec le montant exact pré-rempli sans possibilité d'erreur, puis confirmez sur WhatsApp.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center mb-3">
                  3
                </div>
                <h4 className="font-bold text-sm text-white mb-1">Livraison & Révisions</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Recevez vos fichiers haute définition prêts à imprimer ou diffuser, avec révisions incluses jusqu'à satisfaction totale.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Demo Wave Modal */}
      <WavePaymentModal
        isOpen={isDemoWaveModalOpen}
        onClose={() => setIsDemoWaveModalOpen(false)}
        amount={demoAmount}
        serviceTitle="Démonstration Passerelle Sécurisée Wave"
      />
    </>
  );
};
