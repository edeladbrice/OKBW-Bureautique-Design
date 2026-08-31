import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Paperclip, 
  Image, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Download, 
  QrCode, 
  ExternalLink, 
  MessageSquare, 
  Phone, 
  User, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Copy, 
  Check, 
  Trash2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SERVICES_DATA } from '../data/servicesData';
import { 
  formatFCFA, 
  generateOrderReference, 
  saveOrderToHistory, 
  StoredOrderRecord, 
  getWavePaymentUrl,
  PRIMARY_WHATSAPP_NUMBER 
} from '../utils/pricing';
import { downloadProformaPDF } from '../utils/pdfInvoiceGenerator';

interface ChatMessage {
  id: string;
  sender: 'client' | 'dems';
  text: string;
  timestamp: string;
  orderRecord?: StoredOrderRecord;
  attachments?: string[];
}

interface LiveMessengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialMessage?: string;
  onOpenWaveQr?: (amount: number, title: string, ref: string) => void;
  onOpenOrderTracker?: (ref?: string) => void;
}

export const LiveMessengerModal: React.FC<LiveMessengerModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  initialMessage,
  onOpenWaveQr,
  onOpenOrderTracker
}) => {
  const [clientName, setClientName] = useState(() => localStorage.getItem('okbw_last_client_name') || '');
  const [clientPhone, setClientPhone] = useState(() => localStorage.getItem('okbw_last_client_phone') || '');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || 'saisie-texte');
  const [messageText, setMessageText] = useState(initialMessage || '');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; preview?: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  // Chat conversation history stored locally
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem('okbw_live_chat_history');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'msg_welcome',
        sender: 'dems',
        text: 'Bonjour et bienvenue sur la messagerie directe OKBW ! Écrivez votre message ou configurez votre commande ci-dessous. Votre envoi est instantané, sans aucune redirection.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialServiceId) setSelectedServiceId(initialServiceId);
      if (initialMessage) setMessageText(initialMessage);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, initialServiceId, initialMessage]);

  useEffect(() => {
    try {
      localStorage.setItem('okbw_live_chat_history', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  if (!isOpen) return null;

  const currentService = SERVICES_DATA.find(s => s.id === selectedServiceId) || SERVICES_DATA[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: { name: string; size: string; preview?: string }[] = [];
    Array.from(files).forEach((file: File) => {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} Mo` 
        : `${Math.round(file.size / 1024)} Ko`;
      
      const isImg = file.type.startsWith('image/');
      newAttachments.push({
        name: file.name,
        size: sizeStr,
        preview: isImg ? URL.createObjectURL(file) : undefined
      });
    });

    setAttachedFiles(prev => [...prev, ...newAttachments]);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() && attachedFiles.length === 0 && !selectedServiceId) return;

    setIsSubmitting(true);

    // Save name & phone for future
    if (clientName.trim()) localStorage.setItem('okbw_last_client_name', clientName.trim());
    if (clientPhone.trim()) localStorage.setItem('okbw_last_client_phone', clientPhone.trim());

    // Generate verified order ticket
    const orderRef = generateOrderReference();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' à ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    const isAdministrative = currentService.category === 'administratif' || currentService.id.includes('nationalite') || currentService.id.includes('casier');
    const orderAmount = currentService.basePrice;

    const newOrderRecord = saveOrderToHistory({
      orderReference: orderRef,
      date: formattedDate,
      customerName: clientName.trim() || 'Client',
      customerPhone: clientPhone.trim() || '',
      serviceName: currentService.name,
      quantityText: '1 unité / dossier',
      totalAmount: orderAmount,
      instructions: messageText.trim() + (attachedFiles.length > 0 ? ` [${attachedFiles.length} fichier(s) joint(s)]` : ''),
      status: 'recu',
      wavePaymentUrl: getWavePaymentUrl(orderAmount),
      isAdministrative
    });

    const userMsgId = `msg_cli_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'client',
      text: messageText.trim() || `Demande pour la prestation : ${currentService.name}`,
      timestamp: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      attachments: attachedFiles.map(f => f.name)
    };

    setMessages(prev => [...prev, userMsg]);
    setMessageText('');
    setAttachedFiles([]);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    // Instant simulated DEMS automatic response (0.6s)
    setTimeout(() => {
      setIsSubmitting(false);
      const botMsgId = `msg_dems_${Date.now()}`;
      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'dems',
        text: `Message bien reçu ${clientName.trim() ? clientName.trim() : ''} ! Votre dossier a été enregistré instantanément sous la référence ${orderRef}. Nous prenons en charge votre demande immédiatement.`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        orderRecord: newOrderRecord
      };
      setMessages(prev => [...prev, botMsg]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }, 600);
  };

  const handleClearHistory = () => {
    if (window.confirm('Voulez-vous réinitialiser l\'historique des messages ?')) {
      const initial = [
        {
          id: 'msg_welcome',
          sender: 'dems' as const,
          text: 'Bonjour ! Écrivez votre message ci-dessous. Envoi direct et instantané sans redirection.',
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(initial);
      localStorage.setItem('okbw_live_chat_history', JSON.stringify(initial));
    }
  };

  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto flex flex-col h-[90vh] max-h-[750px]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Messenger Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between flex-shrink-0 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-blue-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base sm:text-lg font-['Outfit'] text-white">
                  Messagerie Directe DEMS / OKBW
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  En direct
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                Envoi instantané dans l'application • Zéro redirection
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={handleClearHistory}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              title="Effacer l'historique"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Stream (Scrollable) */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-slate-50 dark:bg-slate-950/60">
          
          {/* Security notice pill */}
          <div className="flex justify-center">
            <span className="text-[11px] px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Vos messages et justificatifs restent sécurisés dans votre session locale</span>
            </span>
          </div>

          {messages.map((msg) => {
            const isClient = msg.sender === 'client';
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isClient ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 px-1">
                  <span>{isClient ? (clientName || 'Vous') : 'DEMS (Conseiller OKBW)'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-sm ${
                  isClient 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Attachments preview if client attached files */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/20 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                        📎 Pièces transmises ({msg.attachments.length}) :
                      </span>
                      {msg.attachments.map((att, idx) => (
                        <div key={idx} className="text-[11px] bg-black/15 px-2 py-1 rounded-lg truncate flex items-center space-x-1">
                          <span>📄</span>
                          <span className="truncate">{att}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Order Ticket Card if attached in DEMS response */}
                  {msg.orderRecord && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                        <span className="text-[10px] font-bold uppercase text-slate-500">Ticket Enregistré</span>
                        <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                          {msg.orderRecord.orderReference}
                        </span>
                      </div>

                      <div className="text-xs space-y-0.5">
                        <p><strong>Prestation :</strong> {msg.orderRecord.serviceName}</p>
                        <p><strong>Montant :</strong> <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{formatFCFA(msg.orderRecord.totalAmount)}</span></p>
                      </div>

                      {/* Wave Button & PDF Download Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {onOpenWaveQr ? (
                          <button
                            type="button"
                            onClick={() => onOpenWaveQr(msg.orderRecord!.totalAmount, msg.orderRecord!.serviceName, msg.orderRecord!.orderReference)}
                            className="py-2 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-sm transition-all"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Paiement Wave</span>
                          </button>
                        ) : (
                          <a
                            href={msg.orderRecord.wavePaymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-sm transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Payer Wave</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            downloadProformaPDF({
                              orderReference: msg.orderRecord!.orderReference,
                              date: msg.orderRecord!.date,
                              customerName: msg.orderRecord!.customerName || 'Client',
                              customerPhone: msg.orderRecord!.customerPhone || '',
                              items: [
                                {
                                  name: msg.orderRecord!.serviceName,
                                  quantity: 1,
                                  unitLabel: 'prestation',
                                  unitPrice: msg.orderRecord!.totalAmount,
                                  totalPrice: msg.orderRecord!.totalAmount,
                                  notes: msg.orderRecord!.instructions
                                }
                              ],
                              totalAmount: msg.orderRecord!.totalAmount,
                              turnaround: 'Standard Rapide'
                            });
                          }}
                          className="py-2 px-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Devis PDF</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSubmitting && (
            <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 p-2 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Transmission instantanée de votre message & génération du ticket...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer Form Section */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-shrink-0 space-y-2.5">
          
          {/* Quick identity inputs (compact) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Votre nom (ex: Dembélé)"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="tel"
                placeholder="Téléphone / WhatsApp"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {SERVICES_DATA.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} ({formatFCFA(srv.basePrice)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Attached files preview chips */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {attachedFiles.map((file, i) => (
                <span 
                  key={i} 
                  className="inline-flex items-center space-x-1 text-[10px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <span>📎 {file.name} ({file.size})</span>
                  <button
                    type="button"
                    onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-red-500 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Main Message Input Bar */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Joindre des fichiers ou photos"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Écrivez votre message ou consignes..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={isSubmitting || (!messageText.trim() && attachedFiles.length === 0)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition-all whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Envoyer</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
            <span>⚡ Envoi direct dans l'application sans quitter la page</span>
            <span>Tarif sélectionné : <strong className="text-blue-600 dark:text-blue-400">{formatFCFA(currentService.basePrice)}</strong></span>
          </div>

        </div>

      </div>
    </div>
  );
};
