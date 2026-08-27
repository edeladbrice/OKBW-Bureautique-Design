import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare,
  Sparkles,
  AlertCircle,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CONTACT_INFO } from '../data/servicesData';
import { formatFCFA, generateWavePaymentUrl } from '../utils/pricing';

interface WavePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  serviceTitle?: string;
  orderReference?: string;
  customerName?: string;
  customerPhone?: string;
}

export const WavePaymentModal: React.FC<WavePaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  serviceTitle = "Prestation Okbw Bureautique & Design",
  orderReference,
  customerName,
  customerPhone
}) => {
  if (!isOpen) return null;

  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const reference = orderReference || `OKBW-${Math.floor(100000 + Math.random() * 900000)}`;
  const waveUrlWithAmount = generateWavePaymentUrl(amount, reference);

  const handleCopy = (text: string, type: 'ref' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'ref') {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleOpenWave = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    window.open(waveUrlWithAmount, '_blank');
  };

  const handleWhatsAppNotify = () => {
    const message = `👋 *Bonjour Okbw !*\n\n` +
      `Je viens d'initier mon règlement Wave pour ma commande :\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `🏷️ *Prestation* : ${serviceTitle}\n` +
      `💰 *Montant exact verrouillé* : ${formatFCFA(amount)}\n` +
      `🔖 *Référence de commande* : ${reference}\n` +
      (customerName ? `👤 *Nom* : ${customerName}\n` : '') +
      (customerPhone ? `📱 *Téléphone* : ${customerPhone}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔗 *Lien Wave utilisé* : ${waveUrlWithAmount}\n\n` +
      `Pouvez-vous confirmer la réception du paiement et le démarrage de mon document ?`;

    window.open(`https://wa.me/2250501088608?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Wave Branded */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-blue-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-sky-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4 text-sky-300" />
            <span>Paiement Sécurisé Wave Business</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] pr-6">
            Règlement Immédiat
          </h3>
          <p className="text-xs text-sky-100 mt-1">
            {serviceTitle}
          </p>

          {/* Locked Amount Badge */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-sky-200 font-semibold block">
                Montant Instancié & Verrouillé :
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300 font-['Outfit']">
                {formatFCFA(amount)}
              </span>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold uppercase">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>0% de frais</span>
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Anti-fraud / Exact amount security explanation */}
          <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex items-start space-x-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
            <div className="text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-sky-950 dark:text-sky-200">
                Garantie Anti-Erreur & Montant Instancié
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                Le montant exact de <strong>{formatFCFA(amount)}</strong> est directement injecté dans le lien de paiement officiel pour garantir le tarif sans risque d'erreur.
              </p>
            </div>
          </div>

          {/* Transaction Reference & Merchant Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Référence Transaction</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{reference}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(reference, 'ref')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRef ? 'Copié' : 'Copier'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Compte Marchand Wave</span>
                <span className="font-bold text-slate-900 dark:text-white">OKBW BUREAUTIQUE (+225 05 01 08 86 08)</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('0501088608', 'phone')}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPhone ? 'Copié' : 'Copier numéro'}</span>
              </button>
            </div>
          </div>

          {/* Action Button 1: Direct Wave Pay */}
          <div className="space-y-2.5 pt-2">
            <button
              id="wave-modal-pay-direct-btn"
              onClick={handleOpenWave}
              className="w-full py-4 px-5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center space-x-2.5"
            >
              <CreditCard className="w-5 h-5" />
              <span>Ouvrir Wave & Payer {formatFCFA(amount)}</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </button>

            {/* Action Button 2: WhatsApp Confirmation */}
            <button
              id="wave-modal-whatsapp-confirm-btn"
              onClick={handleWhatsAppNotify}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>J'ai payé — Confirmer sur WhatsApp</span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-slate-400">
              Dès réception du paiement, nos infographistes et rédacteurs prennent en charge votre commande en priorité.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
