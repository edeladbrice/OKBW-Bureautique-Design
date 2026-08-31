import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  AlertCircle,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getStoredOrders, StoredOrderRecord, formatFCFA, PRIMARY_WHATSAPP_NUMBER, getWavePaymentUrl } from '../utils/pricing';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onOpenQrModal?: (amount: number, serviceTitle: string, ref: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  onOpenQrModal
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<StoredOrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<StoredOrderRecord | null>(null);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredOrders();
      setOrders(stored);
      if (initialQuery) {
        setQuery(initialQuery);
        const match = stored.find(
          (o) => o.orderReference.toLowerCase().includes(initialQuery.toLowerCase()) || 
                 o.customerPhone.includes(initialQuery)
        );
        if (match) setSelectedOrder(match);
      } else if (stored.length > 0 && !selectedOrder) {
        setSelectedOrder(stored[0]);
      }
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const filteredOrders = orders.filter((o) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      o.orderReference.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q) ||
      o.serviceName.toLowerCase().includes(q)
    );
  });

  const getStepStatus = (status: StoredOrderRecord['status'], stepIndex: number) => {
    const statusMap = {
      recu: 0,
      conception: 1,
      apercu_pret: 2,
      regle_livre: 3
    };
    const currentLevel = statusMap[status] ?? 0;
    if (currentLevel > stepIndex) return 'completed';
    if (currentLevel === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Espace Client OKBW</span>
                <span className="text-xs text-blue-200">• Suivi 24/7</span>
              </div>
              <h3 className="text-xl font-black text-white font-['Outfit']">
                Suivi de Commande & Historique
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par N° de commande (ex: OKBW-2026-...), Nom ou Numéro WhatsApp..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {orders.length === 0 ? (
            <div className="p-10 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Aucune commande enregistrée pour l'instant
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Lorsque vous passez une commande via le Bot DEMS ou le catalogue, elle apparaît ici automatiquement pour que vous puissiez suivre son avancement.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Order List (Left Column) */}
              <div className="lg:col-span-5 space-y-2.5 max-h-96 overflow-y-auto pr-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
                  Vos Commandes Récentes ({filteredOrders.length})
                </span>
                
                {filteredOrders.map((ord) => {
                  const isSelected = selectedOrder?.orderReference === ord.orderReference;
                  return (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all border ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 dark:border-blue-700 shadow-sm'
                          : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {ord.orderReference}
                        </span>
                        <span className="text-slate-500 text-[11px]">{ord.date}</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm mt-1 truncate">
                        {ord.serviceName}
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <span>{ord.customerName}</span>
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                          {formatFCFA(ord.totalAmount)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Order Details & Timeline (Right Column) */}
              <div className="lg:col-span-7">
                {selectedOrder ? (
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-5">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs">
                            {selectedOrder.orderReference}
                          </span>
                          <span className="text-xs text-slate-500">{selectedOrder.date}</span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                          {selectedOrder.serviceName}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Total</span>
                        <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-['Outfit']">
                          {formatFCFA(selectedOrder.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Steps */}
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Statut d'Avancement en Temps Réel
                      </span>

                      <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                        
                        {/* Step 1 */}
                        <div className="flex items-start space-x-3 relative z-10">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            getStepStatus(selectedOrder.status, 0) === 'completed' || getStepStatus(selectedOrder.status, 0) === 'active'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">1. Commande Enregistrée</div>
                            <p className="text-[11px] text-slate-500">Demande transmise à l'équipe OKBW et consignes validées.</p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start space-x-3 relative z-10">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            getStepStatus(selectedOrder.status, 1) === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : getStepStatus(selectedOrder.status, 1) === 'active'
                              ? 'bg-blue-600 text-white animate-pulse'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            2
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">2. Conception & Traitement</div>
                            <p className="text-[11px] text-slate-500">Mise en page, retouche ou préparation du dossier juridique.</p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start space-x-3 relative z-10">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            getStepStatus(selectedOrder.status, 2) === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : getStepStatus(selectedOrder.status, 2) === 'active'
                              ? 'bg-amber-500 text-white animate-pulse'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            3
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">3. Aperçu Prêt sur WhatsApp</div>
                            <p className="text-[11px] text-slate-500">Aperçu envoyé pour validation par le client avant règlement.</p>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-start space-x-3 relative z-10">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            getStepStatus(selectedOrder.status, 3) === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          }`}>
                            4
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">4. Paiement Wave & Fichiers HD</div>
                            <p className="text-[11px] text-slate-500">Règlement Wave validé et déblocage immédiat des fichiers finaux.</p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Customer Info Box */}
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Client :</span>
                        <strong className="text-slate-900 dark:text-white">{selectedOrder.customerName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Contact :</span>
                        <strong className="text-blue-600 dark:text-blue-400">{selectedOrder.customerPhone}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Quantité :</span>
                        <span className="text-slate-800 dark:text-slate-200">{selectedOrder.quantityText}</span>
                      </div>
                    </div>

                    {/* CTAs for Selected Order */}
                    <div className="space-y-2 pt-1">
                      <a
                        href={`https://wa.me/${PRIMARY_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour OKBW, je viens aux nouvelles pour ma commande Réf : ${selectedOrder.orderReference} (${selectedOrder.serviceName}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Contacter OKBW pour ce dossier</span>
                      </a>

                      <div className="flex items-center space-x-2">
                        <a
                          href={selectedOrder.wavePaymentUrl || getWavePaymentUrl(selectedOrder.totalAmount)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                          <span>Payer via Wave ({formatFCFA(selectedOrder.totalAmount)})</span>
                        </a>

                        {onOpenQrModal && (
                          <button
                            onClick={() => onOpenQrModal(selectedOrder.totalAmount, selectedOrder.serviceName, selectedOrder.orderReference)}
                            className="py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
                          >
                            QR Code
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                    Sélectionnez une commande à gauche pour voir les détails d'avancement.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
