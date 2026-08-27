import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';
import { CONTACT_INFO } from '../data/servicesData';
import { formatFCFA, generateWhatsAppOrderLink } from '../utils/pricing';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onExploreCatalog: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onExploreCatalog
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [urgency, setUrgency] = useState('Standard (24h - 48h)');
  const [orderNotes, setOrderNotes] = useState('');
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleWhatsAppCheckout = () => {
    // trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    const whatsappUrl = generateWhatsAppOrderLink(cart, {
      name: customerName,
      phone: customerPhone,
      urgency,
      notes: orderNotes
    });

    window.open(whatsappUrl, '_blank');
  };

  const handleWaveCheckout = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    window.open(CONTACT_INFO.wavePaymentUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        {/* Slide-over panel */}
        <div 
          className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Drawer Header */}
          <div className="p-6 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
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
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {cart.length === 0 ? (
              /* Empty state */
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Votre panier est vide</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Explorez nos services de bureautique, de design graphique et solutions PDF pour démarrer votre commande.
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
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Détail des articles</span>
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
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.customNotes && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 italic">
                          "{item.customNotes}"
                        </p>
                      )}

                      {item.fileName && (
                        <div className="text-[11px] text-blue-700 dark:text-blue-400 font-medium flex items-center space-x-1">
                          <span>📎 Fichier joint : {item.fileName}</span>
                        </div>
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
                          <span className="text-sm font-black text-blue-950 dark:text-blue-300 font-['Outfit']">
                            {formatFCFA(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Checkout Form */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Informations de Commande
                  </h4>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Votre Nom & Prénoms (ex: M. Kouassi Fabrice)"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-850 text-slate-800 dark:text-white placeholder:text-slate-400"
                    />

                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Votre Numéro WhatsApp / Téléphone"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-850 text-slate-800 dark:text-white placeholder:text-slate-400"
                    />

                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 text-slate-800 dark:text-white font-medium"
                    >
                      <option value="Standard (24h - 48h)">Délai : Standard (24h - 48h)</option>
                      <option value="Urgence Express (Moins de 12h)">Délai : Urgence Express (Moins de 12h)</option>
                      <option value="Urgence Absolue (Moins de 6h)">Délai : Urgence Absolue (Moins de 6h)</option>
                    </select>

                    <textarea
                      rows={2}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Consignes particulières ou détails importants..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 text-slate-800 dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Drawer Footer & Checkout CTAs */}
          {cart.length > 0 && (
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-4">
              
              {/* Total Calculation Display */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Total à payer</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Sans frais de transaction</span>
                </div>
                <span className="text-2xl font-black text-blue-950 dark:text-blue-300 font-['Outfit']">
                  {formatFCFA(totalAmount)}
                </span>
              </div>

              {/* Checkout Button 1: WhatsApp instant order */}
              <button
                id="cart-whatsapp-checkout-btn"
                onClick={handleWhatsAppCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 fill-white/20" />
                <span>Valider ma commande sur WhatsApp</span>
              </button>

              {/* Checkout Button 2: Wave direct payment link */}
              <button
                id="cart-wave-checkout-btn"
                onClick={handleWaveCheckout}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-900/20 transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Payer directement via Wave</span>
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Garantie de satisfaction Okbw & Livraison certifiée</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
