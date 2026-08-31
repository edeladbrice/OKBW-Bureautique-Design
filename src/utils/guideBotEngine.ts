import { ServiceItem, TurnaroundOption } from '../types';
import { SERVICES_DATA, CONTACT_INFO } from '../data/servicesData';
import { 
  calculateServicePrice, 
  formatFCFA, 
  TURNAROUND_OPTIONS, 
  ADMINISTRATIVE_LOCKED_TURNAROUND, 
  isAdministrativeService,
  buildWhatsAppFormattedMessage,
  PRIMARY_WHATSAPP_NUMBER
} from './pricing';

export interface BotQuickReply {
  id: string;
  label: string;
  action: string;
  payload?: any;
  icon?: string;
  primary?: boolean;
}

export interface BotMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  quickReplies?: BotQuickReply[];
  widgetType?: 'service_card' | 'quick_calculator' | 'admin_procedure' | 'step_wizard' | 'order_summary' | 'faq_list' | 'tribunal_checker' | 'docs_checklist' | 'scenario_guide';
  widgetData?: any;
}

export type DecisionTreeStep = 
  | 'POLE_SELECT'
  | 'SERVICE_SELECT'
  | 'QUANTITY_SELECT'
  | 'SPECIAL_PROMPT'
  | 'CUSTOMER_NAME'
  | 'ORDER_SUMMARY';

export interface DecisionTreeState {
  step: DecisionTreeStep;
  poleId?: string;
  service?: ServiceItem;
  quantity: number;
  specialDetail?: string;
  customerName?: string;
  turnaround?: TurnaroundOption;
  totalPrice?: number;
}

export interface StepWizardState {
  step: 'category' | 'service' | 'quantity' | 'turnaround' | 'details' | 'summary';
  selectedCategory?: string;
  selectedService?: ServiceItem;
  quantity: number;
  selectedTurnaround?: TurnaroundOption;
  customerName?: string;
  customerNotes?: string;
}

export const POLES_CONFIG = [
  {
    id: 'pole_bureau',
    label: '📄 Bureautique & Documents',
    description: 'CV Pros, Saisie de mémoires, Lettres & PowerPoints',
    icon: 'FileText',
    services: ['cv-premium', 'cv-standard', 'saisie-texte', 'lettre-motivation', 'presentation-powerpoint']
  },
  {
    id: 'pole_pdf',
    label: '📝 Solutions PDF & Conversion',
    description: 'Modifications sans trace, conversions Word/Excel & corrections',
    icon: 'FileEdit',
    services: ['modification-pdf', 'conversion-simple', 'conversion-correction']
  },
  {
    id: 'pole_design',
    label: '🎨 Design & Image',
    description: 'Logos sur-mesure, Affiches pub, Retouches photo & Cartes de visite',
    icon: 'Palette',
    services: ['retouche-photo', 'creation-affiche', 'creation-logo', 'carte-de-visite']
  },
  {
    id: 'pole_web',
    label: '💻 Développement Web & Apps',
    description: 'Sites vitrines, E-commerce, Applications mobiles & sur-mesure',
    icon: 'Globe',
    services: ['web-vitrine', 'web-multipage', 'app-pwa', 'app-sur-mesure']
  },
  {
    id: 'pole_scolaire',
    label: '🎓 Inscription en Ligne (6ème à Tle)',
    description: 'Inscriptions en ligne secondaire : privé (3 500 F), public MENA (6 500 F)',
    icon: 'GraduationCap',
    services: ['inscription-privee', 'inscription-publique']
  },
  {
    id: 'pole_admin',
    label: '⚖️ Actes Judiciaires (72h)',
    description: 'Casier Judiciaire & Certificat de Nationalité officiel au tribunal',
    icon: 'Scale',
    services: ['certificat-nationalite', 'casier-judiciaire', 'pack-nationalite-casier']
  }
];

