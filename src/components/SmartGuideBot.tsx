import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ChevronRight, 
  RefreshCw, 
  MessageSquare, 
  ShoppingBag, 
  Calculator, 
  Clock, 
  ShieldCheck, 
  Scale, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Phone,
  Maximize2,
  Minimize2,
  ChevronDown,
  ExternalLink,
  Layers,
  FileCheck2,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ServiceItem, TurnaroundOption } from '../types';
import { SERVICES_DATA, CONTACT_INFO } from '../data/servicesData';
import { 
  calculateServicePrice, 
  formatFCFA, 
  generateQuickServiceWhatsAppLink, 
  TURNAROUND_OPTIONS, 
  ADMINISTRATIVE_LOCKED_TURNAROUND,
  isAdministrativeService,
  DISPLAY_CONTACTS
} from '../utils/pricing';
import { 
  BotMessage, 
  BotQuickReply, 
  GREETING_MESSAGE, 
  INITIAL_QUICK_REPLIES, 
  processUserQuery, 
  StepWizardState,
  CLIENT_SCENARIOS,
  IVORIAN_TRIBUNALS
} from '../utils/guideBotEngine';

interface SmartGuideBotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenServiceModal: (service: ServiceItem) => void;
  onOpenCalculatorModal: (serviceId?: string) => void;
  onAddToCart: (service: ServiceItem, quantity: number, notes?: string) => void;
  onScrollToCatalog: () => void;
  initialQuery?: string;
}

