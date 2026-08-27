import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Zap, 
  ArrowRight, 
  ShoppingBag, 
  CreditCard, 
  MessageSquare, 
  CheckCircle2, 
  Percent, 
  Sparkles,
  Layers
} from 'lucide-react';
import { ServiceItem } from '../types';
import { SERVICES_DATA, CONTACT_INFO } from '../data/servicesData';
import { calculateServicePrice, formatFCFA, generateQuickServiceWhatsAppLink } from '../utils/pricing';

interface PriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (service: ServiceItem, quantity: number) => void;
}

export const PriceCalculatorModal: React.FC<PriceCalculatorModalProps> = ({
  isOpen,
  onClose,
  onAddToCart
}) => {
  if (!isOpen) return null;

  const [selectedServiceId, setSelectedServiceId] = useState<string>('saisie-texte');
  const [quantity, setQuantity] = useState<number>(60);

  const selectedService = SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0];
  const { unitPrice, totalPrice, savings, ruleApplied } = calculateServicePrice(selectedService, quantity);

  // Suggested quick quantities based on service
  const getQuickPresets = () => {
    switch (selectedService.id) {
      case 'saisie-texte':
        return [10, 30, 50, 75, 120];
      case 'retouche-photo':
        return [1, 5, 8, 10, 20];
      case 'creation-affiche':
        return [1, 3, 5, 10, 15];
      case 'modification-pdf':
        return [2, 4, 8, 15, 25];
      case 'conversion-correction':
        return [1, 5, 20, 30, 50];
      default:
        return [1, 2, 5, 10];
    }
  };

  const handleAddAndClose = () => {
    onAddToCart(selectedService, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Calculator className="w-4 h-4" />
            <span>Simulateur de Devis & Calculateur Dégressif</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-['Outfit']">
            Estimez vos Économies Immédiates
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Ajustez le volume pour voir automatiquement le prix unitaire réduit et le montant total.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Step 1: Select Service */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. Choisissez la prestation
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => {
                setSelectedServiceId(e.target.value);
                setQuantity(e.target.value === 'saisie-texte' ? 55 : 3);
              }}
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {SERVICES_DATA.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — Tarif de base : {s.priceDisplay}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Quantity slider & Presets */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Définissez la quantité ({selectedService.unitLabel})
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-1 bg-white border border-slate-300 rounded-lg text-center font-extrabold text-blue-900 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-600">{selectedService.unitLabel}</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="1"
              max={selectedService.category === 'bureautique' ? 150 : 30}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
            />

            {/* Quick preset buttons */}
            <div className="flex items-center space-x-2 flex-wrap gap-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400">Paliers rapides :</span>
              {getQuickPresets().map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setQuantity(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    quantity === preset
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset} {selectedService.unitLabel.includes('page') ? 'p.' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Live Calculation Display Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-800/80">
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Résultat du devis instantané</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                Calcul en direct
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Prix unitaire calculé</span>
                <span className="text-xl font-bold text-slate-100 font-['Outfit']">
                  {formatFCFA(unitPrice)}
                </span>
                <span className="text-[10px] text-slate-400 block">/ {selectedService.unitLabel}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Volume total</span>
                <span className="text-xl font-bold text-slate-100 font-['Outfit']">
                  {quantity} {selectedService.unitLabel}
                </span>
                <span className="text-[10px] text-slate-400 block">à traiter</span>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] text-amber-300 block font-bold">TOTAL ESTIMÉ</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-['Outfit']">
                  {formatFCFA(totalPrice)}
                </span>
              </div>
            </div>

            {ruleApplied && (
              <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-700/50 text-xs text-blue-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{ruleApplied}</span>
              </div>
            )}

            {savings > 0 && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 font-bold flex items-center justify-between">
                <span>Vous économisez grâce au tarif dégressif :</span>
                <span className="text-sm font-black text-emerald-400">-{formatFCFA(savings)}</span>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <button
            onClick={handleAddAndClose}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Ajouter ce calcul au panier</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <a
              href={generateQuickServiceWhatsAppLink(selectedService, quantity)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Commander WhatsApp</span>
            </a>

            <a
              href={CONTACT_INFO.wavePaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>Payer Wave</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