export const IVORIAN_TRIBUNALS = [
  { name: 'Tribunal de Première Instance d\'Abidjan - Plateau', delay: '72h ouvrées', stamp: 'Timbre d\'État inclus' },
  { name: 'Section de Tribunal de Yopougon', delay: '72h ouvrées', stamp: 'Timbre d\'État inclus' },
  { name: 'Tribunal de Première Instance de Bouaké', delay: '72h ouvrées', stamp: 'Timbre d\'État inclus' },
  { name: 'Section de Tribunal de Daloa', delay: '72h ouvrées', stamp: 'Timbre d\'État inclus' },
  { name: 'Section de Tribunal de San Pedro', delay: '72h ouvrées', stamp: 'Timbre d\'État inclus' },
  { name: 'Section de Tribunal de Korhogo', delay: '72h ouvrées', stamp: 'Timbre d\'État inclus' },
  { name: 'Section de Tribunal de Gagnoa / Man', delay: '72h ouvrées', stamp: 'Timbre d\'État inclus' }
];

export const CLIENT_SCENARIOS = [
  {
    id: 'sc_job',
    title: '💼 Candidature & Emploi',
    desc: 'CV Professionnel + Lettre de motivation percutante + Costume virtuel.',
    recommendation: 'Pack CV Premium + Lettre de motivation',
    serviceIds: ['cv-premium', 'lettre-motivation'],
    delay: '2h à 12h'
  },
  {
    id: 'sc_court',
    title: '⚖️ Concours & Administratif',
    desc: 'Casier Judiciaire (Bulletin N°3) + Certificat de Nationalité officiel.',
    recommendation: 'Pack Duo Nationalité & Casier (6 500 F)',
    serviceIds: ['pack-nationalite-casier'],
    delay: '72h (Reçu immédiat dès paiement)'
  },
  {
    id: 'sc_student',
    title: '🎓 Étudiant & Soutenance',
    desc: 'Saisie de mémoire dégressive (200 F/p dès 50p) + Diaporama PowerPoint.',
    recommendation: 'Saisie Texte Pro + PowerPoint Soutenance',
    serviceIds: ['saisie-texte', 'presentation-powerpoint'],
    delay: '24h à 48h'
  },
  {
    id: 'sc_school',
    title: '🏫 Inscription Scolaire (6ème à Tle)',
    desc: 'Inscription en ligne tout niveau secondaire : privé/semi-privé (3 500 F) ou public MENA (6 500 F).',
    recommendation: 'Inscription en Ligne Secondaire (6ème à Terminale)',
    serviceIds: ['inscription-privee', 'inscription-publique'],
    delay: '2h à 24h'
  },
  {
    id: 'sc_biz',
    title: '🚀 Entreprise & Commerce',
    desc: 'Logo vectoriel HD + Carte de visite + Affiche pub + Site vitrine.',
    recommendation: 'Pack Création Identité & Web',
    serviceIds: ['creation-logo', 'carte-de-visite', 'web-vitrine'],
    delay: '24h à 72h'
  }
];

export const INITIAL_POLE_REPLIES: BotQuickReply[] = [
  { id: 'pole_bureau_btn', label: '📄 Bureautique & Documents', action: 'select_pole', payload: 'pole_bureau', icon: 'FileText', primary: true },
  { id: 'pole_pdf_btn', label: '📝 Solutions PDF & Conversion', action: 'select_pole', payload: 'pole_pdf', icon: 'FileEdit' },
  { id: 'pole_design_btn', label: '🎨 Design & Image', action: 'select_pole', payload: 'pole_design', icon: 'Palette' },
  { id: 'pole_web_btn', label: '💻 Développement Web & Apps', action: 'select_pole', payload: 'pole_web', icon: 'Globe' },
  { id: 'pole_scolaire_btn', label: '🎓 Inscription en Ligne & Scolaire', action: 'select_pole', payload: 'pole_scolaire', icon: 'GraduationCap' },
  { id: 'pole_admin_btn', label: '⚖️ Actes Judiciaires (72h)', action: 'select_pole', payload: 'pole_admin', icon: 'Scale' }
];

