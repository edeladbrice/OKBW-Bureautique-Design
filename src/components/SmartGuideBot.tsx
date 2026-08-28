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
  Info,
  GraduationCap,
  Palette,
  Globe,
  FileEdit,
  School,
  CreditCard,
  Check,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ServiceItem, TurnaroundOption } from '../types';
import { SERVICES_DATA, CONTACT_INFO } from '../data/servicesData';
import { 
  calculateServicePrice, 
  formatFCFA, 
  TURNAROUND_OPTIONS, 
  ADMINISTRATIVE_LOCKED_TURNAROUND, 
  isAdministrativeService,
  buildWhatsAppFormattedMessage,
  PRIMARY_WHATSAPP_NUMBER,
  DISPLAY_CONTACTS
} from '../utils/pricing';
import { 
  BotMessage, 
  BotQuickReply, 
  GREETING_MESSAGE, 
  INITIAL_POLE_REPLIES, 
  processUserQuery, 
  POLES_CONFIG,
  DecisionTreeStep,
  CLIENT_SCENARIOS,
  buildStateOrderWhatsAppUrl
} from '../utils/guideBotEngine';

interface SmartGuideBotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenServiceModal: (service: ServiceItem) => void;
  onOpenCalculatorModal: (serviceId?: string) => void;
  onAddToCart: (service: ServiceItem, quantity: number, notes?: string) => void;
  onScrollToCatalog: () => void;
  initialQuery?: string;
  initialTopic?: string;
}

interface TreeState {
  step: DecisionTreeStep;
  poleId?: string;
  service?: ServiceItem;
  quantity: number;
  specialDetail?: string;
  customerName?: string;
  totalPrice?: number;
  unitPrice?: number;
  savings?: number;
  ruleApplied?: string;
}

