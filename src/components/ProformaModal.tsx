import React from 'react';
import { X, FileText, Download, Printer, ShieldCheck, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { ProformaInvoiceData, downloadProformaPDF } from '../utils/pdfInvoiceGenerator';
import { formatFCFA, PRIMARY_WHATSAPP_NUMBER } from '../utils/pricing';

interface ProformaModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProformaInvoiceData;
}

export const ProformaModal: React.FC<ProformaModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    downloadProformaPDF(data);
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = `Bonjour OKBW, j'ai généré le devis proforma N° ${data.orderReference} (${formatFCFA(data.totalAmount)}) pour le client ${data.customerName}. Je vous transmets mon bon de commande pour traitement.`;
  const whatsappUrl = `https://wa.me/${PRIMARY_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Document Officiel Proforma</span>
                <span className="text-xs text-slate-400 font-mono">#{data.orderReference}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit']">
                Devis & Bon de Commande Proforma
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Proforma Paper Preview */}
        <div className="p-5 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto bg-slate-50 dark:bg-slate-950/50">
          
          {/* Paper Header */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            
            {/* Top Brand Banner */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight font-['Outfit']">
                    OKBW BUREAUTIQUE & DESIGN
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Solutions Bureautiques, Graphisme, Actes & Digital
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-1">
                  Abidjan • Tél: +225 01 41 75 24 03
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-extrabold text-xs">
                  DEVIS N° {data.orderReference}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                  Date : <strong>{data.date}</strong>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Validité : <strong>30 jours</strong>
                </p>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Destinataire :</span>
                <strong className="text-slate-900 dark:text-white text-sm font-bold block mt-0.5">
                  {data.customerName || 'Client Particulier / Professionnel'}
                </strong>
                {data.customerPhone && (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                    WhatsApp : {data.customerPhone}
                  </span>
                )}
              </div>
              <div className="sm:text-right">
                <span className="text-slate-500 dark:text-slate-400 block">Mode de règlement :</span>
                <strong className="text-emerald-700 dark:text-emerald-400 font-bold block mt-0.5">
                  Wave Business Officiel CI
                </strong>
                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                  Délai : {data.turnaround || 'Standard Rapide (24h à 48h)'}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Désignation</th>
                    <th className="p-3 text-center">Qté</th>
                    <th className="p-3 text-right">P.U (FCFA)</th>
                    <th className="p-3 text-right">Total (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                        {item.notes && <div className="text-[11px] text-slate-500 italic mt-0.5">{item.notes}</div>}
                      </td>
                      <td className="p-3 text-center text-slate-600 dark:text-slate-300">
                        {item.quantity} {item.unitLabel}
                      </td>
                      <td className="p-3 text-right text-slate-600 dark:text-slate-300">
                        {formatFCFA(item.unitPrice)}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                        {formatFCFA(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Block */}
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-3 pt-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Révisions & Ajustements illimités inclus</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Règlement sécurisé Wave Business à la livraison</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-2xl min-w-[220px] text-right">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-bold">
                  Total Net à Payer
                </span>
                <div className="text-2xl font-black text-amber-400 font-['Outfit'] mt-0.5">
                  {formatFCFA(data.totalAmount)}
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">TVA 0% (Auto-entrepreneur)</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              id="btn-download-pdf-proforma"
              onClick={handleDownload}
              className="flex-1 sm:flex-none py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger le Devis PDF</span>
            </button>

            <button
              id="btn-print-proforma"
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
              title="Imprimer"
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
          </div>

          <a
            id="btn-send-whatsapp-proforma"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Valider ce devis sur WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
