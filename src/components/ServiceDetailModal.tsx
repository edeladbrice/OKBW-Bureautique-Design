import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShoppingBag, 
  CreditCard, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Upload, 
  FileCheck, 
  Zap, 
  Plus, 
  Minus,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { ServiceItem } from '../types';
import { CONTACT_INFO } from '../data/servicesData';
import { calculateServicePrice, formatFCFA, generateQuickServiceWhatsAppLink } from '../utils/pricing';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onAddToCart: (service: ServiceItem, quantity: number, notes?: string, fileName?: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onAddToCart
}) => {
  if (!service) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const { unitPrice, totalPrice, savings, ruleApplied } = calculateServicePrice(service, quantity);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(service, quantity, customNotes, uploadedFileName);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white p-6 relative">
          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <span>{service.category.toUpperCase()}</span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Délai moyen : {service.deliveryTime}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] pr-8">
            {service.name}
          </h2>

          <div className="mt-3 flex items-baseline space-x-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-['Outfit']">
              {formatFCFA(totalPrice)}
            </span>
            <span className="text-xs text-slate-300">
              (soit {formatFCFA(unitPrice)} / {service.unitLabel})
            </span>
            {savings > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                Économie : -{formatFCFA(savings)}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description de la prestation</h4>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{service.description}</p>
          </div>

          {/* Special Promo or Tier Rule if any */}
          {(service.promoNote || ruleApplied || service.volumeRulesDescription) && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-900/60 text-amber-950 dark:text-amber-200 space-y-1.5">
              <div className="flex items-center space-x-2 font-bold text-xs text-amber-900 dark:text-amber-300">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Règle Tarifaire & Économies Dégressives</span>
              </div>
              <p className="text-xs font-medium text-amber-800 dark:text-amber-300/90">
                {service.volumeRulesDescription || service.promoNote}
              </p>
              {ruleApplied && (
                <div className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-200/70 dark:bg-amber-900/80 text-amber-950 dark:text-amber-100 text-[11px] font-bold">
                  Appliqué actuellement : {ruleApplied}
                </div>
              )}
            </div>
          )}

          {/* Inclusions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ce qui est inclus dans votre commande</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.inclusions.map((inc, i) => (
                <div key={i} className="flex items-start space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity selector & Live Price calculation */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                Quantité souhaitée ({service.unitLabel})
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Le tarif dégressif s'applique automatiquement
              </span>
            </div>

            <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-inner">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center transition-colors"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min="1"
                max="500"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center font-black text-slate-900 dark:text-white bg-transparent text-base focus:outline-none"
              />

              <button
                type="button"
                onClick={handleIncrement}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center transition-colors"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Custom instructions / Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Instructions particulières / Précisions pour votre commande (facultatif)
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Ex: Mon poste ciblé pour le CV, le titre de mon affiche, la date limite..."
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-850 text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Optional file upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Joindre un document ou une photo (facultatif)
            </label>
            <label className="flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl bg-slate-50 dark:bg-slate-800 cursor-pointer transition-colors text-xs text-slate-600 dark:text-slate-300">
              <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{uploadedFileName ? `Fichier prêt : ${uploadedFileName}` : 'Glisser ou cliquer pour sélectionner votre fichier'}</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
            <p className="text-[11px] text-slate-400">
              Vous pouvez aussi transmettre vos fichiers volumineux directement par WhatsApp ou email après validation.
            </p>
          </div>

          {/* Wave & WhatsApp guarantees */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-blue-900 dark:text-blue-300 text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400 flex-shrink-0" />
              <span className="font-semibold">Paiement 100% sécurisé via Wave Business & Support WhatsApp</span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="text-center sm:text-left w-full sm:w-auto">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Total à régler :</span>
            <span className="text-2xl font-black text-blue-950 dark:text-blue-300 font-['Outfit']">
              {formatFCFA(totalPrice)}
            </span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Direct WhatsApp fast order */}
            <a
              href={generateQuickServiceWhatsAppLink(service, quantity)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Commander WhatsApp</span>
            </a>

            {/* Direct Wave Pay link */}
            <a
              href={CONTACT_INFO.wavePaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>Payer Wave</span>
            </a>

            {/* Add to Cart */}
            <button
              id="detail-modal-add-cart-btn"
              onClick={handleAddToCart}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-extrabold text-xs transition-all ${
                isAdded 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ajouté au panier !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ajouter au panier</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
