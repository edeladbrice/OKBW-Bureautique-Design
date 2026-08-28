import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Zap, 
  ArrowRight, 
  ShoppingBag, 
  MessageSquare, 
  CheckCircle2, 
  Percent, 
  Sparkles,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { ServiceItem, TurnaroundOption } from '../types';
import { SERVICES_DATA, CONTACT_INFO } from '../data/servicesData';
import { 
  calculateServicePrice, 
  formatFCFA, 
  generateQuickServiceWhatsAppLink,
  TURNAROUND_OPTIONS
} from '../utils/pricing';
import { TurnaroundSelector } from './TurnaroundSelector';

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
  const [selectedTurnaround, setSelectedTurnaround] = useState<TurnaroundOption>(() => {
    return TURNAROUND_OPTIONS.find(t => t.id === 'express-same-day') || TURNAROUND_OPTIONS[1];
  });

  const selectedService = SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0];
  const { unitPrice, totalPrice, savings, ruleApplied } = calculateServicePrice(selectedService, quantity);

  // Suggested quick quantities based on service
  const getQuickPresets = () => {
    switch (selectedService.id) {
      case 'certificat-nationalite':
      case 'casier-judiciaire':
      case 'pack-nationalite-casier':
        return [1, 2, 3, 5];
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white p-6 relative">
          <button
            id="close-calculator-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer le simulateur"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Calculator className="w-4 h-4" />
            <span>Simulateur Interactif de Tarifs Dégressifs</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] pr-8">
            Calculez votre devis instantané
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Ajustez les curseurs pour observer les réductions par volume et le montant exact garanti.
          </p>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          {/* Step 1: Select Service */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              1. Choisissez la prestation
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => {
                setSelectedServiceId(e.target.value);
                setQuantity(e.target.value === 'saisie-texte' ? 55 : 3);
              }}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {SERVICES_DATA.map((s) => (
                <option key={s.id} value={s.id} className="dark:bg-slate-800">
                  {s.name} — Tarif de base : {s.priceDisplay}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Quantity slider & Presets */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                2. Définissez la quantité ({selectedService.unitLabel})
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-center font-extrabold text-blue-900 dark:text-blue-400 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{selectedService.unitLabel}</span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="1"
              max={selectedService.category === 'bureautique' ? 150 : 30}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-700 dark:accent-blue-500"
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
                      ? 'bg-blue-900 dark:bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {preset} {selectedService.unitLabel.includes('page') ? 'p.' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Turnaround Delay Checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              3. Choisissez le délai souhaité (Cases à cocher)
            </label>
            <TurnaroundSelector
              selectedId={selectedTurnaround.id}
              onSelect={(opt) => setSelectedTurnaround(opt)}
              title="Délai de réalisation"
              subtitle="Cochez le délai correspondant à vos impératifs horaires :"
            />
          </div>

          {/* Live Calculation Display Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-slate-900 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-blue-800/80 border-b">
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
                <span className="text-[11px] text-amber-300 block font-bold">MONTANT À RÉGLER À LA LIVRAISON</span>
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
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <button
            onClick={handleAddAndClose}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Ajouter ce calcul au panier</span>
          </button>

          <a
            href={generateQuickServiceWhatsAppLink(selectedService, quantity, undefined, undefined, selectedTurnaround)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-colors whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Valider la commande sur WhatsApp</span>
          </a>

        </div>

      </div>
    </div>
  );
};

