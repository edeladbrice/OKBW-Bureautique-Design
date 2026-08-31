import React, { useState } from 'react';
import { 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  Download, 
  QrCode, 
  ExternalLink, 
  Package, 
  Clock, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';
import { StoredOrderRecord, formatFCFA, getWavePaymentUrl, PRIMARY_WHATSAPP_NUMBER } from '../utils/pricing';
import { downloadProformaPDF } from '../utils/pdfInvoiceGenerator';

interface InstantOrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: StoredOrderRecord | null;
  onOpenWaveQr?: (amount: number, title: string, ref: string) => void;
  onOpenOrderTracker?: (ref?: string) => void;
}

export const InstantOrderSuccessModal: React.FC<InstantOrderSuccessModalProps> = ({
  isOpen,
  onClose,
  order,
  onOpenWaveQr,
  onOpenOrderTracker
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handleCopySummary = () => {
    const summary = `*COMMANDE OKBW BUREAUTIQUE & DESIGN*\n\n` +
      `📌 *Référence :* ${order.orderReference}\n` +
      `📅 *Date :* ${order.date}\n` +
      `👤 *Client :* ${order.customerName || 'Client'}\n` +
      (order.customerPhone ? `📞 *Téléphone :* ${order.customerPhone}\n` : '') +
      `📦 *Prestation :* ${order.serviceName}\n` +
      `📊 *Quantité :* ${order.quantityText}\n` +
      `💰 *Montant Total :* ${formatFCFA(order.totalAmount)}\n` +
      `⚡ *Statut :* Enregistré instantanément sur la plateforme\n\n` +
      `📱 *Paiement sécurisé Wave :* ${order.wavePaymentUrl}\n\n` +
      `_Message généré instantanément par le site officiel OKBW._`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPDF = () => {
    downloadProformaPDF({
      orderReference: order.orderReference,
      date: order.date,
      customerName: order.customerName || 'Client',
      customerPhone: order.customerPhone || '',
      items: [
        {
          name: order.serviceName,
          quantity: 1,
          unitLabel: 'prestation',
          unitPrice: order.totalAmount,
          totalPrice: order.totalAmount,
          notes: order.instructions
        }
      ],
      totalAmount: order.totalAmount,
      turnaround: order.isAdministrative ? '72h ouvrées (Délai légal greffe)' : 'Standard Rapide',
      isAdministrative: order.isAdministrative
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with celebration visual */}
        <div className="p-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-inner">
              <CheckCircle2 className="w-7 h-7 text-emerald-300 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
                  ⚡ Envoi instantané réussi
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] text-white/80">Sans redirection</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">
                Message & Commande Transmis !
              </h3>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Main confirmation status card */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-emerald-900 dark:text-emerald-200">
                Votre demande a été prise en compte instantanément par DEMS / OKBW.
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Votre dossier est sécurisé avec le numéro officiel ci-dessous. Vous pouvez effectuer votre règlement en 1 clic via le lien Wave Business officiel.
              </p>
            </div>
          </div>

          {/* Ticket Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">RÉFÉRENCE DOSSIER</span>
              </div>
              <span className="text-sm font-black font-mono px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                {order.orderReference}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Client</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{order.customerName || 'Client'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Date & Heure</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{order.date}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Prestation</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{order.serviceName} ({order.quantityText})</span>
              </div>
              {order.instructions && (
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Consignes / Détails</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 italic">{order.instructions}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Montant Total :</span>
              <span className="text-xl font-black text-blue-700 dark:text-blue-300 font-['Outfit']">
                {formatFCFA(order.totalAmount)}
              </span>
            </div>

          </div>

          {/* Direct Wave Payment Action (Primary) */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <span>💳 Règlement Officiel Wave Business</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {onOpenWaveQr ? (
                <button
                  type="button"
                  onClick={() => onOpenWaveQr(order.totalAmount, order.serviceName, order.orderReference)}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Afficher QR Code Wave</span>
                </button>
              ) : (
                <a
                  href={getWavePaymentUrl(order.totalAmount)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Payer {formatFCFA(order.totalAmount)} sur Wave</span>
                </a>
              )}

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Télécharger Devis Proforma</span>
              </button>
            </div>
          </div>

          {/* Copy and Tracking Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopySummary}
              className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copié dans le presse-papier !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copier le récapitulatif</span>
                </>
              )}
            </button>

            {onOpenOrderTracker && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOrderTracker(order.orderReference);
                }}
                className="py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Suivre mon dossier en direct</span>
              </button>
            )}
          </div>

          {/* Optional manual WhatsApp button (only for users who want to talk) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              Besoin de transmettre des photos complémentaires ou de discuter ?
            </p>
            <a
              href={`https://wa.me/${PRIMARY_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour DEMS ! J'ai validé ma commande sur le site (Réf : ${order.orderReference}). Prestation : ${order.serviceName} - Montant : ${formatFCFA(order.totalAmount)}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ouvrir la discussion WhatsApp optionnelle (+225 01 41 75 24 03)</span>
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Enregistré dans votre espace client local</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs transition-colors"
          >
            Terminer & Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