export const INITIAL_QUICK_REPLIES: BotQuickReply[] = INITIAL_POLE_REPLIES;

export const GREETING_MESSAGE: BotMessage = {
  id: 'msg_welcome',
  sender: 'bot',
  text: `Bonjour et bienvenue chez OKBW Bureautique & Design !\n\nJe suis DEMS, votre assistant virtuel et conseiller dédié. Je vous accompagne pas à pas pour :\n✨ Trouver la formule idéale adaptée à votre situation\n🧮 Calculer vos tarifs dégressifs en direct (FCFA)\n⚖️ Vous guider pour vos documents, démarches et créations\n🚀 Préparer et transmettre votre commande en 1 clic sur WhatsApp.\n\nQuel type de projet souhaitez-vous réaliser aujourd'hui ?`,
  timestamp: new Date(),
  quickReplies: INITIAL_POLE_REPLIES
};

// Normalize text for intelligent keyword matching
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Find service by keyword matching
export function findServiceByKeyword(query: string): ServiceItem | undefined {
  const norm = normalizeQuery(query);

  if (norm.includes('casier') || norm.includes('bulletin') || norm.includes('b3')) {
    return SERVICES_DATA.find(s => s.id === 'casier-judiciaire');
  }
  if (norm.includes('nationalite') || norm.includes('ivoirienne') || norm.includes('certificat')) {
    return SERVICES_DATA.find(s => s.id === 'certificat-nationalite');
  }
  if (norm.includes('pack duo') || norm.includes('duo') || (norm.includes('casier') && norm.includes('nationalite'))) {
    return SERVICES_DATA.find(s => s.id === 'pack-nationalite-casier');
  }
  if (norm.includes('inscription publique') || norm.includes('ecole publique') || norm.includes('mena') || norm.includes('mesrs')) {
    return SERVICES_DATA.find(s => s.id === 'inscription-publique');
  }
  if (norm.includes('inscription') || norm.includes('scolaire') || norm.includes('eleve') || norm.includes('rentree') || norm.includes('etablissement')) {
    return SERVICES_DATA.find(s => s.id === 'inscription-privee');
  }
  if (norm.includes('costume') || norm.includes('cv pro') || norm.includes('cv canadien') || norm.includes('cv premium')) {
    return SERVICES_DATA.find(s => s.id === 'cv-premium');
  }
  if (norm.includes('cv') || norm.includes('curriculum')) {
    return SERVICES_DATA.find(s => s.id === 'cv-standard') || SERVICES_DATA.find(s => s.id === 'cv-premium');
  }
  if (norm.includes('saisie') || norm.includes('memoire') || norm.includes('these') || norm.includes('manuscrit') || norm.includes('dactylographie') || norm.includes('page')) {
    return SERVICES_DATA.find(s => s.id === 'saisie-texte');
  }
  if (norm.includes('lettre') || norm.includes('motivation') || norm.includes('demande')) {
    return SERVICES_DATA.find(s => s.id === 'lettre-motivation');
  }
  if (norm.includes('powerpoint') || norm.includes('ppt') || norm.includes('diapo') || norm.includes('soutenance') || norm.includes('slide')) {
    return SERVICES_DATA.find(s => s.id === 'presentation-powerpoint');
  }
  if (norm.includes('retouche') || norm.includes('restauration') || norm.includes('ancienne photo') || norm.includes('photo')) {
    return SERVICES_DATA.find(s => s.id === 'retouche-photo');
  }
  if (norm.includes('affiche') || norm.includes('flyer') || norm.includes('poster') || norm.includes('visuel')) {
    return SERVICES_DATA.find(s => s.id === 'creation-affiche');
  }
  if (norm.includes('logo') || norm.includes('identite')) {
    return SERVICES_DATA.find(s => s.id === 'creation-logo');
  }
  if (norm.includes('carte de visite') || norm.includes('visite')) {
    return SERVICES_DATA.find(s => s.id === 'carte-de-visite');
  }
  if (norm.includes('modifier pdf') || norm.includes('retouche pdf') || (norm.includes('pdf') && (norm.includes('modif') || norm.includes('editer') || norm.includes('changer')))) {
    return SERVICES_DATA.find(s => s.id === 'modification-pdf');
  }
  if (norm.includes('conversion') || norm.includes('convertir') || norm.includes('word en pdf') || norm.includes('pdf en word')) {
    return SERVICES_DATA.find(s => s.id === 'conversion-simple');
  }
  if (norm.includes('site web') || norm.includes('vitrine') || norm.includes('landing')) {
    return SERVICES_DATA.find(s => s.id === 'web-vitrine');
  }
  if (norm.includes('e-commerce') || norm.includes('boutique') || norm.includes('multipage')) {
    return SERVICES_DATA.find(s => s.id === 'web-multipage');
  }
  if (norm.includes('scan') || norm.includes('numerisation') || norm.includes('archiver')) {
    return SERVICES_DATA.find(s => s.id === 'scan-archivage');
  }
  if (norm.includes('correction') || norm.includes('fautes') || norm.includes('relecture')) {
    return SERVICES_DATA.find(s => s.id === 'correction-reecriture');
  }

  // Exact or partial name match
  return SERVICES_DATA.find(s => {
    const sName = normalizeQuery(s.name);
    return sName.includes(norm) || norm.includes(sName);
  });
}