export const SmartGuideBot: React.FC<SmartGuideBotProps> = ({
  isOpen,
  onClose,
  onOpenServiceModal,
  onOpenCalculatorModal,
  onAddToCart,
  onScrollToCatalog,
  initialQuery
}) => {
  const [messages, setMessages] = useState<BotMessage[]>([GREETING_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const lastProcessedQueryRef = useRef<string | undefined>(undefined);

  // Guided Wizard State
  const [wizardState, setWizardState] = useState<StepWizardState | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);

      // If an initialQuery was passed and hasn't been sent yet for this open session
      if (initialQuery && initialQuery !== lastProcessedQueryRef.current) {
        lastProcessedQueryRef.current = initialQuery;
        setTimeout(() => {
          handleSendMessage(initialQuery);
        }, 200);
      }
    } else {
      lastProcessedQueryRef.current = undefined;
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, wizardState]);

  // Restart chat
  const handleResetChat = () => {
    setWizardState(null);
    setMessages([
      {
        ...GREETING_MESSAGE,
        id: `msg_reset_${Date.now()}`,
        timestamp: new Date()
      }
    ]);
  };

  // Add a user message and trigger bot response
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    // Add user message
    const userMsg: BotMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      // If currently in details step of the state machine, capture the user's input as customer name / notes
      if (wizardState && wizardState.step === 'details') {
        const lines = query.split('\n').map(l => l.trim()).filter(Boolean);
        const nameInput = lines[0] || query;
        const notesInput = lines.length > 1 ? lines.slice(1).join(' | ') : '';
        handleWizardFinish(nameInput, notesInput);
        setIsTyping(false);
        return;
      }

      // If currently in quantity step and user typed a number
      if (wizardState && wizardState.step === 'quantity') {
        const num = parseInt(query.replace(/\D/g, ''), 10);
        if (!isNaN(num) && num > 0) {
          handleWizardSetQuantity(num);
          setIsTyping(false);
          return;
        }
      }

      const botResponse = processUserQuery(query, wizardState || undefined);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 450);
  };

  // Handle Quick Action clicks
  const handleQuickAction = (reply: BotQuickReply) => {
    if (reply.action === 'start_wizard') {
      startGuidedWizard();
      return;
    }

    if (reply.action === 'open_calc_modal') {
      onOpenCalculatorModal(reply.payload);
      return;
    }

    if (reply.action === 'open_service_detail') {
      const service = SERVICES_DATA.find(s => s.id === reply.payload);
      if (service) {
        onOpenServiceModal(service);
      }
      return;
    }

    if (reply.action === 'scroll_catalog') {
      onScrollToCatalog();
      onClose();
      return;
    }

    if (reply.action === 'contact_advisor') {
      window.open(CONTACT_INFO.whatsappUrl, '_blank');
      return;
    }

    // Otherwise treat as a text query
    handleSendMessage(reply.label);
  };

  // --- STEP-BY-STEP GUIDED WIZARD LOGIC ---
  const startGuidedWizard = () => {
    setWizardState({
      step: 'category',
      quantity: 1
    });

    const wizardWelcome: BotMessage = {
      id: `wizard_init_${Date.now()}`,
      sender: 'bot',
      text: `🎯 **Guide de Commande Pas à Pas (Étape 1/5)**\n\nPour commencer, quelle est la catégorie principale de votre besoin ?`,
      timestamp: new Date(),
      quickReplies: [
        { id: 'cat_bureau', label: '📄 Bureautique, CV & Saisie', action: 'wizard_set_cat', payload: 'bureautique', icon: 'FileText' },
        { id: 'cat_admin', label: '⚖️ Démarches Judiciaires (72h)', action: 'wizard_set_cat', payload: 'administratif', icon: 'Scale' },
        { id: 'cat_design', label: '🎨 Design, Logo & Affiches', action: 'wizard_set_cat', payload: 'design', icon: 'Sparkles' },
        { id: 'cat_pdf', label: '🛠️ Solutions PDF & Conversion', action: 'wizard_set_cat', payload: 'pdf', icon: 'FileEdit' },
        { id: 'cat_web', label: '🌐 Création de Site Web', action: 'wizard_set_cat', payload: 'web', icon: 'Layers' }
      ]
    };

    setMessages(prev => [...prev, wizardWelcome]);
  };

  const handleWizardSelectCategory = (categoryKey: string) => {
    const filteredServices = SERVICES_DATA.filter(s => s.category === categoryKey);
    setWizardState(prev => ({
      ...(prev || { quantity: 1, step: 'service' }),
      step: 'service',
      selectedCategory: categoryKey
    }));

    const categoryNames: Record<string, string> = {
      bureautique: 'Bureautique & Rédaction',
      administratif: 'Démarches Judiciaires & Administratives',
      design: 'Design Graphique & Identité',
      pdf: 'Solutions PDF & Conversion',
      web: 'Création Web & Applications'
    };

    const nextMsg: BotMessage = {
      id: `wizard_serv_${Date.now()}`,
      sender: 'bot',
      text: `📌 **Étape 2/5 : Choisissez votre service dans "${categoryNames[categoryKey] || categoryKey}"**\n\nVoici les prestations disponibles :`,
      timestamp: new Date(),
      quickReplies: filteredServices.map(s => ({
        id: `wiz_s_${s.id}`,
        label: `${s.name} (${s.priceDisplay})`,
        action: 'wizard_set_service',
        payload: s.id
      }))
    };

    setMessages(prev => [...prev, nextMsg]);
  };

  const handleWizardSelectService = (serviceId: string) => {
    const service = SERVICES_DATA.find(s => s.id === serviceId);
    if (!service) return;

    const isAdmin = isAdministrativeService(service);
    const initialQty = service.id === 'saisie-texte' ? 30 : 1;
    const defaultTurnaround = isAdmin 
      ? ADMINISTRATIVE_LOCKED_TURNAROUND 
      : (TURNAROUND_OPTIONS.find(t => t.id === 'express-same-day') || TURNAROUND_OPTIONS[1]);

    setWizardState(prev => ({
      ...(prev || { step: 'quantity', quantity: initialQty }),
      step: 'quantity',
      selectedService: service,
      quantity: initialQty,
      selectedTurnaround: defaultTurnaround
    }));

    const pricing = calculateServicePrice(service, initialQty);

    const nextMsg: BotMessage = {
      id: `wizard_qty_${Date.now()}`,
      sender: 'bot',
      text: `📊 **Étape 3/5 : Définissez la quantité ou le volume pour "${service.name}"**\n\n• Tarif unitaire de base : **${service.priceDisplay}** (${service.unitLabel})\n${service.volumeRulesDescription ? `• *${service.volumeRulesDescription}*` : ''}\n\nChoisissez ou ajustez le volume souhaité :`,
      timestamp: new Date(),
      widgetType: 'quick_calculator',
      widgetData: {
        service,
        quantity: initialQty,
        pricing
      },
      quickReplies: [
        { id: 'qty_1', label: `1 ${service.unitLabel}`, action: 'wizard_set_qty', payload: 1 },
        { id: 'qty_3', label: `3 ${service.unitLabel}`, action: 'wizard_set_qty', payload: 3 },
        { id: 'qty_5', label: `5 ${service.unitLabel}`, action: 'wizard_set_qty', payload: 5 },
        { id: 'qty_10', label: `10 ${service.unitLabel}`, action: 'wizard_set_qty', payload: 10 },
        { id: 'qty_50', label: `50 ${service.unitLabel}`, action: 'wizard_set_qty', payload: 50 }
      ]
    };

    setMessages(prev => [...prev, nextMsg]);
  };

  const handleWizardSetQuantity = (newQty: number) => {
    if (!wizardState?.selectedService) return;
    const service = wizardState.selectedService;
    const isAdmin = isAdministrativeService(service);
    const pricing = calculateServicePrice(service, newQty);

    setWizardState(prev => ({
      ...prev!,
      step: 'turnaround',
      quantity: newQty
    }));

    let turnaroundText = `⏱️ **Étape 4/5 : Délai de réalisation souhaité**\n\n`;
    let quickReplies: BotQuickReply[] = [];

    if (isAdmin) {
      turnaroundText += `⚖️ **Délai Réglementaire du Tribunal : 72h (3 jours ouvrés)**\n\nPour les actes de justice et d'État (Nationalité & Casier), le délai est fixé à **72h ouvrées** pour la signature du magistrat au tribunal.\n\n*Paiement requis à l'enregistrement pour les timbres fiscaux • Reçu officiel de demande et transaction immédiat.*`;
      quickReplies = [
        { id: 'turn_admin_ok', label: '✅ Valider le délai légal (72h)', action: 'wizard_set_turnaround', payload: 'admin-72h', primary: true }
      ];
    } else {
      turnaroundText += `Montant calculé pour **${newQty} ${service.unitLabel}** : **${formatFCFA(pricing.totalPrice)}**\n\nChoisissez le délai qui vous convient :`;
      quickReplies = TURNAROUND_OPTIONS.map(opt => ({
        id: `wiz_t_${opt.id}`,
        label: `${opt.badge} ${opt.label} (${opt.hoursDetail})`,
        action: 'wizard_set_turnaround',
        payload: opt.id
      }));
    }

    const nextMsg: BotMessage = {
      id: `wizard_turn_${Date.now()}`,
      sender: 'bot',
      text: turnaroundText,
      timestamp: new Date(),
      quickReplies
    };

    setMessages(prev => [...prev, nextMsg]);
  };

  const handleWizardSetTurnaround = (turnaroundId: string) => {
    if (!wizardState?.selectedService) return;
    const service = wizardState.selectedService;
    const isAdmin = isAdministrativeService(service);

    const turnaround = isAdmin 
      ? ADMINISTRATIVE_LOCKED_TURNAROUND 
      : (TURNAROUND_OPTIONS.find(t => t.id === turnaroundId) || TURNAROUND_OPTIONS[1]);

    setWizardState(prev => ({
      ...prev!,
      step: 'details',
      selectedTurnaround: turnaround
    }));

    const nextMsg: BotMessage = {
      id: `wizard_det_${Date.now()}`,
      sender: 'bot',
      text: `📝 **Étape 5/5 : Coordonnées & Finalisation**\n\nVeuillez indiquer votre **Nom complet** et vos consignes éventuelles (ou cliquez ci-dessous pour finaliser directement) :`,
      timestamp: new Date(),
      quickReplies: [
        { id: 'finish_direct', label: '🚀 Finaliser mon récapitulatif maintenant', action: 'wizard_finish_order', primary: true }
      ]
    };

    setMessages(prev => [...prev, nextMsg]);
  };

  const handleWizardFinish = (customName?: string, customNotes?: string) => {
    if (!wizardState?.selectedService) return;
    const service = wizardState.selectedService;
    const qty = wizardState.quantity || 1;
    const turnaround = wizardState.selectedTurnaround || ADMINISTRATIVE_LOCKED_TURNAROUND;
    const name = customName || wizardState.customerName || 'Client';
    const notes = customNotes || wizardState.customerNotes || '';
    const isAdmin = isAdministrativeService(service);

    const pricing = calculateServicePrice(service, qty);

    const whatsappUrl = generateQuickServiceWhatsAppLink(
      service,
      qty,
      name,
      notes,
      turnaround
    );

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.85 }
      });
    } catch {
      // ignore
    }

    const summaryMsg: BotMessage = {
      id: `wizard_sum_${Date.now()}`,
      sender: 'bot',
      text: `🎉 **Votre Commande est Prête ! (Récapitulatif Officiel)**\n\n📌 **Service :** ${service.name}\n📊 **Quantité :** ${qty} ${service.unitLabel}\n👤 **Nom :** ${name}\n⏱️ **Délai :** ${turnaround.label} (${turnaround.hoursDetail})\n💰 **Montant Total :** **${formatFCFA(pricing.totalPrice)}**\n\n${isAdmin ? '⚖️ *Paiement de la demande requis • Reçu officiel immédiat dès paiement • Retrait au tribunal sous 72h.*' : '🛡️ *Paiement à la livraison après validation de l\'aperçu via lien Wave sécurisé.*'}\n\nVous pouvez valider directement sur WhatsApp ou l\'ajouter à votre panier sur le site :`,
      timestamp: new Date(),
      widgetType: 'order_summary',
      widgetData: {
        service,
        quantity: qty,
        pricing,
        turnaround,
        customerName: name,
        customerNotes: notes,
        whatsappUrl,
        isAdmin
      },
      quickReplies: [
        { id: 'w_act_open_modal', label: '📋 Ouvrir la fiche détaillée', action: 'open_service_detail', payload: service.id },
        { id: 'w_act_restart', label: '🔄 Configurer une autre commande', action: 'start_wizard' },
        { id: 'w_act_catalog', label: '👀 Voir tout le catalogue', action: 'scroll_catalog' }
      ]
    };

    setMessages(prev => [...prev, summaryMsg]);
    setWizardState(null);
  };

  // Intercept wizard actions from quick reply clicks
  const handleInterceptAction = (reply: BotQuickReply) => {
    if (reply.action === 'wizard_set_cat') {
      handleWizardSelectCategory(reply.payload);
      return;
    }
    if (reply.action === 'wizard_set_service') {
      handleWizardSelectService(reply.payload);
      return;
    }
    if (reply.action === 'wizard_set_qty') {
      handleWizardSetQuantity(reply.payload);
      return;
    }
    if (reply.action === 'wizard_set_turnaround') {
      handleWizardSetTurnaround(reply.payload);
      return;
    }
    if (reply.action === 'wizard_finish_order') {
      handleWizardFinish();
      return;
    }

    handleQuickAction(reply);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="smart-guide-bot-window"
        className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 w-full ${
          isMaximized 
            ? 'sm:w-[700px] h-[92vh] sm:h-[88vh] rounded-t-3xl sm:rounded-3xl' 
            : 'sm:w-[460px] h-[88vh] sm:h-[680px] rounded-t-3xl sm:rounded-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- HEADER --- */}
        <div className="bg-gradient-to-r from-[#0F52BA] via-slate-900 to-slate-950 text-white p-4 sm:p-5 flex items-center justify-between flex-shrink-0 relative border-b border-blue-900/50">
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF5E14] to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-950/30">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base font-['Outfit'] tracking-wide">
                  DEMS • Conseiller Virtuel
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  En ligne
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center space-x-1">
                <span>OKBW Bureautique & Design • Devis & Commande 24/7</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {/* Reset Chat */}
            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Réinitialiser la conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Maximize / Minimize toggle (Desktop) */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="hidden sm:inline-flex p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={isMaximized ? "Réduire la fenêtre" : "Agrandir la fenêtre"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              id="close-guide-bot-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Fermer le guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- NOTICE BAR: NO API REQUIRED & REAL TIME --- */}
        <div className="bg-blue-50 dark:bg-blue-950/60 border-b border-blue-100 dark:border-blue-900/40 px-4 py-1.5 flex items-center justify-between text-[11px] text-blue-900 dark:text-blue-200">
          <span className="flex items-center space-x-1 font-medium">
            <Zap className="w-3.5 h-3.5 text-[#FF5E14]" />
            <span>Moteur autonome instantané • Aucune clé API requise</span>
          </span>
          <span className="font-bold text-[#0F52BA] dark:text-blue-300">
            Contacts : 01 41 75 24 03
          </span>
        </div>

        {/* --- CHAT MESSAGES AREA --- */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div 
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0F52BA] text-white rounded-br-xs font-medium'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line">
                  {msg.text}
                </div>

                {/* --- EMBEDDED WIDGETS --- */}

                {/* 1. Service Card Widget */}
                {msg.widgetType === 'service_card' && msg.widgetData && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {msg.widgetData.service.name}
                      </span>
                      <span className="text-xs font-black text-[#0F52BA] dark:text-blue-400">
                        {formatFCFA(msg.widgetData.pricing.totalPrice)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => onOpenServiceModal(msg.widgetData.service)}
                        className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#0F52BA] dark:text-blue-300 font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Fiche détaillée</span>
                      </button>

                      <button
                        onClick={() => {
                          onAddToCart(msg.widgetData.service, msg.widgetData.quantity);
                          handleSendMessage(`J'ai ajouté "${msg.widgetData.service.name}" à mon panier !`);
                        }}
                        className="px-3 py-2 rounded-lg bg-[#FF5E14] hover:brightness-110 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Ajouter au panier</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Administrative Procedure Timeline Widget */}
                {msg.widgetType === 'admin_procedure' && (
                  <div className="mt-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/60 space-y-2 text-xs">
                    <div className="flex items-center space-x-1.5 font-bold text-[#FF5E14] dark:text-orange-300">
                      <Scale className="w-4 h-4" />
                      <span>Rappel du Protocole des Greffes</span>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                      <div className="flex items-start space-x-2">
                        <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">1</span>
                        <span><strong>Paiement obligatoire :</strong> Règlement des timbres fiscaux d'État à l'enregistrement.</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">2</span>
                        <span><strong>Reçu officiel IMMÉDIAT :</strong> Transmis dès confirmation du règlement.</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">3</span>
                        <span><strong>Retrait Document :</strong> Disponible au tribunal sous <strong>72h (3 jours)</strong>.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Quick Calculator Widget */}
                {msg.widgetType === 'quick_calculator' && msg.widgetData && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Volume sélectionné :</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {msg.widgetData.quantity} {msg.widgetData.service.unitLabel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Total estimé :</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        {formatFCFA(msg.widgetData.pricing.totalPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. Scenario Guide Widget */}
                {msg.widgetType === 'scenario_guide' && (
                  <div className="mt-3 space-y-2">
                    {CLIENT_SCENARIOS.map((sc) => (
                      <div 
                        key={sc.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#0F52BA] transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-[#0F52BA] dark:text-blue-400">
                            {sc.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                            {sc.delay}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {sc.desc}
                        </p>
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-[#FF5E14]">
                            {sc.recommendation}
                          </span>
                          <button
                            onClick={() => {
                              const s = SERVICES_DATA.find(srv => srv.id === sc.serviceIds[0]);
                              if (s) onOpenServiceModal(s);
                            }}
                            className="text-[11px] font-bold text-[#0F52BA] dark:text-blue-400 hover:underline flex items-center space-x-1"
                          >
                            <span>Détails</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. Document Checklist Widget */}
                {msg.widgetType === 'docs_checklist' && (
                  <div className="mt-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 space-y-2 text-xs">
                    <div className="flex items-center space-x-2 font-extrabold text-[#0F52BA] dark:text-blue-300">
                      <FileCheck2 className="w-4 h-4 text-[#FF5E14]" />
                      <span>Checklist de vos documents à transmettre</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span>Extrait de naissance original / copie lisible</span>
                        <span className="text-[10px] font-bold text-emerald-600">Photo / Scan</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span>CNI ou Passeport valide du demandeur</span>
                        <span className="text-[10px] font-bold text-emerald-600">Photo / Scan</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span>Lieu de naissance pour attribution du greffe</span>
                        <span className="text-[10px] font-bold text-blue-600">Texte WhatsApp</span>
                      </div>
                    </div>
                    <div className="pt-1 text-[10px] text-slate-500 dark:text-slate-400 italic">
                      *Envoyez simplement ces éléments par photo nette sur WhatsApp après avoir cliqué sur le bouton de commande.*
                    </div>
                  </div>
                )}

                {/* 6. Order Summary Widget */}
                {msg.widgetType === 'order_summary' && msg.widgetData && (
                  <div className="mt-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Message prêt à transmettre</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <a
                        href={msg.widgetData.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-950/20 transition-all text-center"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Valider et envoyer sur WhatsApp</span>
                      </a>

                      <button
                        onClick={() => {
                          onAddToCart(
                            msg.widgetData.service, 
                            msg.widgetData.quantity, 
                            msg.widgetData.customerNotes
                          );
                          handleSendMessage(`J'ai ajouté cette commande à mon panier.`);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#0F52BA] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Mettre au panier</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              {/* Quick Action Chips attached to this bot message */}
              {msg.sender === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                  {msg.quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleInterceptAction(reply)}
                      className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center space-x-1.5 transition-all text-left ${
                        reply.primary
                          ? 'bg-[#FF5E14] hover:brightness-110 text-white shadow-sm shadow-orange-500/20'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#0F52BA] dark:hover:border-blue-400 hover:text-[#0F52BA] dark:hover:text-blue-300'
                      }`}
                    >
                      <span>{reply.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-1">
              <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600 animate-pulse" />
              </div>
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* --- FOOTER INPUT BAR --- */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2 flex-shrink-0">
          
          {/* Quick suggestions pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase whitespace-nowrap pl-1">
              Suggestions :
            </span>
            <button
              onClick={() => handleSendMessage("Combien coûte la saisie de 60 pages ?")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 whitespace-nowrap text-[11px]"
            >
              📊 Devis Saisie 60p
            </button>
            <button
              onClick={() => handleSendMessage("Quelles sont les pièces pour le casier judiciaire ?")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 whitespace-nowrap text-[11px]"
            >
              ⚖️ Papiers Casier
            </button>
            <button
              onClick={() => handleSendMessage("Je veux créer un CV avec costume")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 whitespace-nowrap text-[11px]"
            >
              👔 CV Pro Costume
            </button>
            <button
              onClick={() => handleSendMessage("Comment payer par Wave ?")}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 whitespace-nowrap text-[11px]"
            >
              💳 Paiement Wave
            </button>
          </div>

          {/* Text Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Posez votre question ou demandez un devis..."
              className="flex-1 p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F52BA] transition-colors"
            />
            
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-xl bg-[#0F52BA] hover:bg-blue-600 disabled:opacity-40 text-white font-bold transition-all flex-shrink-0"
              aria-label="Envoyer le message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
