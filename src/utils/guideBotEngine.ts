import { ServiceItem, TurnaroundOption } from '../types';
import { SERVICES_DATA, CONTACT_INFO } from '../data/servicesData';
import { calculateServicePrice, formatFCFA, TURNAROUND_OPTIONS, ADMINISTRATIVE_LOCKED_TURNAROUND, isAdministrativeService } from './pricing';

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

export interface StepWizardState {
  step: 'category' | 'service' | 'quantity' | 'turnaround' | 'details' | 'summary';
  selectedCategory?: string;
  selectedService?: ServiceItem;
  quantity: number;
  selectedTurnaround?: TurnaroundOption;
  customerName?: string;
  customerNotes?: string;
}

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
    id: 'sc_biz',
    title: '🚀 Entreprise & Commerce',
    desc: 'Logo vectoriel HD + Carte de visite + Affiche pub + Site vitrine.',
    recommendation: 'Pack Création Identité & Web',
    serviceIds: ['creation-logo', 'carte-de-visite', 'web-vitrine'],
    delay: '24h à 72h'
  }
];

export const INITIAL_QUICK_REPLIES: BotQuickReply[] = [
  { id: 'start_guided_order', label: '🚀 Guide de commande pas à pas', action: 'start_wizard', icon: 'Sparkles', primary: true },
  { id: 'admin_services', label: '⚖️ Casier & Nationalité (72h)', action: 'category_admin', icon: 'Scale' },
  { id: 'scenario_help', label: '🎯 Guide selon votre profil (CV, Mémoire, Concours)', action: 'show_scenarios', icon: 'User' },
  { id: 'simulate_price', label: '🧮 Calculer un devis instantané', action: 'open_calc_modal', icon: 'Calculator' },
  { id: 'cv_services', label: '📄 CV Pro & Costume virtuel (1 000 F)', action: 'show_cv', icon: 'FileUser' },
  { id: 'pdf_services', label: '🛠️ Modifier un PDF sans trace', action: 'show_pdf', icon: 'FileEdit' },
  { id: 'payment_faq', label: '💳 Sécurité & Paiement Wave', action: 'faq_payment', icon: 'ShieldCheck' }
];

export const GREETING_MESSAGE: BotMessage = {
  id: 'msg_welcome',
  sender: 'bot',
  text: `👋 Bonjour et bienvenue chez OKBW Bureautique & Design !\n\nJe suis DEMS, votre conseiller interactif et orchestrateur de commande en ligne.\n\nJe suis là pour vous orienter en direct :\n✨ Trouver le service idéal selon vos besoins (Bureautique, CV Pro, Design, Solutions PDF, Actes de justice 72h)\n🧮 Calculer automatiquement vos tarifs dégressifs en FCFA\n🚀 Enregistrer et transmettre votre commande pré-remplie directement sur WhatsApp en 1 clic.\n\nQue souhaitez-vous réaliser aujourd'hui ?`,
  timestamp: new Date(),
  quickReplies: INITIAL_QUICK_REPLIES
};

// Normalize text for intelligent matching
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

