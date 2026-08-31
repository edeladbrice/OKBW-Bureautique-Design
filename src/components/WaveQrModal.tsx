import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Sparkles, Copy, Check, ExternalLink, ShieldCheck, Smartphone, QrCode } from 'lucide-react';
import { formatFCFA, getWavePaymentUrl, WAVE_PAYMENT_URL } from '../utils/pricing';

interface WaveQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
  serviceTitle?: string;
  orderReference?: string;
}

export const WaveQrModal: React.FC<WaveQrModalProps> = ({
  isOpen,
  onClose,
  amount,
  serviceTitle,
  orderReference
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const waveUrl = getWavePaymentUrl(amount);

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(waveUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR Code Generation Error', err));
    }
  }, [isOpen, waveUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(waveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-sky-600 to-blue-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-sky-200 text-xs font-bold uppercase tracking-wider mb-1">
            <QrCode className="w-4 h-4" />
            <span>Paiement Sécurisé 1-Clic</span>
          </div>
          <h3 className="text-xl font-black text-white font-['Outfit']">
            Flasher le QR Code Wave
          </h3>
          <p className="text-xs text-sky-100 mt-1">
            Paiement marchand officiel direct sans intermédiaire
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-center">
          
          {/* Amount Badge */}
          <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-2xl">
            <span className="text-xs text-slate-600 dark:text-slate-400 block font-medium">
              {serviceTitle ? `Prestation : ${serviceTitle}` : 'Montant de la prestation'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-sky-950 dark:text-sky-200 font-['Outfit'] mt-0.5">
              {amount ? formatFCFA(amount) : 'Lien Marchand Ouvert'}
            </div>
            {orderReference && (
              <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold block mt-1">
                Réf : {orderReference}
              </span>
            )}
          </div>

          {/* QR Code Frame */}
          <div className="flex flex-col items-center justify-center">
            <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-sky-400/30 inline-block relative group">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code Wave Payment"
                  className="w-52 h-52 sm:w-56 sm:h-56 object-contain rounded-xl"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-slate-400">
                  <span>Génération du QR...</span>
                </div>
              )}

              {/* Center Logo Indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center shadow-lg border-2 border-white">
                  Wave
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 max-w-xs leading-relaxed">
              Ouvrez votre application <strong>Wave</strong> sur smartphone et scannez ce code pour valider en 2 secondes.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <a
              id="wave-open-app-btn"
              href={waveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/25 transition-all flex items-center justify-center space-x-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Ouvrir l'application Wave</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
            </a>

            <button
              id="wave-copy-link-btn"
              onClick={handleCopy}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Lien Wave copié dans le presse-papier !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copier le lien de paiement direct</span>
                </>
              )}
            </button>
          </div>

          {/* Guarantee Note */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Paiement marchand officiel direct Wave Business (Zéro numéro personnel à composer)</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Pour transmettre vos fichiers & échanger : WhatsApp Business au <strong className="text-emerald-600 dark:text-emerald-400">+225 01 41 75 24 03</strong>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