// Extract number from message for volume calculation
export function extractQuantityFromQuery(query: string): number | null {
  const match = query.match(/\b(\d{1,5})\b/);
  if (match && match[1]) {
    const val = parseInt(match[1], 10);
    if (!isNaN(val) && val > 0 && val < 50000) {
      return val;
    }
  }
  return null;
}

// Build WhatsApp Direct URL for State Machine Order
export function buildStateOrderWhatsAppUrl(params: {
  service: ServiceItem;
  quantity: number;
  customerName?: string;
  instructions?: string;
  totalPrice: number;
}): string {
  const isAdm = isAdministrativeService(params.service);
  const qtyLabel = `${params.quantity} (${params.service.unitLabel})`;

  const message = buildWhatsAppFormattedMessage({
    serviceName: params.service.name,
    quantityText: qtyLabel,
    customerName: params.customerName || 'Client',
    instructions: params.instructions || 'Prestation standard',
    totalAmount: params.totalPrice,
    isAdministrative: isAdm
  });

  return `https://wa.me/${PRIMARY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Generate intelligent bot response for freeform or action-based input
export function processUserQuery(query: string, currentWizardState?: StepWizardState): BotMessage {
  const norm = normalizeQuery(query);
  const now = new Date();

  // 1. HELP / GREETING
  if (norm === 'bonjour' || norm === 'salut' || norm === 'hello' || norm === 'aide' || norm === 'menu' || norm === 'recommencer') {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `Bonjour ! Bienvenue chez OKBW Bureautique & Design. Je suis DEMS, votre assistant virtuel.\n\nQuel type de projet souhaitez-vous réaliser aujourd'hui ? Choisissez un pôle ci-dessous :`,
      timestamp: now,
      quickReplies: INITIAL_POLE_REPLIES
    };
  }

  // 2. SCENARIOS GUIDE (Profiling)
  if (norm.includes('profil') || norm.includes('scenario') || norm.includes('etudiant') || norm.includes('concours') || norm.includes('emploi') || norm.includes('entreprise')) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🎯 Guide Personnalisé selon votre Situation :\n\nChoisissez votre profil pour découvrir la formule adaptée et lancer la commande :`,
      timestamp: now,
      widgetType: 'scenario_guide',
      widgetData: CLIENT_SCENARIOS,
      quickReplies: [
        { id: 'sc_job_btn', label: '💼 Emploi & Recrutement (CV Pro)', action: 'select_service_direct', payload: 'cv-premium', primary: true },
        { id: 'sc_court_btn', label: '⚖️ Concours (Pack Duo 6 500 F)', action: 'select_service_direct', payload: 'pack-nationalite-casier' },
        { id: 'sc_school_btn', label: '🏫 Inscription Scolaire (3 500 F / 6 500 F)', action: 'select_pole', payload: 'pole_scolaire' },
        { id: 'sc_student_btn', label: '🎓 Étudiant (Mémoire / Diaporama)', action: 'select_pole', payload: 'pole_bureau' }
      ]
    };
  }

  // 3. ADMINISTRATIVE & COURT PROCEDURES (Casier / Nationalité)
  if (
    norm.includes('casier') || 
    norm.includes('nationalite') || 
    norm.includes('tribunal') || 
    norm.includes('greffe') || 
    norm.includes('jugement') || 
    norm.includes('timbre') ||
    norm.includes('acte administratif')
  ) {
    const isDuo = norm.includes('pack') || norm.includes('duo') || (norm.includes('casier') && norm.includes('nationalite'));
    const isCasierOnly = norm.includes('casier') && !norm.includes('nationalite');
    const targetService = isDuo 
      ? SERVICES_DATA.find(s => s.id === 'pack-nationalite-casier') 
      : (isCasierOnly ? SERVICES_DATA.find(s => s.id === 'casier-judiciaire') : SERVICES_DATA.find(s => s.id === 'certificat-nationalite'));

    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🏛️ Procédure Réglementaire des Actes Judiciaires & Administratifs\n\nVoici les règles officielles en vigueur en Côte d'Ivoire :\n\n1️⃣ Règlement de la demande : Nécessaire à l'enregistrement pour le paiement effectif des timbres fiscaux d'État et droits de greffe.\n2️⃣ Reçu officiel IMMÉDIAT : Dès confirmation de votre règlement, vous recevez votre reçu officiel de demande et transaction.\n3️⃣ Retrait sous 72h (3 jours ouvrés) : Le document authentifié est retiré au tribunal après signature du magistrat.\n\n📄 Tarifs officiels :\n• Certificat de Nationalité : 3 500 FCFA\n• Casier Judiciaire (Bulletin N°3) : 3 500 FCFA\n• Pack Duo (Nationalité + Casier) : 6 500 FCFA (Économie de 500 F)`,
      timestamp: now,
      widgetType: 'admin_procedure',
      widgetData: targetService || SERVICES_DATA.find(s => s.id === 'certificat-nationalite'),
      quickReplies: [
        { id: 'order_admin_duo', label: '📦 Commander Pack Duo (6 500 F)', action: 'select_service_direct', payload: 'pack-nationalite-casier', primary: true },
        { id: 'order_admin_nat', label: '⚖️ Certificat Nationalité (3 500 F)', action: 'select_service_direct', payload: 'certificat-nationalite' },
        { id: 'order_admin_casier', label: '⚖️ Casier Judiciaire (3 500 F)', action: 'select_service_direct', payload: 'casier-judiciaire' }
      ]
    };
  }

  // 4. PAYMENT / WAVE / SECURITY QUESTIONS
  if (norm.includes('payer') || norm.includes('paiement') || norm.includes('wave') || norm.includes('reglement') || norm.includes('livraison')) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `💳 Modalités de Paiement 100% Sécurisé Wave Business CI :\n\n✅ Bureautique, Design, PDF & Web :\n• Règlement à la livraison sans aucun risque !\n• Vous recevez un aperçu sécurisé de votre document pour validation.\n• Vous réglez ensuite en 1 clic via le lien officiel Wave Business CI pour recevoir vos fichiers finaux HD.\n\n⚖️ Actes Judiciaires & Inscriptions Publiques :\n• Règlement à l'enregistrement requis pour acquitter les timbres fiscaux d'État et droits de greffe.\n• Reçu officiel immédiat dès confirmation du règlement Wave.\n• Retrait physique du document authentifié sous 72h (3 jours).`,
      timestamp: now,
      quickReplies: INITIAL_POLE_REPLIES
    };
  }

  // 5. SPECIFIC SERVICE MATCHING & VOLUME PRICING CALCULATION
  const matchedService = findServiceByKeyword(norm);
  const qty = extractQuantityFromQuery(norm);

  if (matchedService) {
    const finalQty = qty || (matchedService.id === 'saisie-texte' ? 50 : (matchedService.id === 'modification-pdf' ? 5 : 1));
    const pricing = calculateServicePrice(matchedService, finalQty);
    const isCourtService = isAdministrativeService(matchedService);

    let pricingExplanation = `💰 Tarif : ${matchedService.priceDisplay} (${matchedService.unitLabel})`;
    if (qty && qty > 1) {
      pricingExplanation = `💰 Simulation pour ${qty} ${matchedService.unitLabel} :\n• Prix unitaire : ${formatFCFA(pricing.unitPrice)}\n• Montant total : ${formatFCFA(pricing.totalPrice)}${pricing.savings ? `\n🎉 Économie : ${formatFCFA(pricing.savings)}` : ''}`;
    } else if (matchedService.volumeRulesDescription) {
      pricingExplanation += `\n✨ Tarif dégressif : ${matchedService.volumeRulesDescription}`;
    }

    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `📌 ${matchedService.name}\n\n${matchedService.description}\n\n${pricingExplanation}\n\n⏱️ Délai : ${matchedService.deliveryTime}\n\n${isCourtService ? '⚖️ Procédure officielle : Reçu officiel immédiat dès paiement • Retrait physique sous 72h.' : '🛡️ Règlement en toute confiance à la livraison après validation de l\'aperçu.'}`,
      timestamp: now,
      widgetType: 'service_card',
      widgetData: {
        service: matchedService,
        quantity: finalQty,
        pricing
      },
      quickReplies: [
        { id: `order_${matchedService.id}`, label: `🛒 Configurer & Commander (${formatFCFA(pricing.totalPrice)})`, action: 'select_service_direct', payload: matchedService.id, primary: true },
        { id: `calc_${matchedService.id}`, label: '🧮 Simuler une autre quantité', action: 'open_calc_modal', payload: matchedService.id },
        { id: 'menu_poles', label: '📋 Retour aux Pôles', action: 'show_poles' }
      ]
    };
  }

  // 6. CONTACT / HOURS
  if (norm.includes('contact') || norm.includes('numero') || norm.includes('telephone') || norm.includes('ou') || norm.includes('adresse') || norm.includes('localisation') || norm.includes('horaire')) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `📍 Coordonnées OKBW Bureautique & Design :\n\n📱 WhatsApp Principal : ${CONTACT_INFO.whatsappNumber}\n📞 Téléphone Secondaire : ${CONTACT_INFO.secondaryPhone}\n📧 Email : ${CONTACT_INFO.email}\n📍 Localisation : ${CONTACT_INFO.location}\n🕒 Disponibilité : ${CONTACT_INFO.hours}\n\nNous prenons en charge vos demandes physiques et à distance avec livraison express partout en Côte d'Ivoire !`,
      timestamp: now,
      quickReplies: [
        { id: 'contact_whatsapp', label: '💬 Écrire sur WhatsApp', action: 'contact_advisor', primary: true },
        { id: 'menu_poles', label: '🚀 Démarrer une commande', action: 'show_poles' }
      ]
    };
  }

  // 7. FALLBACK
  return {
    id: `bot_${Date.now()}`,
    sender: 'bot',
    text: `Je peux vous aider à configurer votre commande, calculer votre tarif dégressif ou répondre à vos questions.\n\nChoisissez un pôle ci-dessous pour démarrer :`,
    timestamp: now,
    quickReplies: INITIAL_POLE_REPLIES
  };
}