// Generate intelligent bot response for freeform or action-based input
export function processUserQuery(query: string, currentWizardState?: StepWizardState): BotMessage {
  const norm = normalizeQuery(query);
  const now = new Date();

  // 1. HELP / GREETING
  if (norm === 'bonjour' || norm === 'salut' || norm === 'hello' || norm === 'aide' || norm === 'menu' || norm === 'recommencer') {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `👋 Bonjour ! Comment puis-je vous orienter aujourd'hui ? Choisissez une option rapide ci-dessous ou posez-moi directement votre question :`,
      timestamp: now,
      quickReplies: INITIAL_QUICK_REPLIES
    };
  }

  // 2. SCENARIOS GUIDE (Profiling)
  if (norm.includes('profil') || norm.includes('scenario') || norm.includes('etudiant') || norm.includes('concours') || norm.includes('emploi') || norm.includes('entreprise')) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `🎯 **Guide Personnalisé selon votre Situation :**\n\nChoisissez votre objectif pour voir immédiatement le pack recommandé, les délais et les pièces nécessaires :`,
      timestamp: now,
      widgetType: 'scenario_guide',
      widgetData: CLIENT_SCENARIOS,
      quickReplies: [
        { id: 'sc_job_btn', label: '💼 Emploi & Recrutement (CV Pro)', action: 'show_cv', primary: true },
        { id: 'sc_court_btn', label: '⚖️ Concours & Actes (Casier/Nat)', action: 'category_admin' },
        { id: 'sc_student_btn', label: '🎓 Étudiant (Mémoire/Soutenance)', action: 'show_student_pack' },
        { id: 'sc_biz_btn', label: '🚀 Entreprise (Logo & Web)', action: 'show_business_pack' }
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
      text: `🏛️ **Procédure Réglementaire des Actes Judiciaires & Administratifs**\n\nVoici les règles strictes en vigueur pour l'obtention de vos actes officiels en Côte d'Ivoire :\n\n1️⃣ **Paiement de la demande (Obligatoire)** : Requis à l'enregistrement pour le règlement effectif des timbres fiscaux d'État et droits de greffe.\n2️⃣ **Reçu officiel IMMÉDIAT** : Dès confirmation de votre règlement, vous recevez votre **reçu officiel de demande & de transaction**.\n3️⃣ **Retrait du Document sous 72h (3 jours ouvrés)** : Le document original légalisé est retiré au tribunal après signature du magistrat.\n\n📄 **Tarifs officiels :**\n• Certificat de Nationalité : **3 500 FCFA**\n• Casier Judiciaire (Bulletin N°3) : **3 500 FCFA**\n• Pack Duo (Nationalité + Casier) : **6 500 FCFA** *(Économie de 500 F)*`,
      timestamp: now,
      widgetType: 'admin_procedure',
      widgetData: targetService || SERVICES_DATA.find(s => s.id === 'certificat-nationalite'),
      quickReplies: [
        { id: 'order_admin_nat', label: '⚖️ Demander Certificat Nationalité (3 500 F)', action: 'open_service_detail', payload: 'certificat-nationalite', primary: true },
        { id: 'order_admin_casier', label: '⚖️ Demander Casier Judiciaire (3 500 F)', action: 'open_service_detail', payload: 'casier-judiciaire' },
        { id: 'order_admin_duo', label: '📦 Demander Pack Duo (6 500 F)', action: 'open_service_detail', payload: 'pack-nationalite-casier' },
        { id: 'admin_docs', label: '📋 Vérifier les pièces requises', action: 'faq_admin_docs' }
      ]
    };
  }

  // 4. REQUIRED DOCUMENTS FOR ADMINISTRATIVE
  if (norm.includes('papier') || norm.includes('document') || norm.includes('piece') || norm.includes('justificatif')) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `📋 **Pièces à fournir pour vos démarches officielles :**\n\n🔹 **Pour le Certificat de Nationalité (3 500 F) :**\n• Extrait d'acte de naissance ou copie intégrale\n• Photocopie CNI / Passeport / Attestation du demandeur\n• Pièce d'identité ou Certificat de nationalité d'un parent ivoirien\n• 1 photo d'identité couleur récente\n\n🔹 **Pour le Casier Judiciaire (3 500 F) :**\n• Extrait d'acte de naissance lisible\n• Photocopie CNI / Passeport valide\n• Précision du lieu & date de naissance pour le greffe compétent\n\n📲 *Vous pouvez simplement envoyer les photos ou scans de ces pièces directement sur WhatsApp.*`,
      timestamp: now,
      widgetType: 'docs_checklist',
      quickReplies: [
        { id: 'order_admin_duo', label: '🚀 Démarrer la démarche maintenant', action: 'open_service_detail', payload: 'pack-nationalite-casier', primary: true },
        { id: 'start_guided_order', label: 'Autres services', action: 'start_wizard' }
      ]
    };
  }

  // 5. PAYMENT / WAVE / SECURITY QUESTIONS
  if (norm.includes('payer') || norm.includes('paiement') || norm.includes('wave') || norm.includes('orange') || norm.includes('mtn') || norm.includes('moov') || norm.includes('reglement') || norm.includes('livraison')) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `💳 **Modalités de Paiement & Garanties Sécurisées :**\n\n✅ **Bureautique, Design, PDF & Infographie :**\n• **Règlement à la livraison** sans aucun risque !\n• Vous recevez d'abord un aperçu sécurisé de votre document pour validation.\n• Vous réglez ensuite en 1 clic via le lien officiel **Wave Business** ou Mobile Money envoyé par votre opérateur pour recevoir vos fichiers HD.\n\n⚖️ **Actes Judiciaires (Casier & Nationalité) :**\n• Paiement à l'enregistrement obligatoire pour l'achat des timbres fiscaux d'État.\n• **Reçu officiel de demande et transaction transmis IMMÉDIATEMENT** dès confirmation du règlement.\n• Retrait physique du document sous 72h (3 jours).`,
      timestamp: now,
      quickReplies: [
        { id: 'start_guided_order', label: '🚀 Passer une commande', action: 'start_wizard', primary: true },
        { id: 'simulate_price', label: '🧮 Simuler mon montant', action: 'open_calc_modal' }
      ]
    };
  }

  // 6. TURNAROUND / DELAYS / URGENCY
  if (norm.includes('delai') || norm.includes('temps') || norm.includes('combien de temps') || norm.includes('heure') || norm.includes('urgent') || norm.includes('express')) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `⏱️ **Nos Délais de Réalisation :**\n\n⚡ **Moins de 2 Heures (Ultra Express)** : Idéal pour modifications urgentes de PDF, CV urgents, conversions.\n🚀 **Moins de 12 Heures (Express Journée)** : Saisie rapide, lettres de motivation, affiches simples.\n⏰ **24 à 48 Heures (Délai Standard)** : Diaporamas PowerPoint, Logos créatifs, gros mémoires.\n⚖️ **72 Heures strictes (3 jours ouvrés)** : Démarches judiciaires (Casier judiciaire & Nationalité au tribunal).\n\n*Précisez votre délai souhaité lors de la commande !*`,
      timestamp: now,
      quickReplies: [
        { id: 'start_guided_order', label: '🚀 Choisir ma prestation', action: 'start_wizard', primary: true },
        { id: 'contact_human', label: '📞 Urgence immédiate WhatsApp', action: 'contact_advisor' }
      ]
    };
  }

  // 7. SPECIFIC SERVICE MATCHING & VOLUME PRICING CALCULATION
  const matchedService = findServiceByKeyword(norm);
  const qty = extractQuantityFromQuery(norm);

  if (matchedService) {
    const finalQty = qty || (matchedService.id === 'saisie-texte' ? 55 : (matchedService.id === 'modification-pdf' ? 6 : 1));
    const pricing = calculateServicePrice(matchedService, finalQty);
    const isCourtService = isAdministrativeService(matchedService);

    let pricingExplanation = `💰 **Tarif : ${matchedService.priceDisplay}** (${matchedService.unitLabel})`;
    if (qty && qty > 1) {
      pricingExplanation = `💰 **Simulation pour ${qty} ${matchedService.unitLabel} :**\n• Prix unitaire : **${formatFCFA(pricing.unitPrice)}**\n• Montant total : **${formatFCFA(pricing.totalPrice)}**${pricing.savings ? `\n🎉 *Économie réalisée : ${formatFCFA(pricing.savings)}*` : ''}`;
    } else if (matchedService.volumeRulesDescription) {
      pricingExplanation += `\n✨ *Tarif dégressif : ${matchedService.volumeRulesDescription}*`;
    }

    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `📌 **${matchedService.name}**\n\n${matchedService.description}\n\n${pricingExplanation}\n\n⏱️ **Délai :** ${matchedService.deliveryTime}\n\n${isCourtService ? '⚖️ *Procédure officielle : Reçu immédiat dès paiement • Retrait physique du document sous 72h.*' : '🛡️ *Règlement en toute confiance à la livraison après validation de l\'aperçu.*'}`,
      timestamp: now,
      widgetType: 'service_card',
      widgetData: {
        service: matchedService,
        quantity: finalQty,
        pricing
      },
      quickReplies: [
        { id: `order_${matchedService.id}`, label: `🛒 Configurer & Commander (${formatFCFA(pricing.totalPrice)})`, action: 'open_service_detail', payload: matchedService.id, primary: true },
        { id: `calc_${matchedService.id}`, label: '🧮 Simuler une autre quantité', action: 'open_calc_modal', payload: matchedService.id },
        { id: 'see_all_services', label: '👀 Voir les autres services', action: 'scroll_catalog' }
      ]
    };
  }

  // 8. LOCATION / CONTACT / HOURS
  if (norm.includes('contact') || norm.includes('numero') || norm.includes('telephone') || norm.includes('ou') || norm.includes('adresse') || norm.includes('localisation') || norm.includes('horaire')) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: `📍 **Coordonnées OKBW Bureautique & Design :**\n\n📱 **WhatsApp Principal :** ${CONTACT_INFO.whatsappNumber}\n📞 **Téléphone Secondaire :** ${CONTACT_INFO.secondaryPhone}\n📧 **Email :** ${CONTACT_INFO.email}\n📍 **Localisation :** ${CONTACT_INFO.location}\n🕒 **Disponibilité :** ${CONTACT_INFO.hours}\n\n*Nous prenons en charge vos demandes physiques et à distance avec livraison express partout en Côte d'Ivoire et à l'international !*`,
      timestamp: now,
      quickReplies: [
        { id: 'contact_whatsapp', label: '💬 Écrire sur WhatsApp', action: 'contact_advisor', primary: true },
        { id: 'start_guided_order', label: '🚀 Démarrer une commande', action: 'start_wizard' }
      ]
    };
  }

  // 9. FALLBACK INTELLIGENT MATCH
  return {
    id: `bot_${Date.now()}`,
    sender: 'bot',
    text: `Je peux vous aider à commander, calculer un tarif exact ou vous orienter parmi toutes nos prestations :\n\n• **Bureautique & Rédaction :** CV canadiens/pros, saisie de thèses/mémoires, lettres de motivation, diaporamas.\n• **Design Graphique :** Logos, affiches, retouches photos anciennes, cartes de visite.\n• **Solutions PDF :** Modifications sans trace, conversions Word/Excel.\n• **Actes Judiciaires (72h) :** Casier judiciaire, Certificat de nationalité ivoirienne.\n\nSélectionnez une option rapide ou dites-moi précisément ce dont vous avez besoin :`,
    timestamp: now,
    quickReplies: INITIAL_QUICK_REPLIES
  };
}