export const SmartGuideBot: React.FC<SmartGuideBotProps> = ({
  isOpen,
  onClose,
  onOpenServiceModal,
  onOpenCalculatorModal,
  onAddToCart,
  onScrollToCatalog,
  initialQuery,
  initialTopic
}) => {
  const [messages, setMessages] = useState<BotMessage[]>([GREETING_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [treeState, setTreeState] = useState<TreeState | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastProcessedRef = useRef<string | undefined>(undefined);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);

      const triggerKey = initialTopic || initialQuery;
      if (triggerKey && triggerKey !== lastProcessedRef.current) {
        lastProcessedRef.current = triggerKey;
        
        // If topic matches a pole
        const matchingPole = POLES_CONFIG.find(p => p.id === triggerKey || p.services.includes(triggerKey));
        if (matchingPole) {
          if (matchingPole.services.includes(triggerKey)) {
            handleSelectServiceDirect(triggerKey);
          } else {
            handleSelectPole(matchingPole.id);
          }
        } else if (initialQuery) {
          setTimeout(() => handleSendMessage(initialQuery), 200);
        }
      }
    } else {
      lastProcessedRef.current = undefined;
    }
  }, [isOpen, initialQuery, initialTopic]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, treeState]);

  // Restart chat / Reset State Machine
  const handleResetChat = () => {
    setTreeState(null);
    setMessages([
      {
        ...GREETING_MESSAGE,
        id: `msg_reset_${Date.now()}`,
        timestamp: new Date()
      }
    ]);
  };

  // --- STATE MACHINE TRANSITIONS ---

  // 1. ÉTAPE 1 : Choix du Pôle
  const handleSelectPole = (poleId: string) => {
    const pole = POLES_CONFIG.find(p => p.id === poleId);
    if (!pole) return;

    setTreeState({
      step: 'SERVICE_SELECT',
      poleId: pole.id,
      quantity: 1
    });

    const poleServices = SERVICES_DATA.filter(s => pole.services.includes(s.id));

    // Special custom labels per requested design
    const nextMsg: BotMessage = {
      id: `bot_pole_${Date.now()}`,
      sender: 'bot',
      text: `📂 Pôle sélectionné : ${pole.label}\n\nQuel service souhaitez-vous commander ? Choisissez parmi les options ci-dessous :`,
      timestamp: new Date(),
      quickReplies: poleServices.map(s => {
        let label = `${s.name} (${s.priceDisplay})`;
        if (s.id === 'cv-premium') label = 'CV Pro (1 000 F)';
        if (s.id === 'cv-standard') label = 'CV Standard (500 F)';
        if (s.id === 'saisie-texte') label = 'Saisie de texte & Mémoires';
        if (s.id === 'lettre-motivation') label = 'Lettre de motivation (500 F)';
        if (s.id === 'presentation-powerpoint') label = 'PowerPoint (2 500 F)';
        if (s.id === 'modification-pdf') label = 'Modification de PDF';
        if (s.id === 'conversion-simple') label = 'Conversion simple (250 F)';
        if (s.id === 'conversion-correction') label = 'Conversion + Correction';
        if (s.id === 'retouche-photo') label = 'Retouche Photo';
        if (s.id === 'creation-affiche') label = 'Création d\'Affiche';
        if (s.id === 'creation-logo') label = 'Création de Logo (3 500 F)';
        if (s.id === 'carte-de-visite') label = 'Carte de Visite (2 000 F)';
        if (s.id === 'web-vitrine') label = 'Site Vitrine 1 page (35 000 F)';
        if (s.id === 'web-multipage') label = 'Site E-commerce / Multi-pages (75 000 F)';
        if (s.id === 'app-pwa') label = 'Application Mobile (60 000 F)';
        if (s.id === 'app-sur-mesure') label = 'Dépannage / Projet sur-mesure';
        if (s.id === 'inscription-privee') label = 'Établissement Privé / Semi-Privé (3 500 F)';
        if (s.id === 'inscription-publique') label = 'Établissement Public & MENA (6 500 F)';
        if (s.id === 'pack-nationalite-casier') label = 'Pack Duo Nationalité + Casier (6 500 F)';
        if (s.id === 'certificat-nationalite') label = 'Certificat de Nationalité (3 500 F)';
        if (s.id === 'casier-judiciaire') label = 'Casier Judiciaire (3 500 F)';

        return {
          id: `srv_${s.id}`,
          label,
          action: 'select_service',
          payload: s.id,
          primary: s.recommended
        };
      })
    };

    setMessages(prev => [...prev, nextMsg]);
  };

  // 2. ÉTAPE 2 : Choix du Service & Branche de Questions
  const handleSelectService = (serviceId: string) => {
    const service = SERVICES_DATA.find(s => s.id === serviceId);
    if (!service) return;

    // Determine initial quantity and state step according to branch
    let initialQty = 1;
    let nextStep: DecisionTreeStep = 'QUANTITY_SELECT';
    let questionText = '';
    let quickReplies: BotQuickReply[] = [];

    // --- BRANCHE 1 : BUREAUTIQUE & DOCUMENTS ---
    if (service.id === 'saisie-texte') {
      initialQty = 25;
      nextStep = 'QUANTITY_SELECT';
      questionText = `📄 Saisie de texte & Mémoires\n\nCombien de pages comporte votre document manuscrit ou texte ?\n\n(Le tarif dégressif s'applique automatiquement : 250 F/page, ou 200 F/page au-delà de 50 pages).`;
      quickReplies = [
        { id: 'qty_10', label: '10 pages (2 500 F)', action: 'set_quantity', payload: 10 },
        { id: 'qty_25', label: '25 pages (6 250 F)', action: 'set_quantity', payload: 25 },
        { id: 'qty_50', label: '50 pages (12 500 F)', action: 'set_quantity', payload: 50 },
        { id: 'qty_75', label: '75 pages (15 000 F - Promo 200F)', action: 'set_quantity', payload: 75, primary: true },
        { id: 'qty_100', label: '100 pages (20 000 F - Promo 200F)', action: 'set_quantity', payload: 100, primary: true }
      ];
    } else if (service.id === 'presentation-powerpoint') {
      initialQty = 1;
      nextStep = 'QUANTITY_SELECT';
      questionText = `📊 Diaporama PowerPoint (Soutenance / Pro)\n\nCombien de diapositives souhaitez-vous ?\n\n(Le forfait de base à 2 500 F couvre jusqu'à 15 diapositives complètes avec mise en page et transitions).`;
      quickReplies = [
        { id: 'ppt_15', label: 'Jusqu\'à 15 slides (2 500 F)', action: 'set_quantity', payload: 1, primary: true },
        { id: 'ppt_20', label: '16 à 25 slides (3 500 F)', action: 'set_quantity_custom_price', payload: { qty: 1, price: 3500, detail: '16 à 25 diapositives' } },
        { id: 'ppt_35', label: '26 à 40 slides (5 000 F)', action: 'set_quantity_custom_price', payload: { qty: 1, price: 5000, detail: '26 à 40 diapositives' } }
      ];
    } else if (service.id === 'cv-premium' || service.id === 'cv-standard' || service.id === 'lettre-motivation') {
      initialQty = 1;
      nextStep = 'SPECIAL_PROMPT';
      const isPremium = service.id === 'cv-premium';
      questionText = `💼 ${service.name}\n\nTarif : ${service.priceDisplay}${isPremium ? '\n✨ Inclus : Design moderne + Costume virtuel sur votre photo + Fond blanc net.' : ''}\n\nAvez-vous des précisions sur votre profil ou domaine d'activité ?`;
      quickReplies = [
        { id: 'cv_std_direct', label: '🚀 Profil standard / Candidature générale', action: 'set_special_detail', payload: 'Candidature générale', primary: true },
        { id: 'cv_cadre', label: '👔 Profil Cadre / Gestion / Finance', action: 'set_special_detail', payload: 'Poste Cadre / Management' },
        { id: 'cv_tech', label: '💻 Profil Technique / Informatique / Ingénierie', action: 'set_special_detail', payload: 'Profil Technique / IT' },
        { id: 'cv_pass', label: 'Passer cette précision', action: 'set_special_detail', payload: 'Prestation standard' }
      ];
    } 

    // --- BRANCHE 2 : SOLUTIONS PDF & CONVERSION ---
    else if (service.id === 'modification-pdf' || service.id === 'conversion-correction') {
      initialQty = 1;
      nextStep = 'QUANTITY_SELECT';
      const isModif = service.id === 'modification-pdf';
      questionText = `📝 ${service.name}\n\nCombien de pages / documents avez-vous à traiter ?\n\n(Tarifs dégressifs appliqués en direct : ${isModif ? '500 F (1-4p), 250 F (5-9p), 150 F (10+p)' : '500 F (1-4u), 250 F (5-19u), 200 F (20-29u), 150 F (30-39u)'})`;
      quickReplies = [
        { id: 'pdf_1', label: '1 page / document (500 F)', action: 'set_quantity', payload: 1 },
        { id: 'pdf_3', label: '3 pages (1 500 F)', action: 'set_quantity', payload: 3 },
        { id: 'pdf_5', label: '5 pages (1 250 F - 250F/p)', action: 'set_quantity', payload: 5, primary: true },
        { id: 'pdf_10', label: '10 pages (1 500 F - 150F/p)', action: 'set_quantity', payload: 10, primary: true },
        { id: 'pdf_20', label: '20 pages (3 000 F - 150F/p)', action: 'set_quantity', payload: 20 }
      ];
    } else if (service.id === 'conversion-simple') {
      initialQty = 1;
      nextStep = 'QUANTITY_SELECT';
      questionText = `🔄 Conversion simple (PDF ↔ Word/Excel)\n\nCombien de fichiers souhaitez-vous convertir ? (250 F par document)`;
      quickReplies = [
        { id: 'conv_1', label: '1 document (250 F)', action: 'set_quantity', payload: 1, primary: true },
        { id: 'conv_2', label: '2 documents (500 F)', action: 'set_quantity', payload: 2 },
        { id: 'conv_4', label: '4 documents (1 000 F)', action: 'set_quantity', payload: 4 }
      ];
    }

    // --- BRANCHE 3 : DESIGN & IMAGE ---
    else if (service.id === 'retouche-photo') {
      initialQty = 5;
      nextStep = 'QUANTITY_SELECT';
      questionText = `🎨 Retouche & Restauration Photo\n\nCombien de visuels souhaitez-vous restaurer ?\n\n(Packs dégressifs : 1 500 F le pack 5 photos, 300 F/photo de 6 à 9, 250 F/photo dès 10 photos).`;
      quickReplies = [
        { id: 'ret_5', label: 'Pack 5 photos (1 500 F forfaitaire)', action: 'set_quantity', payload: 5, primary: true },
        { id: 'ret_8', label: '8 photos (2 400 F - 300F/u)', action: 'set_quantity', payload: 8 },
        { id: 'ret_10', label: '10 photos (2 500 F - 250F/u)', action: 'set_quantity', payload: 10, primary: true },
        { id: 'ret_15', label: '15 photos (3 750 F - 250F/u)', action: 'set_quantity', payload: 15 }
      ];
    } else if (service.id === 'creation-affiche') {
      initialQty = 1;
      nextStep = 'QUANTITY_SELECT';
      questionText = `🎨 Création d'Affiche (Pub / Événement)\n\nCombien de visuels souhaitez-vous ?\n\n(Tarifs : 1 affiche = 2 500 F | Pack 3 affiches = 3 000 F (1 000 F/u) | Pack 10 affiches = 5 000 F (500 F/u)).`;
      quickReplies = [
        { id: 'aff_1', label: '1 affiche (2 500 F)', action: 'set_quantity', payload: 1 },
        { id: 'aff_3', label: 'Pack 3 affiches (3 000 F - 1 000F/u)', action: 'set_quantity', payload: 3, primary: true },
        { id: 'aff_5', label: 'Pack 5 affiches (5 000 F)', action: 'set_quantity', payload: 5 },
        { id: 'aff_10', label: 'Pack 10 affiches (5 000 F - 500F/u)', action: 'set_quantity', payload: 10, primary: true }
      ];
    } else if (service.id === 'creation-logo') {
      initialQty = 1;
      nextStep = 'SPECIAL_PROMPT';
      questionText = `🎨 Création de Logo Sur-Mesure (3 500 F)\n\nQuel est le nom de votre entreprise/projet et votre secteur d'activité ?\n\n(Indiquez-le ci-dessous ou sélectionnez une suggestion rapide).`;
      quickReplies = [
        { id: 'logo_com', label: 'Boutique / E-commerce / Vente', action: 'set_special_detail', payload: 'Boutique / Commerce' },
        { id: 'logo_resto', label: 'Restaurant / Agroalimentaire / Food', action: 'set_special_detail', payload: 'Restauration / Alimentation' },
        { id: 'logo_serv', label: 'Prestation de Services / BTP / Agence', action: 'set_special_detail', payload: 'Prestations de Services' },
        { id: 'logo_custom', label: 'Je tape mon nom & secteur dans le chat', action: 'focus_input' }
      ];
    } else if (service.id === 'carte-de-visite') {
      initialQty = 1;
      nextStep = 'QUANTITY_SELECT';
      questionText = `💳 Design Carte de Visite (2 000 F)\n\nCombien de déclinaisons ou modèles de cartes de visite souhaitez-vous ?`;
      quickReplies = [
        { id: 'cdv_1', label: '1 modèle Recto/Verso (2 000 F)', action: 'set_quantity', payload: 1, primary: true },
        { id: 'cdv_2', label: '2 modèles / collaborateurs (4 000 F)', action: 'set_quantity', payload: 2 },
        { id: 'cdv_4', label: '4 modèles / collaborateurs (8 000 F)', action: 'set_quantity', payload: 4 }
      ];
    }

    // --- BRANCHE 4 : DÉVELOPPEMENT WEB & APPS ---
    else if (service.category === 'web') {
      initialQty = 1;
      nextStep = 'SPECIAL_PROMPT';
      questionText = `💻 ${service.name} (${service.priceDisplay})\n\nDécrivez brièvement votre projet ou votre besoin (type d'activité, fonctionnalités nécessaires, délais).`;
      quickReplies = [
        { id: 'web_pres', label: 'Présentation d\'activité & Contact WhatsApp', action: 'set_special_detail', payload: 'Site vitrine entreprise avec WhatsApp', primary: true },
        { id: 'web_shop', label: 'Boutique en ligne avec paiement Wave & Mobile Money', action: 'set_special_detail', payload: 'E-commerce Wave / MoMo' },
        { id: 'web_pwa', label: 'Application mobile installable pour clients', action: 'set_special_detail', payload: 'Application mobile PWA' },
        { id: 'web_desc', label: 'Je décris mon projet dans le chat', action: 'focus_input' }
      ];
    }

    // --- BRANCHE 5 : INSCRIPTION EN LIGNE SCOLAIRE ---
    else if (service.category === 'scolaire') {
      initialQty = 1;
      nextStep = 'SPECIAL_PROMPT';
      questionText = `🎓 ${service.name}\n\nTarif fixe : ${service.priceDisplay} pour tout niveau secondaire (6ème à Tle).\n\nPour quelle classe (de la 6ème à la Tle) et quel établissement souhaitez-vous faire l'inscription ?`;
      quickReplies = [
        { id: 'scol_col_6_5', label: 'Collège : 6ème / 5ème', action: 'set_special_detail', payload: 'Collège (6ème / 5ème)', primary: true },
        { id: 'scol_col_4_3', label: 'Collège : 4ème / 3ème', action: 'set_special_detail', payload: 'Collège (4ème / 3ème)' },
        { id: 'scol_lyc_2_1', label: 'Lycée : 2nde / 1ère', action: 'set_special_detail', payload: 'Lycée (2nde / 1ère)' },
        { id: 'scol_lyc_tle', label: 'Lycée : Terminale', action: 'set_special_detail', payload: 'Lycée (Terminale)', primary: true },
        { id: 'scol_prec', label: 'Préciser mon établissement & classe dans le chat', action: 'focus_input' }
      ];
    }

    // --- BRANCHE 6 : ACTES JUDICIAIRES (CASIER / NATIONALITÉ) ---
    else if (isAdministrativeService(service)) {
      initialQty = 1;
      nextStep = 'CUSTOMER_NAME';
      questionText = `⚖️ ${service.name}\n\nTarif officiel : ${service.priceDisplay}\n\n🏛️ Procédure légale officielle :\n1️⃣ Règlement de la demande requis à l'enregistrement pour les timbres fiscaux d'État.\n2️⃣ Reçu officiel immédiat dès confirmation.\n3️⃣ Retrait physique du document original au tribunal sous 72h (3 jours ouvrés).\n\nQuel est votre Nom & Prénom (demandeur) ?`;
      quickReplies = [
        { id: 'adm_enter_name', label: 'Indiquer mon nom & prénom dans le chat', action: 'focus_input', primary: true }
      ];
    }

    // Default calculations
    const pricing = calculateServicePrice(service, initialQty);

    setTreeState({
      step: nextStep,
      service,
      quantity: initialQty,
      totalPrice: pricing.totalPrice,
      unitPrice: pricing.unitPrice,
      savings: pricing.savings,
      ruleApplied: pricing.ruleApplied
    });

    const nextMsg: BotMessage = {
      id: `bot_q_${Date.now()}`,
      sender: 'bot',
      text: questionText,
      timestamp: new Date(),
      quickReplies
    };

    setMessages(prev => [...prev, nextMsg]);
  };

  // Direct service selection from shortcuts
  const handleSelectServiceDirect = (serviceId: string) => {
    handleSelectService(serviceId);
  };

  // 3. Traitement de la Quantité
  const handleSetQuantity = (qty: number) => {
    if (!treeState?.service) return;
    const service = treeState.service;
    const pricing = calculateServicePrice(service, qty);

    setTreeState(prev => ({
      ...prev!,
      quantity: qty,
      totalPrice: pricing.totalPrice,
      unitPrice: pricing.unitPrice,
      savings: pricing.savings,
      ruleApplied: pricing.ruleApplied
    }));

    // If PDF service, ask for special instructions before customer name
    if (service.id === 'modification-pdf' || service.id === 'conversion-correction') {
      setTreeState(prev => ({ ...prev!, step: 'SPECIAL_PROMPT' }));

      const nextMsg: BotMessage = {
        id: `bot_inst_${Date.now()}`,
        sender: 'bot',
        text: `💰 Montant calculé pour ${qty} ${service.unitLabel} : ${formatFCFA(pricing.totalPrice)}\n\nAvez-vous des consignes particulières (ex: changer une date, corriger un nom, retoucher des pages) ?`,
        timestamp: new Date(),
        quickReplies: [
          { id: 'inst_none', label: 'Aucune consigne particulière / Standard', action: 'set_special_detail', payload: 'Standard / sans consigne spéciale', primary: true },
          { id: 'inst_date', label: 'Changement de date & noms', action: 'set_special_detail', payload: 'Changer date et noms' },
          { id: 'inst_text', label: 'Correction de textes & chiffres', action: 'set_special_detail', payload: 'Correction textes et montants' },
          { id: 'inst_chat', label: 'Je saisis mes consignes dans le chat', action: 'focus_input' }
        ]
      };
      setMessages(prev => [...prev, nextMsg]);
      return;
    }

    // Otherwise move directly to customer name
    setTreeState(prev => ({ ...prev!, step: 'CUSTOMER_NAME' }));

    const nextMsg: BotMessage = {
      id: `bot_name_ask_${Date.now()}`,
      sender: 'bot',
      text: `💰 Montant estimé pour ${qty} ${service.unitLabel} : ${formatFCFA(pricing.totalPrice)}${pricing.savings ? `\n🎉 Économie appliquée : ${formatFCFA(pricing.savings)}` : ''}\n\nQuel est votre Nom & Prénom pour préparer votre commande ?`,
      timestamp: new Date(),
      quickReplies: [
        { id: 'name_input_prompt', label: 'Taper mon nom et prénom ci-dessous', action: 'focus_input', primary: true }
      ]
    };
    setMessages(prev => [...prev, nextMsg]);
  };

  // Custom price / quantity setter (e.g. for PowerPoint packages)
  const handleSetQuantityCustomPrice = (payload: { qty: number; price: number; detail: string }) => {
    if (!treeState?.service) return;
    const service = treeState.service;

    setTreeState(prev => ({
      ...prev!,
      quantity: payload.qty,
      totalPrice: payload.price,
      unitPrice: payload.price,
      specialDetail: payload.detail,
      step: 'CUSTOMER_NAME'
    }));

    const nextMsg: BotMessage = {
      id: `bot_custom_p_${Date.now()}`,
      sender: 'bot',
      text: `💰 Option choisie : ${payload.detail} — Montant : ${formatFCFA(payload.price)}\n\nQuel est votre Nom & Prénom ?`,
      timestamp: new Date(),
      quickReplies: [
        { id: 'name_input_prompt_2', label: 'Taper mon nom et prénom ci-dessous', action: 'focus_input', primary: true }
      ]
    };
    setMessages(prev => [...prev, nextMsg]);
  };

  // 4. Traitement des Précisions & Consignes
  const handleSetSpecialDetail = (detail: string) => {
    setTreeState(prev => ({
      ...prev!,
      specialDetail: detail,
      step: 'CUSTOMER_NAME'
    }));

    const nextMsg: BotMessage = {
      id: `bot_name_ask_det_${Date.now()}`,
      sender: 'bot',
      text: `✅ Consigne enregistrée : "${detail}"\n\nQuel est votre Nom & Prénom ?`,
      timestamp: new Date(),
      quickReplies: [
        { id: 'name_prompt_3', label: 'Taper mon nom et prénom ci-dessous', action: 'focus_input', primary: true }
      ]
    };
    setMessages(prev => [...prev, nextMsg]);
  };

  // 5. Finalisation & Génération de la Synthèse WhatsApp (ÉTAPE 3)
  const handleCompleteOrder = (customerName: string) => {
    if (!treeState?.service) return;
    const service = treeState.service;
    const qty = treeState.quantity || 1;
    const finalName = customerName.trim() || 'Client';
    const instructions = treeState.specialDetail || 'Prestation standard';
    const isAdm = isAdministrativeService(service);

    const pricing = calculateServicePrice(service, qty);
    const totalPrice = treeState.totalPrice || pricing.totalPrice;

    const whatsappUrl = buildStateOrderWhatsAppUrl({
      service,
      quantity: qty,
      customerName: finalName,
      instructions,
      totalPrice
    });

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }

    const nextTreeState: TreeState = {
      ...treeState,
      customerName: finalName,
      totalPrice,
      step: 'ORDER_SUMMARY'
    };
    setTreeState(nextTreeState);

    const summaryText = `Parfait ! Voici le récapitulatif de votre commande :

• Service : ${service.name}
• Quantité : ${qty} ${service.unitLabel}
• Nom du client : ${finalName}
• Instructions : ${instructions}
• Total estimé : ${formatFCFA(totalPrice)}

Cliquez sur le bouton ci-dessous pour m'envoyer ces informations sur WhatsApp et joindre vos fichiers !`;

    const summaryMsg: BotMessage = {
      id: `bot_summary_${Date.now()}`,
      sender: 'bot',
      text: summaryText,
      timestamp: new Date(),
      widgetType: 'order_summary',
      widgetData: {
        service,
        quantity: qty,
        customerName: finalName,
        instructions,
        totalPrice,
        whatsappUrl,
        isAdministrative: isAdm
      },
      quickReplies: [
        { id: 'restart_tree', label: '🔄 Passer une autre commande', action: 'restart_bot' },
        { id: 'see_catalog', label: '👀 Voir le catalogue complet', action: 'scroll_catalog' }
      ]
    };

    setMessages(prev => [...prev, summaryMsg]);
  };

  // Envoi de message utilisateur libre ou gestion des étapes de texte
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

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
      // If state machine is waiting for Customer Name
      if (treeState && treeState.step === 'CUSTOMER_NAME') {
        handleCompleteOrder(query);
        setIsTyping(false);
        return;
      }

      // If state machine is waiting for Special prompt / detail
      if (treeState && treeState.step === 'SPECIAL_PROMPT') {
        handleSetSpecialDetail(query);
        setIsTyping(false);
        return;
      }

      // If state machine is waiting for quantity and user typed a number
      if (treeState && treeState.step === 'QUANTITY_SELECT') {
        const num = parseInt(query.replace(/\D/g, ''), 10);
        if (!isNaN(num) && num > 0) {
          handleSetQuantity(num);
          setIsTyping(false);
          return;
        }
      }

      // Freeform processor
      const botResponse = processUserQuery(query);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 350);
  };

  // Dispatch Quick Reply Clicks
  const handleQuickAction = (reply: BotQuickReply) => {
    if (reply.action === 'select_pole') {
      handleSelectPole(reply.payload);
      return;
    }

    if (reply.action === 'select_service') {
      handleSelectService(reply.payload);
      return;
    }

    if (reply.action === 'select_service_direct') {
      handleSelectServiceDirect(reply.payload);
      return;
    }

    if (reply.action === 'set_quantity') {
      handleSetQuantity(reply.payload);
      return;
    }

    if (reply.action === 'set_quantity_custom_price') {
      handleSetQuantityCustomPrice(reply.payload);
      return;
    }

    if (reply.action === 'set_special_detail') {
      handleSetSpecialDetail(reply.payload);
      return;
    }

    if (reply.action === 'focus_input') {
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    if (reply.action === 'restart_bot') {
      handleResetChat();
      return;
    }

    if (reply.action === 'show_poles') {
      handleResetChat();
      return;
    }

    if (reply.action === 'scroll_catalog') {
      onScrollToCatalog();
      onClose();
      return;
    }

    if (reply.action === 'open_calc_modal') {
      onOpenCalculatorModal(reply.payload);
      return;
    }

    if (reply.action === 'contact_advisor') {
      window.open(CONTACT_INFO.whatsappUrl, '_blank');
      return;
    }

    // Default: send text
    handleSendMessage(reply.label);
  };

  if (!isOpen) return null;

  return (
    <div 
      id="smart-guide-bot-modal" 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bot-header-title"
    >
      <div 
        className={`bg-white dark:bg-[#0F172A] w-full ${isMaximized ? 'max-w-4xl h-[94vh]' : 'max-w-xl h-[88vh] max-h-[720px]'} rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300`}
      >
        {/* Top App Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#0A2540] via-[#0F52BA] to-[#0A2540] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-blue-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 id="bot-header-title" className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                  DEMS
                  <span className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-full font-medium uppercase tracking-wider text-amber-300">
                    Assistant Virtuel
                  </span>
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-blue-100/90 flex items-center gap-1">
                <span>Guide de Commande Direct WhatsApp</span>
                <span className="inline-block w-1 h-1 rounded-full bg-blue-300" />
                <span className="text-amber-300 font-medium">OKBW Bureautique & Design</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              id="btn-bot-reset"
              onClick={handleResetChat}
              title="Recommencer la discussion"
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              id="btn-bot-maximize"
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? "Réduire" : "Agrandir"}
              className="hidden sm:inline-flex p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              id="btn-bot-close"
              onClick={onClose}
              title="Fermer le Bot"
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* State Machine Progress Bar */}
        {treeState && treeState.step !== 'ORDER_SUMMARY' && (
          <div className="bg-blue-50 dark:bg-blue-950/40 px-4 py-2 border-b border-blue-100 dark:border-blue-900/30 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
            <div className="flex items-center space-x-2">
              <span className="font-semibold px-2 py-0.5 bg-blue-600 text-white rounded-md text-[10px]">
                {treeState.step === 'SERVICE_SELECT' && 'Étape 2/3 : Choix du Service'}
                {treeState.step === 'QUANTITY_SELECT' && 'Étape 2/3 : Volume / Pages'}
                {treeState.step === 'SPECIAL_PROMPT' && 'Étape 2/3 : Consignes & Détails'}
                {treeState.step === 'CUSTOMER_NAME' && 'Étape 3/3 : Nom & Coordonnées'}
              </span>
              {treeState.service && (
                <span className="truncate max-w-[200px] font-medium text-slate-700 dark:text-slate-300">
                  {treeState.service.name}
                </span>
              )}
            </div>
            {treeState.totalPrice && treeState.totalPrice > 0 && (
              <span className="font-bold text-orange-600 dark:text-orange-400">
                {formatFCFA(treeState.totalPrice)}
              </span>
            )}
          </div>
        )}

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-[#0B1320]/50">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div 
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/10' 
                    : 'bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-none shadow-slate-200/50 dark:shadow-none'
                }`}
              >
                <div className="whitespace-pre-line break-words">
                  {msg.text}
                </div>

                {/* Special Summary Card Widget */}
                {msg.widgetType === 'order_summary' && msg.widgetData && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-orange-50/50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200 dark:border-slate-700">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Ticket de Commande</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full font-bold">
                        Prêt à envoyer
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Prestation :</span>
                        <span className="font-semibold text-right">{msg.widgetData.service?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Quantité :</span>
                        <span className="font-semibold">{msg.widgetData.quantity} {msg.widgetData.service?.unitLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Client :</span>
                        <span className="font-semibold">{msg.widgetData.customerName}</span>
                      </div>
                      {msg.widgetData.instructions && (
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-500 dark:text-slate-400 shrink-0">Consignes :</span>
                          <span className="font-medium text-right text-slate-600 dark:text-slate-300">{msg.widgetData.instructions}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-bold text-blue-950 dark:text-white">
                        <span>Total estimé :</span>
                        <span className="text-base text-orange-600 dark:text-orange-400">{formatFCFA(msg.widgetData.totalPrice)}</span>
                      </div>
                    </div>

                    {/* Direct WhatsApp CTA Button */}
                    <div className="mt-4 pt-2">
                      <a
                        id="btn-whatsapp-order-confirm"
                        href={msg.widgetData.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5"
                      >
                        <MessageSquare className="w-5 h-5 fill-white/20" />
                        <span>Valider et envoyer sur WhatsApp</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </a>

                      <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
                        📱 Ouvre votre discussion WhatsApp avec le message structuré pré-rempli.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Reply Action Buttons */}
              {msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1 max-w-[95%]">
                  {msg.quickReplies.map((reply) => (
                    <button
                      key={reply.id}
                      id={`btn-reply-${reply.id}`}
                      onClick={() => handleQuickAction(reply)}
                      className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 flex items-center space-x-1.5 shadow-sm text-left ${
                        reply.primary
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 border border-orange-400/30'
                          : 'bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30'
                      }`}
                    >
                      {reply.action === 'select_pole' && <ChevronRight className="w-3.5 h-3.5 text-orange-500" />}
                      <span>{reply.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 text-xs p-2">
              <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <span>DEMS prépare votre réponse...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              ref={inputRef}
              id="bot-user-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                treeState?.step === 'CUSTOMER_NAME'
                  ? 'Tapez votre Nom & Prénom ici...'
                  : treeState?.step === 'SPECIAL_PROMPT'
                  ? 'Décrivez votre besoin ou précisions...'
                  : treeState?.step === 'QUANTITY_SELECT'
                  ? 'Indiquez le nombre de pages ou unités...'
                  : 'Posez une question ou décrivez votre projet...'
              }
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              id="btn-bot-send"
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 sm:px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1.5 shadow-md shadow-blue-600/20"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Envoyer</span>
            </button>
          </form>

          {/* Quick Helper Subtext */}
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
            <span>Direct WhatsApp : <strong>{CONTACT_INFO.whatsappNumber}</strong></span>
            <span>Règlement sécurisé Wave & Mobile Money</span>
          </div>
        </div>
      </div>
    </div>
  );
};
