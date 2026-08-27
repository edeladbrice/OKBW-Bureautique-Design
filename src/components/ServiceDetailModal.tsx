import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShoppingBag, 
  CreditCard, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Plus, 
  Minus,
  Sparkles,
  Lock,
  ExternalLink,
  Info
} from 'lucide-react';
import { ServiceItem, TurnaroundOption, UploadedFile } from '../types';
import { CONTACT_INFO } from '../data/servicesData';
import { 
  calculateServicePrice, 
  formatFCFA, 
  generateQuickServiceWhatsAppLink,
  generateWavePaymentUrl,
  TURNAROUND_OPTIONS
} from '../utils/pricing';
import { FileUploadDropzone } from './FileUploadDropzone';
import { TurnaroundSelector } from './TurnaroundSelector';
import { WavePaymentModal } from './WavePaymentModal';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onAddToCart: (
    service: ServiceItem, 
    quantity: number, 
    notes?: string, 
    fileName?: string,
    files?: UploadedFile[],
    turnaroundId?: string
  ) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onAddToCart
}) => {
  if (!service) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedTurnaround, setSelectedTurnaround] = useState<TurnaroundOption>(() => {
    return TURNAROUND_OPTIONS.find(t => t.id === 'standard') || TURNAROUND_OPTIONS[2];
  });
  const [isWaveModalOpen, setIsWaveModalOpen] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const { unitPrice, totalPrice, savings, ruleApplied } = calculateServicePrice(service, quantity);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    const primaryFileName = uploadedFiles.length > 0 ? uploadedFiles[0].name : undefined;
    onAddToCart(
      service, 
      quantity, 
      customNotes, 
      primaryFileName,
      uploadedFiles,
      selectedTurnaround.id
    );
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 700);
  };

  const waveExactUrl = generateWavePaymentUrl(totalPrice, `Service ${service.name.slice(0, 30)}`);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
        <div 
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors my-6"
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
                <span>Délai habituel : {service.deliveryTime}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] pr-8">
              {service.name}
            </h2>

            <div className="mt-3 flex items-baseline space-x-3 flex-wrap gap-y-2">
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
          <div className="p-5 sm:p-7 space-y-6 max-h-[72vh] overflow-y-auto">
            
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

            {/* Turnaround / Delay selection via Interactive Checkboxes */}
            <TurnaroundSelector
              selectedId={selectedTurnaround.id}
              onSelect={(opt) => setSelectedTurnaround(opt)}
            />

            {/* Drag & Drop Client Exemplar Files Component */}
            <FileUploadDropzone
              files={uploadedFiles}
              onFilesChange={setUploadedFiles}
              label="Fichiers exemplaires du client (textes, modèles, maquettes, photos)"
              helperText="Glissez-déposez vos fichiers Word, PDF, photos ou maquettes directement ici."
            />

            {/* Custom instructions / Notes */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Consignes particulières ou précisions pour votre commande (facultatif)
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Ex: Titre précis, style souhaité, couleurs de l'entreprise, date limite impérative..."
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-850 text-slate-800 dark:text-white placeholder:text-slate-400"
              />
            </div>

            {/* Wave Exact Amount Security Banner */}
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex items-start space-x-3 text-xs">
              <Lock className="w-4 h-4 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
              <div className="text-slate-700 dark:text-slate-300">
                <span className="font-bold text-sky-950 dark:text-sky-200 block">
                  Montant exact de {formatFCFA(totalPrice)} instancié dans Wave
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  Le lien Wave applique automatiquement le montant exact sans possibilité de saisir un montant inférieur.
                </span>
              </div>
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <div className="text-center sm:text-left w-full sm:w-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Total exact de la prestation :</span>
              <span className="text-2xl font-black text-blue-950 dark:text-blue-300 font-['Outfit']">
                {formatFCFA(totalPrice)}
              </span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto flex-wrap sm:flex-nowrap gap-y-2">
              {/* Direct WhatsApp fast order with files & exact Wave link */}
              <a
                href={generateQuickServiceWhatsAppLink(service, quantity, uploadedFiles, selectedTurnaround)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Commander WhatsApp</span>
              </a>

              {/* Direct Wave Pay button with exact locked amount modal */}
              <button
                type="button"
                onClick={() => setIsWaveModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors whitespace-nowrap"
              >
                <CreditCard className="w-4 h-4" />
                <span>Payer Wave ({formatFCFA(totalPrice)})</span>
              </button>

              {/* Add to Cart */}
              <button
                id="detail-modal-add-cart-btn"
                onClick={handleAddToCart}
                className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-extrabold text-xs transition-all whitespace-nowrap ${
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

      {/* Wave Secure Payment Dialog */}
      <WavePaymentModal
        isOpen={isWaveModalOpen}
        onClose={() => setIsWaveModalOpen(false)}
        amount={totalPrice}
        serviceTitle={`${service.name} (${quantity} ${service.unitLabel})`}
        customerName={customNotes ? `Client (${customNotes.slice(0, 20)})` : undefined}
      />
    </>
  );
};
