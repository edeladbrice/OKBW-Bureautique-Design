import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ShoppingBag, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Plus, 
  Minus,
  FileCheck2,
  AlertCircle,
  User,
  FileText,
  SendHorizontal,
  Lock,
  Receipt,
  Scale
} from 'lucide-react';
import { ServiceItem, TurnaroundOption } from '../types';
import { 
  calculateServicePrice, 
  formatFCFA, 
  generateQuickServiceWhatsAppLink,
  buildWhatsAppFormattedMessage,
  TURNAROUND_OPTIONS,
  ADMINISTRATIVE_LOCKED_TURNAROUND,
  isAdministrativeService
} from '../utils/pricing';
import { TurnaroundSelector } from './TurnaroundSelector';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onAddToCart: (
    service: ServiceItem, 
    quantity: number, 
    notes?: string, 
    customerName?: string,
    turnaroundId?: string
  ) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onAddToCart
}) => {
  if (!service) return null;

  const isAdministrative = isAdministrativeService(service);

  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [selectedTurnaround, setSelectedTurnaround] = useState<TurnaroundOption>(() => {
    if (isAdministrative) {
      return ADMINISTRATIVE_LOCKED_TURNAROUND;
    }
    return TURNAROUND_OPTIONS.find(t => t.id === 'standard') || TURNAROUND_OPTIONS[2];
  });
  const [isAdded, setIsAdded] = useState<boolean>(false);

  useEffect(() => {
    if (isAdministrative) {
      setSelectedTurnaround(ADMINISTRATIVE_LOCKED_TURNAROUND);
    }
  }, [service, isAdministrative]);

  const { unitPrice, totalPrice, savings, ruleApplied } = calculateServicePrice(service, quantity);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    onAddToCart(
      service, 
      quantity, 
      customNotes, 
      customerName,
      selectedTurnaround.id
    );
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 700);
  };

  const whatsappRedirectUrl = generateQuickServiceWhatsAppLink(
    service,
    quantity,
    customerName,
    customNotes,
    selectedTurnaround
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className={`p-6 relative text-white ${
          isAdministrative 
            ? 'bg-gradient-to-r from-[#FF5E14] via-slate-900 to-slate-950' 
            : 'bg-gradient-to-r from-[#0F52BA] via-slate-900 to-slate-950'
        }`}>
          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-2">
            <span className={isAdministrative ? 'text-amber-300' : 'text-[#FF8800]'}>
              {isAdministrative ? '⚖️ E-JUSTICE & ACTES ADMINISTRATIFS' : service.category.toUpperCase()}
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#FF8800]" />
              <span>{service.deliveryTime}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] pr-8 text-white">
            {service.name}
          </h2>

          {/* Target Audience Badge if administrative */}
          {service.targetAudience && (
            <div className="mt-2 inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-orange-500/20 border border-orange-400/40 text-orange-200 text-xs font-semibold">
              <span>🇨🇮</span>
              <span>{service.targetAudience}</span>
            </div>
          )}

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
          
          {/* ADMINISTRATIVE SPECIAL PROTOCOL BOX (When Casier / Nationalité is opened) */}
          {isAdministrative && (
            <div className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border-2 border-[#FF5E14] text-slate-900 dark:text-slate-100 space-y-3.5 shadow-sm">
              <div className="flex items-center space-x-2 text-sm font-extrabold text-[#FF5E14] dark:text-orange-400">
                <Scale className="w-5 h-5 flex-shrink-0" />
                <span>Procédure Réglementaire des Greffes & Tribunaux</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                Veuillez prendre connaissance du déroulement officiel de votre demande d'acte administratif / judiciaire :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Step 1 */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-900/60 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-900 dark:text-orange-300">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">1</span>
                    <span>Paiement de la demande</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                    Obligatoire à l'enregistrement pour le règlement effectif des timbres fiscaux et droits de greffe.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-900/60 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                    <span>Reçu officiel IMMÉDIAT</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                    Dès confirmation du paiement, vous recevez votre <strong>reçu officiel de demande & de transaction</strong>.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-900/60 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-900 dark:text-orange-300">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">3</span>
                    <span>Retrait Document : 72h</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                    Le retrait du document officiel physique s'effectue au tribunal <strong>3 jours (72h ouvrées)</strong> après la demande.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description de la prestation</h4>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{service.description}</p>
          </div>

          {/* REQUIRED DOCUMENTS CHECKLIST (Highlighted for Nationalité, Casier, etc.) */}
          {service.requiredDocuments && service.requiredDocuments.length > 0 && (
            <div className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border-2 border-[#FF5E14]/40 dark:border-[#FF5E14]/50 text-slate-900 dark:text-slate-100 space-y-3 shadow-xs">
              <div className="flex items-center space-x-2.5 text-sm font-extrabold text-[#FF5E14] dark:text-[#FF8800]">
                <FileCheck2 className="w-5 h-5 flex-shrink-0" />
                <span>📋 Pièces Justificatives à Transmettre</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Pour engager la constitution officielle de votre dossier, préparez ces pièces (photos ou scans nets à joindre sur WhatsApp) :
              </p>
              <div className="space-y-2 pt-1">
                {service.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-orange-200/80 dark:border-orange-900/50 text-xs text-slate-800 dark:text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/60 text-[#FF5E14] dark:text-orange-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="font-semibold">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ce qui est inclus dans votre commande</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.inclusions.map((inc, i) => (
                <div key={i} className="flex items-start space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity selector & Live Price calculation */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                Quantité / Nombre de dossiers ({service.unitLabel})
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAdministrative ? 'Nombre de personnes ou de demandes distinctes' : 'Tarif dégressif automatique'}
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

          {/* Turnaround / Delay selection (Locked 72h for administrative) */}
          <TurnaroundSelector
            selectedId={selectedTurnaround.id}
            onSelect={(opt) => {
              if (!isAdministrative) {
                setSelectedTurnaround(opt);
              }
            }}
            isAdministrativeLocked={isAdministrative}
          />

          {/* FORMULAIRE DE COORDONNÉES ET PRÉCISIONS */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                <User className="w-4 h-4 text-[#0F52BA] dark:text-blue-400" />
                <span>Coordonnées du demandeur & Mentions</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>WhatsApp direct</span>
              </span>
            </div>

            {/* Customer Name field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {isAdministrative ? "Nom & Prénoms du demandeur (selon pièce d'identité)" : "Nom & Prénoms du client"} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={isAdministrative ? "Ex: M. KOUAME Yao Serge" : "Ex: M. Kouadio Jean-Marc"}
                className="w-full p-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0F52BA] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-colors"
              />
            </div>

            {/* Instructions / Details field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {isAdministrative ? "Précisions sur la juridiction (Lieu & Date de naissance, tribunal compétent)" : "Détails & Instructions spécifiques"}
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder={isAdministrative ? "Ex: Né le 12/05/1996 à Bouaké, Tribunal de Bouaké..." : "Ex: Couleurs souhaitées, mentions indispensables, police ou style..."}
                className="w-full p-3 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#0F52BA] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-colors"
              />
            </div>

            {/* LIVE PREVIEW OF THE EXACT WHATSAPP MESSAGE */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <SendHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Aperçu en direct du message WhatsApp :</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Prêt à envoyer
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-emerald-300/80 dark:border-emerald-800/80 text-slate-900 dark:text-slate-100 font-sans text-xs space-y-1.5 shadow-inner">
                <p className="font-bold text-emerald-700 dark:text-emerald-400">Bonjour OKBW Bureautique & Design !</p>
                <p className="text-slate-600 dark:text-slate-300">
                  {isAdministrative ? "Je souhaite effectuer une démarche administrative / judiciaire :" : "Je souhaite passer une commande :"}
                </p>
                
                <div className="pl-2 border-l-2 border-emerald-500/50 space-y-1 py-1 text-slate-800 dark:text-slate-200">
                  <p><strong className="text-slate-900 dark:text-white">{isAdministrative ? "• Acte demandé :" : "• Service :"}</strong> {service.name}</p>
                  <p><strong className="text-slate-900 dark:text-white">{isAdministrative ? "• Quantité / Dossiers :" : "• Quantité / Pages :"}</strong> {quantity} ({service.unitLabel})</p>
                  <p><strong className="text-slate-900 dark:text-white">{isAdministrative ? "• Nom du demandeur :" : "• Nom du client :"}</strong> <span className={customerName.trim() ? "text-blue-600 dark:text-blue-400 font-semibold" : "italic text-slate-400 dark:text-slate-500"}>{customerName.trim() || 'Non renseigné'}</span></p>
                  <p><strong className="text-slate-900 dark:text-white">• Instructions :</strong> {customNotes.trim() ? customNotes.trim() : 'Prestation standard'}</p>
                  <p><strong className="text-slate-900 dark:text-white">• Montant total :</strong> <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{formatFCFA(totalPrice)}</span></p>
                </div>

                {isAdministrative ? (
                  <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[11px] text-orange-950 dark:text-orange-200 space-y-1 border border-orange-200 dark:border-orange-800">
                    <p className="font-bold text-orange-900 dark:text-orange-300">⚖️ Rappel des conditions & Délais officiels :</p>
                    <p>1. Paiement obligatoire pour engager la demande et régler les timbres fiscaux & greffe.</p>
                    <p>2. Reçu officiel de demande et transaction transmis <strong>IMMÉDIATEMENT</strong> dès confirmation du paiement.</p>
                    <p>3. Retrait et délivrance du document officiel sous <strong>72h (3 jours ouvrés)</strong>.</p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                    Je vous joins mes fichiers ci-dessous dans cette discussion.<br />
                    (J'attends la fin du travail pour recevoir votre lien de paiement Wave et débloquer ma livraison).
                  </p>
                )}
              </div>
            </div>

            {/* Friendly Direct WhatsApp Attachment Notice */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Pièces et documents :</strong> Vous joindrez vos justificatifs (photos nettes ou scans) directement dans la discussion WhatsApp après avoir cliqué sur le bouton ci-dessous.
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="text-center sm:text-left w-full sm:w-auto">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              {isAdministrative ? "Montant total de la démarche :" : "Montant à régler à la livraison :"}
            </span>
            <span className="text-2xl font-black text-[#0F52BA] dark:text-blue-300 font-['Outfit']">
              {formatFCFA(totalPrice)}
            </span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto flex-wrap sm:flex-nowrap gap-y-2">
            {/* Direct WhatsApp fast order with structured pre-filled message */}
            <a
              id="detail-modal-whatsapp-validate-btn"
              href={whatsappRedirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/20 transition-all whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isAdministrative ? "Valider la démarche sur WhatsApp" : "Valider la commande sur WhatsApp"}</span>
            </a>

            {/* Add to Cart */}
            <button
              id="detail-modal-add-cart-btn"
              onClick={handleAddToCart}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-extrabold text-xs transition-all whitespace-nowrap ${
                isAdded 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-[#FF5E14] hover:bg-[#e04f0f] text-white shadow-md shadow-orange-500/20'
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


