import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Receipt, 
  User, 
  Phone, 
  FileText, 
  Check, 
  SendHorizontal,
  Scale,
  Lock,
  Download,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, TurnaroundOption } from '../types';
import { CONTACT_INFO } from '../data/servicesData';
import { 
  formatFCFA, 
  generateWhatsAppOrderLink, 
  TURNAROUND_OPTIONS,
  ADMINISTRATIVE_LOCKED_TURNAROUND,
  hasAdministrativeService,
  getWavePaymentUrl,
  generateOrderReference,
  saveOrderToHistory,
  StoredOrderRecord,
  PRIMARY_WHATSAPP_NUMBER
} from '../utils/pricing';
import { downloadProformaPDF } from '../utils/pdfInvoiceGenerator';
import { TurnaroundSelector } from './TurnaroundSelector';
import { SmartStepWalkthrough } from './SmartSiteGuidance';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onExploreCatalog: () => void;
  onOpenWaveQr?: (amount: number, title: string) => void;
  onOrderSuccess?: (order: StoredOrderRecord) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onExploreCatalog,
  onOpenWaveQr,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const hasAdmin = hasAdministrativeService(cart);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedTurnaround, setSelectedTurnaround] = useState<TurnaroundOption>(() => {
    if (hasAdmin) {
      return ADMINISTRATIVE_LOCKED_TURNAROUND;
    }
    return TURNAROUND_OPTIONS.find(t => t.id === 'express-same-day') || TURNAROUND_OPTIONS[1];
  });
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    if (hasAdmin) {
      setSelectedTurnaround(ADMINISTRATIVE_LOCKED_TURNAROUND);
    }
  }, [hasAdmin]);

  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleDownloadProforma = () => {
    const ref = generateOrderReference();
    downloadProformaPDF({
      orderReference: ref,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      customerName: customerName.trim() || 'Client',
      customerPhone: customerPhone.trim() || '',
      items: cart.map(item => ({
        name: item.service.name,
        quantity: item.quantity,
        unitLabel: item.service.unitLabel,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        notes: item.customNotes
      })),
      totalAmount,
      turnaround: hasAdmin ? '72h ouvrées (3 jours)' : `${selectedTurnaround.label} (${selectedTurnaround.hoursDetail})`,
      isAdministrative: hasAdmin
    });
  };

  const handleInstantCheckout = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const ref = generateOrderReference();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' à ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const fullOrder = saveOrderToHistory({
      orderReference: ref,
      date: formattedDate,
      customerName: customerName.trim() || 'Client',
      customerPhone: customerPhone.trim() || '',
      serviceName: cart.length === 1 ? cart[0].service.name : `${cart.length} prestations groupées`,
      quantityText: `${cart.reduce((s, i) => s + i.quantity, 0)} prestation(s)`,
      totalAmount,
      instructions: [
        customerPhone.trim() ? `Tél: ${customerPhone.trim()}` : '',
        hasAdmin ? 'Délai légal : 72h ouvrées (3 jours)' : `Délai : ${selectedTurnaround.label}`,
        orderNotes.trim()
      ].filter(Boolean).join(' | ') || 'Prestation standard',
      status: 'recu',
      wavePaymentUrl: getWavePaymentUrl(totalAmount),
      isAdministrative: hasAdmin
    });

    onClearCart();
    onClose();

    if (onOrderSuccess) {
      onOrderSuccess(fullOrder);
    }
  };

  const handleWhatsAppCheckout = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const whatsappUrl = generateWhatsAppOrderLink(cart, {
      name: customerName,
      phone: customerPhone,
      turnaroundOption: hasAdmin ? ADMINISTRATIVE_LOCKED_TURNAROUND : selectedTurnaround,
      notes: orderNotes
    });

    window.open(whatsappUrl, '_blank');
  };

  const serviceSummaryText = cart.length === 1 
    ? cart[0].service.name 
    : cart.map(i => `${i.service.name} (${i.quantity})`).join(' + ');

  const totalQtyText = cart.length === 1
    ? `${cart[0].quantity} (${cart[0].service.unitLabel})`
    : `${cart.reduce((s, i) => s + i.quantity, 0)} (${cart.length} prestations)`;

  const instructionsSummary = [
    customerPhone.trim() ? `Tél: ${customerPhone.trim()}` : '',
    hasAdmin ? 'Délai légal : 72h ouvrées (3 jours)' : `Délai : ${selectedTurnaround.label}`,
    orderNotes.trim()
  ].filter(Boolean).join(' | ') || 'Prestation standard';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        
        {/* Slide-over panel */}
        <div 
          className="w-screen max-w-xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF8800] text-slate-950 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-['Outfit']">Votre Panier de Prestations</h2>
                <p className="text-xs text-slate-400">
                  {cart.length} prestation(s) sélectionnée(s)
                </p>
              </div>
            </div>

            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {cart.length === 0 ? (
              /* Empty state */
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Votre panier est vide</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Explorez nos services de bureautique, de design graphique et solutions judiciaires pour démarrer votre commande.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExploreCatalog();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all"
                >
                  Voir les prestations disponibles
                </button>
              </div>
            ) : (
              /* Cart items list */
              <div className="space-y-6">
                
                {/* Smart Interactive Step Guide */}
                <SmartStepWalkthrough 
                  currentStep={customerName.trim() ? 2 : 1}
                  isAdministrative={hasAdmin}
                  amount={totalAmount}
                />

                {/* Administrative banner if cart contains casier / nationalité */}
                {hasAdmin && (
                  <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border-2 border-[#FF5E14] text-xs text-orange-950 dark:text-orange-200 space-y-2">
                    <div className="flex items-center space-x-2 font-bold text-[#FF5E14] dark:text-orange-300">
                      <Scale className="w-4 h-4 flex-shrink-0" />
                      <span>Note légale relative aux actes administratifs / judiciaires</span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      Votre panier contient des actes d'État (Nationalité / Casier Judiciaire). Le règlement est requis pour engager la demande auprès du greffe. Votre <strong>reçu officiel de demande et transaction</strong> est envoyé immédiatement après confirmation du paiement, et le <strong>document officiel physique est disponible sous 72h (3 jours)</strong>.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <span>Détail des articles ({cart.length})</span>
                    <button
                      onClick={onClearCart}
                      className="text-rose-500 hover:text-rose-400 normal-case font-semibold"
                    >
                      Vider le panier
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cart.map((item, index) => (
                      <div
                        key={`${item.service.id}-${index}`}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['Outfit']">
                              {item.service.name}
                            </h4>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {formatFCFA(item.unitPrice)} / {item.service.unitLabel}
                            </span>
                          </div>

                          <button
                            onClick={() => onRemoveItem(index)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Supprimer cet article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.customNotes && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 italic">
                            "{item.customNotes}"
                          </p>
                        )}

                        {/* Quantity & Subtotal */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-0.5"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-black text-slate-900 dark:text-white w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-0.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-black text-[#0F52BA] dark:text-blue-300 font-['Outfit']">
                              {formatFCFA(item.totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Deadlines via Checkboxes with exact hours */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <TurnaroundSelector
                    selectedId={selectedTurnaround.id}
                    onSelect={(opt) => {
                      if (!hasAdmin) {
                        setSelectedTurnaround(opt);
                      }
                    }}
                    title={hasAdmin ? "Délai Réglementaire (Verrouillé 72h)" : "Délai de Livraison Souhaité (Cases à cocher)"}
                    subtitle={hasAdmin ? "Le délai légal de 72h (3 jours) s'applique aux actes judiciaires du panier :" : "Cochez le créneau exact pour l'ensemble de votre commande :"}
                    isAdministrativeLocked={hasAdmin}
                  />
                </div>

                {/* Customer Information Form */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    <User className="w-4 h-4 text-[#0F52BA] dark:text-blue-400" />
                    <span>Coordonnées du demandeur / client</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 block">
                        Nom & Prénoms du client / demandeur <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Votre Nom & Prénoms (ex: M. Kouassi Fabrice)"
                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0F52BA] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 block">
                        Numéro WhatsApp / Téléphone
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Votre Numéro WhatsApp / Téléphone"
                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0F52BA] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 block">
                        Instructions spécifiques & Détails
                      </label>
                      <textarea
                        rows={2}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Consignes particulières, précisions administratives, dates, juridictions..."
                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#0F52BA] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium transition-colors"
                      />
                    </div>

                    {/* Quick Tools Row: Proforma PDF Download & Wave QR Code */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/80">
                      <button
                        type="button"
                        onClick={handleDownloadProforma}
                        className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center space-x-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Télécharger Devis Proforma PDF</span>
                      </button>

                      {onOpenWaveQr && (
                        <button
                          type="button"
                          onClick={() => onOpenWaveQr(totalAmount, serviceSummaryText)}
                          className="py-2 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-800 dark:text-sky-300 font-bold text-xs border border-sky-200 dark:border-sky-800 transition-colors flex items-center space-x-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5 text-sky-600" />
                          <span>QR Code Wave</span>
                        </button>
                      )}
                    </div>

                    {/* LIVE PREVIEW OF THE EXACT WHATSAPP ORDER */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        <span className="flex items-center space-x-1.5">
                          <SendHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Aperçu en direct du message de commande WhatsApp :</span>
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                          Prêt à envoyer
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-emerald-300/80 dark:border-emerald-800/80 text-slate-900 dark:text-slate-100 font-sans text-xs space-y-1.5 shadow-inner">
                        <p className="font-bold text-emerald-700 dark:text-emerald-400">Bonjour OKBW Bureautique & Design !</p>
                        <p className="text-slate-600 dark:text-slate-300">Voici le récapitulatif de ma commande via le Bot du site :</p>
                        
                        <div className="pl-2 border-l-2 border-emerald-500/50 space-y-1 py-1 text-slate-800 dark:text-slate-200">
                          <p><strong className="text-slate-900 dark:text-white">• Service :</strong> {serviceSummaryText}</p>
                          <p><strong className="text-slate-900 dark:text-white">• Quantité / Pages :</strong> {totalQtyText}</p>
                          <p><strong className="text-slate-900 dark:text-white">• Nom du client :</strong> <span className={customerName.trim() ? "text-blue-600 dark:text-blue-400 font-semibold" : "italic text-slate-400 dark:text-slate-500"}>{customerName.trim() || 'Non renseigné'}</span></p>
                          {customerPhone.trim() && (
                            <p><strong className="text-slate-900 dark:text-white">• Contact client :</strong> <span className="text-emerald-600 font-semibold">{customerPhone.trim()}</span></p>
                          )}
                          <p><strong className="text-slate-900 dark:text-white">• Instructions :</strong> {instructionsSummary}</p>
                          <p><strong className="text-slate-900 dark:text-white">{hasAdmin ? "• Montant total :" : "• Montant à régler à la livraison :"}</strong> <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{formatFCFA(totalAmount)}</span></p>
                          <p className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold truncate"><strong className="text-slate-900 dark:text-white">• Lien de paiement Wave officiel :</strong> https://pay.wave.com/m/M_ci_xSfaNea0jdqH/c/ci/</p>
                        </div>

                        {hasAdmin ? (
                          <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-[11px] text-orange-950 dark:text-orange-200 space-y-0.5 border border-orange-200 dark:border-orange-800">
                            <p className="font-bold text-orange-900 dark:text-orange-300">⚖️ Rappel démarches administratives :</p>
                            <p>Paiement obligatoire pour engager la demande • Reçu officiel immédiat • Retrait physique sous 72h (3 jours).</p>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                            Je vous joins mes fichiers ci-dessous dans cette discussion.<br />
                            (Règlement via le lien Wave ci-dessus dès validation de l'aperçu).
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Friendly WhatsApp notice for files */}
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start space-x-2">
                      <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Joindre vos pièces & fichiers :</strong> Vous joindrez directement vos documents (photos des pièces d'identité, Word, PDF, scans) dans la discussion WhatsApp après avoir validé.
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Drawer Footer & Checkout CTAs */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3">
              
              {/* Total Calculation Display */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                    {hasAdmin ? "Montant total de la commande" : "Montant à régler à la livraison"}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Sans frais cachés • Service officiel</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-[#0F52BA] dark:text-blue-300 font-['Outfit']">
                  {formatFCFA(totalAmount)}
                </span>
              </div>

              {/* Checkout Button: Instant in-app sending (No redirection) */}
              <button
                id="cart-instant-checkout-btn"
                onClick={handleInstantCheckout}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-950/25 transition-all flex items-center justify-center space-x-2 animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{hasAdmin ? "⚡ Transmettre la commande & démarches instantanément" : "⚡ Envoyer ma commande instantanément (Sans redirection)"}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Secondary optional WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  title="Ouvrir également sur WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ouvrir sur WhatsApp</span>
                </button>

                {/* Direct Wave Pay Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenWaveQr) {
                      onOpenWaveQr(totalAmount, 'Commande Panier OKBW');
                    } else {
                      window.open(getWavePaymentUrl(totalAmount), '_blank');
                    }
                  }}
                  className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                  <span>Lien Wave ({formatFCFA(totalAmount)})</span>
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Garantie de satisfaction Okbw & Délais d'exécution certifiés</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};


